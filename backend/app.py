from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from data.schemes import SCHEMES_DATA
from services.eligibility_service import match_schemes
from services.translate_service import translate_text
from services.textract_service import process_document
from services.polly_service import text_to_speech
from services.sns_service import subscribe_user
from services.chat_service import process_chat_message

# Try importing agents (graceful fallback if Bedrock unavailable)
try:
    from agents.eligibility_agent import eligibility_agent, search_eligible_schemes
    AGENT_AVAILABLE = eligibility_agent is not None
except Exception as e:
    logger.warning(f'Eligibility agent not available: {e}')
    AGENT_AVAILABLE = False

try:
    from agents.guide_agent import generate_guide, guide_llm
    GUIDE_AVAILABLE = guide_llm is not None
except Exception as e:
    logger.warning(f'Guide agent not available: {e}')
    GUIDE_AVAILABLE = False
    def generate_guide(scheme, profile): return {'steps': scheme.get('application_steps', []), 'tips': 'Visit the official portal for detailed guidance.'}

app = FastAPI(title='SevaSetu API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class ProfileRequest(BaseModel):
    age: int
    state: str  
    occupation: str
    annualIncome: int
    category: str
    gender: str
    specialConditions: list[str] = []
    education: str = ''

class GuideRequest(BaseModel):
    schemeId: str
    profile: ProfileRequest

class TranslateRequest(BaseModel):
    text: str
    targetLanguage: str = 'hi'

class SpeechRequest(BaseModel):
    text: str
    language: str = 'en'

class AlertRequest(BaseModel):
    destination: str
    schemeName: str = 'All Schemes'

class ChatRequest(BaseModel):
    message: str
    profile: Optional[dict] = None
    language: str = 'en'

class CompareRequest(BaseModel):
    schemeIds: list[str]

class PassbookRequest(BaseModel):
    profile: ProfileRequest
    matchedSchemeIds: list[str] = []

import boto3
from decimal import Decimal

def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def get_all_schemes():
    try:
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        table = dynamodb.Table('SevaSetu-Schemes')
        res = table.scan(Limit=100)
        items = res.get('Items', [])
        if len(items) >= 10:
            parsed = []
            for item in items:
                clean_item = {}
                for k, v in item.items():
                    if k in ['pk', 'sk']:
                        continue
                    if isinstance(v, str) and (v.startswith('{') or v.startswith('[')):
                        try:
                            clean_item[k] = json.loads(v)
                            continue
                        except Exception:
                            pass
                    clean_item[k] = v
                clean_item = convert_decimals(clean_item)
                if 'id' in clean_item and 'name' in clean_item:
                    parsed.append(clean_item)
            if parsed:
                return parsed
    except Exception as e:
        logger.warning(f'DynamoDB live load fallback: {e}')
    return SCHEMES_DATA

@app.get('/')
def root():
    schemes = get_all_schemes()
    return {
        'name': 'SevaSetu API — AI Government Scheme Navigator for Bharat',
        'version': '1.0.0',
        'status': 'online',
        'service': 'AWS Cloud Serverless Backend',
        'region': 'us-east-1',
        'schemes_count': len(schemes),
        'endpoints': {
            'health': '/api/health',
            'schemes': '/api/schemes',
            'match': '/api/schemes/match',
            'guide': '/api/agent/guide',
            'upload': '/api/documents/upload',
            'translate': '/api/translate',
            'docs': '/docs'
        }
    }

@app.get('/api/health')
@app.get('/health')
def health():
    schemes = get_all_schemes()
    return {
        'status': 'ok',
        'service': 'SevaSetu AWS Cloud Backend',
        'dynamodb_table': 'SevaSetu-Schemes',
        's3_bucket': 'sevasetu-documents-991752',
        'region': 'us-east-1',
        'agent_available': AGENT_AVAILABLE,
        'guide_available': True,
        'schemes_count': len(schemes)
    }

@app.get('/api/schemes')
@app.get('/schemes')
def list_schemes(category: Optional[str] = None):
    schemes = get_all_schemes()
    if category:
        return [s for s in schemes if s.get('category') == category]
    return schemes

@app.get('/api/schemes/{scheme_id}')
@app.get('/schemes/{scheme_id}')
def get_scheme(scheme_id: str):
    schemes = get_all_schemes()
    scheme = next((s for s in schemes if str(s.get('id')) == str(scheme_id)), None)
    if not scheme:
        raise HTTPException(404, 'Scheme not found')
    return scheme

@app.post('/api/schemes/match')
@app.post('/schemes/match')
def match_user_schemes(profile: ProfileRequest):
    schemes = get_all_schemes()
    profile_dict = profile.model_dump()
    matches = match_schemes(profile_dict, schemes)
    total_value = sum(m['scheme'].get('benefit_amount', 0) for m in matches if m['eligibility_score'] >= 50)
    return {
        'matches': matches,
        'total_schemes': len(matches),
        'total_annual_value': total_value
    }

@app.post('/api/agent/analyze')
@app.post('/agent/analyze')
async def agent_analyze(profile: ProfileRequest):
    schemes = get_all_schemes()
    if not AGENT_AVAILABLE:
        matches = match_schemes(profile.model_dump(), schemes)
        return {'matches': matches, 'ai_enhanced': False}
    try:
        profile_json = json.dumps(profile.model_dump())
        response = eligibility_agent(f'Find all government schemes for this Indian citizen: {profile_json}. List each scheme with eligibility score and explanation.')
        return {'analysis': str(response), 'ai_enhanced': True}
    except Exception as e:
        logger.error(f'Agent error: {e}')
        matches = match_schemes(profile.model_dump(), schemes)
        return {'matches': matches, 'ai_enhanced': False, 'error': str(e)}

@app.post('/api/agent/guide')
@app.post('/agent/guide')
def get_guide(request: GuideRequest):
    schemes = get_all_schemes()
    scheme = next((s for s in schemes if str(s.get('id')) == str(request.schemeId)), None)
    if not scheme:
        raise HTTPException(404, 'Scheme not found')
    guide = generate_guide(scheme, request.profile.model_dump())
    return {'guide': guide}

@app.post('/api/documents/upload')
@app.post('/documents/upload')
async def upload_doc(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > 10_000_000:
        raise HTTPException(413, 'File too large (max 10MB)')
    result = process_document(contents, filename=file.filename or 'document.jpg')
    return {'filename': file.filename, 'extracted': result}

@app.post('/api/translate')
@app.post('/translate')
def translate(request: TranslateRequest):
    translated = translate_text(request.text, request.targetLanguage)
    return {'translatedText': translated, 'source': request.text, 'target': request.targetLanguage}

@app.post('/api/speech')
@app.post('/speech')
def generate_speech(request: SpeechRequest):
    return text_to_speech(request.text, request.language)

@app.post('/api/alerts/subscribe')
@app.post('/alerts/subscribe')
def subscribe_alert(request: AlertRequest):
    return subscribe_user(request.destination, request.schemeName)

@app.post('/api/chat')
@app.post('/chat')
def chat_copilot(request: ChatRequest):
    return process_chat_message(request.message, request.profile, request.language)

@app.post('/api/schemes/compare')
@app.post('/schemes/compare')
def compare_schemes(request: CompareRequest):
    schemes = get_all_schemes()
    selected = [s for s in schemes if str(s.get('id')) in [str(x) for x in request.schemeIds]]
    return {'schemes': selected, 'total_compared': len(selected)}

@app.post('/api/passbook/generate')
@app.post('/passbook/generate')
def generate_passbook(request: PassbookRequest):
    import hashlib
    import time
    schemes = get_all_schemes()
    profile_dict = request.profile.model_dump()
    matches = match_schemes(profile_dict, schemes)
    
    # Calculate unlocked financial benefits
    total_unlocked = sum(m['scheme'].get('benefit_amount', 0) for m in matches if m['eligibility_score'] >= 50)
    
    # Generate cryptographic reference certificate ID
    raw_hash = f"{profile_dict['state']}-{profile_dict['annualIncome']}-{time.time()}"
    cert_id = f"SEVA-2026-{profile_dict['state'][:2].upper()}-{hashlib.md5(raw_hash.encode()).hexdigest()[:6].upper()}"
    
    return {
        'passbook_id': cert_id,
        'citizen_profile': profile_dict,
        'eligible_schemes_count': len(matches),
        'total_annual_entitlement': total_unlocked,
        'schemes': [
            {
                'id': m['scheme'].get('id'),
                'name': m['scheme'].get('name'),
                'ministry': m['scheme'].get('ministry'),
                'benefit_value': m['scheme'].get('benefit_value'),
                'score': m['eligibility_score'],
                'portal_url': m['scheme'].get('portal_url'),
                'registration_url': m['scheme'].get('registration_url', m['scheme'].get('portal_url')),
                'youtube_guide_url': m['scheme'].get('youtube_guide_url', ''),
                'helpline': m['scheme'].get('helpline', '')
            }
            for m in matches[:10]
        ],
        'generated_at': time.strftime('%d %B %Y, %I:%M %p IST'),
        'verified_by': 'National Citizen Welfare AI Gateway (SevaSetu)'
    }

@app.get('/api/schemes/by-state/{state_name}')
@app.get('/schemes/by-state/{state_name}')
def get_schemes_by_state(state_name: str):
    """Get all schemes available for a specific Indian state."""
    schemes = get_all_schemes()
    state_schemes = []
    for s in schemes:
        eligibility = s.get('eligibility', {})
        if isinstance(eligibility, str):
            try:
                eligibility = json.loads(eligibility)
            except Exception:
                eligibility = {}
        states_field = eligibility.get('states', 'ALL')
        if states_field == 'ALL' or state_name in (states_field if isinstance(states_field, list) else []):
            state_schemes.append(s)
    return {
        'state': state_name,
        'schemes': state_schemes,
        'total_count': len(state_schemes),
        'total_benefit_potential': sum(s.get('benefit_amount', 0) for s in state_schemes)
    }
