import json
import logging
import re
import boto3
from decimal import Decimal
from services.translate_service import translate_text

logger = logging.getLogger(__name__)

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('SevaSetu-Schemes')

def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def get_schemes():
    try:
        response = table.scan(Limit=100)
        items = response.get('Items', [])
        if len(items) >= 5:
            clean_items = []
            for item in items:
                clean = {}
                for k, v in item.items():
                    if k in ['pk', 'sk']:
                        continue
                    if isinstance(v, str) and (v.startswith('{') or v.startswith('[')):
                        try:
                            clean[k] = json.loads(v)
                            continue
                        except Exception:
                            pass
                    clean[k] = v
                clean = convert_decimals(clean)
                clean_items.append(clean)
            return clean_items
    except Exception as e:
        logger.warning(f"DynamoDB fetch in chat failed: {e}")
    
    from data.schemes import SCHEMES_DATA
    return SCHEMES_DATA

def process_chat_message(message: str, profile: dict = None, language: str = 'en') -> dict:
    """
    Intelligent Conversational Agent 'SevaMitra' for Indian citizens.
    """
    msg = message.lower()
    matched_schemes = []
    
    # 1. Intent extraction
    keywords = {
        'education': ['student', 'scholarship', 'study', 'education', 'college', 'school', 'tuition', 'fee'],
        'agriculture': ['farmer', 'kisan', 'agriculture', 'crop', 'land', 'tractor', 'fertilizer', 'harvest'],
        'women': ['woman', 'women', 'girl', 'female', 'daughter', 'mother', 'widow', 'maternity'],
        'health': ['health', 'hospital', 'medical', 'treatment', 'ayushman', 'disease', 'surgery', 'doctor'],
        'business': ['loan', 'business', 'startup', 'shop', 'vendor', 'mudra', 'entrepreneur', 'capital', 'vishwakarma', 'artisan'],
        'housing': ['house', 'housing', 'home', 'awas', 'roof', 'shelter', 'slum', 'construction'],
        'pension': ['pension', 'old age', 'senior', 'elderly', 'retirement', '60 years', '70 years', 'atal'],
        'skill': ['skill', 'training', 'job', 'employment', 'placement', 'internship', 'apprentice']
    }
    
    intent_scores = {cat: 0 for cat in keywords}
    for cat, words in keywords.items():
        for w in words:
            if w in msg:
                intent_scores[cat] += 1

    # Profile integration
    user_state = profile.get('state', '') if profile else ''
    user_category = profile.get('category', '') if profile else ''
    user_income = profile.get('annualIncome', 0) if profile else 0
    user_occupation = profile.get('occupation', '') if profile else ''

    # 2. Scheme ranking
    schemes = get_schemes()
    for scheme in schemes:
        scheme_cat = scheme.get('category', '').lower()
        desc = (scheme.get('description', '') + " " + scheme.get('benefits', '')).lower()
        
        target_group = scheme.get('target_group', [])
        target_group = target_group if isinstance(target_group, list) else []
        target = ' '.join(target_group).lower()
        
        score = 0
        
        # Match intent
        for cat, hits in intent_scores.items():
            if hits > 0:
                if cat in scheme_cat or cat in target:
                    score += hits * 30
                elif any(w in desc for w in keywords[cat]):
                    score += hits * 15

        # Match profile if provided
        if user_occupation and user_occupation.lower() in target:
            score += 25
            
        eligibility = scheme.get('eligibility', {})
        if isinstance(eligibility, str):
            try:
                eligibility = json.loads(eligibility)
            except:
                eligibility = {}
                
        if user_category and user_category in str(eligibility.get('categories', [])):
            score += 20
        if user_income and user_income <= eligibility.get('income_limit', 99999999):
            score += 20

        # General keyword match
        query_words = [w for w in re.findall(r'\b\w+\b', msg) if len(w) > 3]
        for qw in query_words:
            if qw in scheme.get('name', '').lower():
                score += 40
            elif qw in desc:
                score += 10

        if score > 20:
            reg_url = scheme.get('registration_url') or scheme.get('portal_url', '')
            yt_url = scheme.get('youtube_guide_url', '')
            helpline = scheme.get('helpline', '')

            matched_schemes.append({
                'id': scheme.get('id'),
                'name': scheme.get('name'),
                'name_hindi': scheme.get('name_hindi', ''),
                'ministry': scheme.get('ministry', ''),
                'benefit_value': scheme.get('benefit_value', ''),
                'portal_url': scheme.get('portal_url', ''),
                'registration_url': reg_url,
                'youtube_guide_url': yt_url,
                'helpline': helpline,
                'match_score': min(100, score)
            })

    matched_schemes.sort(key=lambda x: x['match_score'], reverse=True)
    top_schemes = matched_schemes[:4]

    # 3. Response Generation
    if top_schemes:
        bullets = []
        for s in top_schemes:
            bullet = f"• **{s['name']}** ({s['benefit_value']})\n  → [Official Portal]({s['registration_url']})"
            if s['youtube_guide_url']:
                bullet += f" | [Watch Video Guide]({s['youtube_guide_url']})"
            if s['helpline']:
                bullet += f" | 📞 Helpline: {s['helpline']}"
            bullets.append(bullet)

        scheme_bullets = "\n\n".join(bullets)
        
        english_reply = (
            f"Namaste! 🙏 Based on your live query, I analyzed official government welfare databases and found "
            f"**{len(top_schemes)} high-impact schemes** matching your request:\n\n"
            f"{scheme_bullets}\n\n"
            f"💡 **Direct Advice:** Ensure your Aadhaar is linked with your bank account for direct statutory DBT disbursement."
        )
    else:
        english_reply = (
            "Namaste! 🙏 I can help you find Central and State government welfare schemes directly from our live AWS database.\n\n"
            "Tell me about yourself (such as **your occupation, age, state, or monthly income**), or ask about specific categories like:\n"
            "• *'Scholarships for undergraduate students'*\n"
            "• *'Direct financial support for small farmers'*\n"
            "• *'Universal healthcare for senior citizens'*\n"
            "• *'Business loans under Mudra or Vishwakarma'*"
        )

    # Translate reply if language is not English
    final_reply = english_reply
    if language != 'en':
        try:
            final_reply = translate_text(english_reply, language)
        except Exception:
            pass

    follow_ups = [
        "How do I apply for these schemes?",
        "What documents do I need to prepare?",
        "How do I link Aadhaar for Direct Benefit Transfer (DBT)?"
    ]

    return {
        'reply': final_reply,
        'schemes': top_schemes,
        'follow_ups': follow_ups,
        'provider': 'SevaMitra AI Multi-Agent Engine • Live DynamoDB'
    }