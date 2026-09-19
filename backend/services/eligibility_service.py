def match_schemes(profile_dict, schemes_list):
    matches = []
    
    p_age = profile_dict.get('age')
    p_income = profile_dict.get('annualIncome')
    p_category = profile_dict.get('category')
    p_gender = profile_dict.get('gender')
    p_occupation = profile_dict.get('occupation')
    p_special = set(profile_dict.get('specialConditions', []))
    p_state = profile_dict.get('state')

    for scheme in schemes_list:
        eligibility = scheme.get('eligibility', {})
        if isinstance(eligibility, str):
            import json
            try:
                eligibility = json.loads(eligibility)
            except:
                eligibility = {}
        
        score = 0
        reasons = []
        missing = []
        
        # Age (20 pts)
        min_age = eligibility.get('min_age')
        max_age = eligibility.get('max_age')
        if min_age is not None or max_age is not None:
            if p_age is not None:
                age_ok = True
                if min_age is not None and p_age < min_age:
                    age_ok = False
                if max_age is not None and p_age > max_age:
                    age_ok = False
                if age_ok:
                    score += 20
                    reasons.append(f'Age {p_age} within eligible range')
                else:
                    missing.append(f'Age {p_age} outside range ({min_age or "any"}-{max_age or "any"})')
            else:
                missing.append('Age not provided')
        else:
            score += 10  # No age restriction = neutral (half points)
            
        # Income (20 pts)
        income_limit = eligibility.get('income_limit')
        if income_limit is not None:
            if p_income is not None:
                if p_income <= income_limit:
                    score += 20
                    reasons.append(f'Income ₹{p_income:,} within ₹{income_limit:,} limit')
                else:
                    missing.append(f'Income ₹{p_income:,} exceeds ₹{income_limit:,} limit')
            else:
                missing.append('Income not provided')
        else:
            score += 10  # No income restriction = neutral
            
        # Category (20 pts)
        categories = eligibility.get('categories')
        if categories and isinstance(categories, list) and len(categories) > 0:
            if p_category and p_category in categories:
                score += 20
                reasons.append(f'{p_category} category eligible')
            elif p_category:
                missing.append(f'{p_category} category not in eligible list')
            else:
                missing.append('Category not provided')
        else:
            score += 10  # Open to all categories = neutral
            
        # Gender (15 pts)
        genders = eligibility.get('gender')
        if genders and isinstance(genders, list) and len(genders) > 0:
            if p_gender and p_gender in genders:
                score += 15
                reasons.append(f'{p_gender} gender eligible')
            elif p_gender:
                missing.append(f'Restricted to {genders}')
            else:
                missing.append('Gender not provided')
        else:
            score += 8  # Open to all genders = neutral
            
        # Occupation (15 pts)
        occupations = eligibility.get('occupations')
        if occupations and isinstance(occupations, list) and len(occupations) > 0:
            if p_occupation and p_occupation in occupations:
                score += 15
                reasons.append(f'{p_occupation} occupation eligible')
            elif p_occupation:
                missing.append(f'Restricted to occupations: {occupations}')
            else:
                missing.append('Occupation not provided')
        else:
            score += 8  # Open to all occupations = neutral
            
        # Special Conditions (10 pts)
        conditions = eligibility.get('special_conditions')
        if conditions and isinstance(conditions, list) and len(conditions) > 0:
            matched_conditions = p_special.intersection(set(conditions))
            if matched_conditions:
                score += 10
                reasons.append(f'Matches: {list(matched_conditions)}')
            else:
                missing.append(f'Requires: {conditions}')
        else:
            score += 5  # No special conditions = neutral

        # State check (bonus/penalty, not scored but filters)
        states = eligibility.get('states')
        if states and states != 'ALL' and isinstance(states, list):
            if p_state and p_state in states:
                score += 5  # Bonus for state match
                reasons.append(f'Available in {p_state}')
            elif p_state:
                score = max(0, score - 15)  # Penalty for wrong state
                missing.append(f'Not available in {p_state}')
        
        # Only include if score >= 30 (meaningful match)
        if score >= 30:
            matches.append({
                'scheme': scheme,
                'eligibility_score': min(100, score),
                'match_reasons': reasons,
                'missing_criteria': missing
            })
            
    matches.sort(key=lambda x: x['eligibility_score'], reverse=True)
    return matches
