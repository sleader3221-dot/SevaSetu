def match_schemes(profile_dict, schemes_list):
    matches = []
    
    p_age = profile_dict.get('age')
    p_income = profile_dict.get('annualIncome')
    p_category = profile_dict.get('category')
    p_gender = profile_dict.get('gender')
    p_occupation = profile_dict.get('occupation')
    p_special = set(profile_dict.get('specialConditions', []))
    p_education = profile_dict.get('education')
    p_state = profile_dict.get('state')

    for scheme in schemes_list:
        eligibility = scheme.get('eligibility', {})
        score = 0
        max_score = 100
        
        reasons = []
        missing = []
        
        # Age (20 pts)
        min_age = eligibility.get('min_age')
        max_age = eligibility.get('max_age')
        if min_age is not None or max_age is not None:
            if p_age is not None:
                if (min_age is None or p_age >= min_age) and (max_age is None or p_age <= max_age):
                    score += 20
                    reasons.append('Age matches criteria')
                else:
                    missing.append('Age out of range')
            else:
                missing.append('Age not provided')
        else:
            score += 20
            
        # Income (20 pts)
        income_limit = eligibility.get('income_limit')
        if income_limit is not None:
            if p_income is not None:
                if p_income <= income_limit:
                    score += 20
                    reasons.append('Income within limit')
                else:
                    missing.append('Income exceeds limit')
            else:
                missing.append('Income not provided')
        else:
            score += 20
            
        # Category (20 pts)
        categories = eligibility.get('categories')
        if categories:
            if p_category and p_category in categories:
                score += 20
                reasons.append('Category matches')
            else:
                missing.append('Category not eligible')
        else:
            score += 20
            
        # Gender (15 pts)
        genders = eligibility.get('gender')
        if genders:
            if p_gender and p_gender in genders:
                score += 15
                reasons.append('Gender matches')
            else:
                missing.append('Gender not eligible')
        else:
            score += 15
            
        # Occupation (15 pts)
        occupations = eligibility.get('occupations')
        if occupations:
            if p_occupation and p_occupation in occupations:
                score += 15
                reasons.append('Occupation matches')
            else:
                missing.append('Occupation not eligible')
        else:
            score += 15
            
        # Special Conditions (10 pts)
        conditions = eligibility.get('special_conditions')
        if conditions:
            if p_special.intersection(conditions):
                score += 10
                reasons.append('Special conditions match')
            else:
                missing.append('Special conditions not met')
        else:
            score += 10
            
        if score >= 30:
            matches.append({
                'scheme': scheme,
                'eligibility_score': score,
                'match_reasons': reasons,
                'missing_criteria': missing
            })
            
    matches.sort(key=lambda x: x['eligibility_score'], reverse=True)
    return matches
