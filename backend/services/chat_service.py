import json
import logging
import re
from data.schemes import SCHEMES_DATA
from services.translate_service import translate_text

logger = logging.getLogger(__name__)

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
        'business': ['loan', 'business', 'startup', 'shop', 'vendor', 'mudra', 'entrepreneur', 'capital'],
        'housing': ['house', 'housing', 'home', 'awas', 'roof', 'shelter', 'slum', 'construction'],
        'pension': ['pension', 'old age', 'senior', 'elderly', 'retirement', '60 years', 'atal'],
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
    for scheme in SCHEMES_DATA:
        scheme_cat = scheme.get('category', '').lower()
        desc = (scheme.get('description', '') + " " + scheme.get('benefits', '')).lower()
        target = ' '.join(scheme.get('target_group', [])).lower()
        
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
        if user_category and user_category in str(scheme.get('eligibility', {}).get('categories', [])):
            score += 20
        if user_income and user_income <= scheme.get('eligibility', {}).get('income_limit', 99999999):
            score += 20

        # General keyword match
        query_words = [w for w in re.findall(r'\b\w+\b', msg) if len(w) > 3]
        for qw in query_words:
            if qw in scheme.get('name', '').lower():
                score += 40
            elif qw in desc:
                score += 10

        if score > 20:
            matched_schemes.append({
                'id': scheme.get('id'),
                'name': scheme.get('name'),
                'name_hindi': scheme.get('name_hindi', ''),
                'ministry': scheme.get('ministry', ''),
                'benefit_value': scheme.get('benefit_value', ''),
                'portal_url': scheme.get('portal_url', ''),
                'match_score': min(100, score)
            })

    matched_schemes.sort(key=lambda x: x['match_score'], reverse=True)
    top_schemes = matched_schemes[:4]

    # 3. Response Generation
    if top_schemes:
        scheme_bullets = "\n".join([
            f"• **{s['name']}** ({s['benefit_value']}) — Direct Link: [Official Portal]({s['portal_url']})"
            for s in top_schemes
        ])
        
        english_reply = (
            f"Namaste! 🙏 Based on your query, I analyzed government welfare schemes and found "
            f"**{len(top_schemes)} high-impact schemes** you may qualify for:\n\n"
            f"{scheme_bullets}\n\n"
            f"💡 **Next Step:** Ensure your Aadhaar is linked to your active bank account for seamless Direct Benefit Transfer (DBT)."
        )
    else:
        english_reply = (
            "Namaste! 🙏 I can help you discover Central and State government welfare schemes. "
            "Could you tell me a bit more about yourself, such as your **age, state, occupation, and family income**? "
            "For example: *'I am a 21-year-old female student in Uttar Pradesh with annual income 2 lakhs.'*"
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
        'provider': 'SevaMitra AI Multi-Agent Engine'
    }