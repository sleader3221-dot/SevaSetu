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



