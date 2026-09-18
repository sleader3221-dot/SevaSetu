from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class SchemeCategory(str, Enum):
    EDUCATION = 'Education'
    HEALTH = 'Health'
    AGRICULTURE = 'Agriculture'
    HOUSING = 'Housing'
    FINANCE = 'Finance'
    EMPLOYMENT = 'Employment'
    WOMEN_CHILD = 'Women & Child'
    SOCIAL_WELFARE = 'Social Welfare'
    MSME = 'MSME'
    OTHER = 'Other'

class Category(str, Enum):
    GENERAL = 'General'
    OBC = 'OBC'
    SC = 'SC'
    ST = 'ST'
    EWS = 'EWS'

class EligibilityCriteria(BaseModel):
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    income_limit: Optional[int] = None
    categories: Optional[List[str]] = None
    states: Optional[List[str]] = None
    gender: Optional[List[str]] = None
    occupations: Optional[List[str]] = None
    education: Optional[List[str]] = None
    special_conditions: Optional[List[str]] = None

class Scheme(BaseModel):
    id: str
    name: str
    name_hindi: str
    ministry: str
    description: str
    benefits: str
    benefit_value: str
    benefit_amount: int
    eligibility: EligibilityCriteria = Field(default_factory=EligibilityCriteria)
    application_steps: List[str] = Field(default_factory=list)
    required_documents: List[str] = Field(default_factory=list)
    portal_url: str
    deadline: Optional[str] = None
    category: str
    target_group: List[str] = Field(default_factory=list)

    def __init__(self, **data):
        if 'eligibility' in data and isinstance(data['eligibility'], dict):
            data['eligibility'] = EligibilityCriteria(**data['eligibility'])
        super().__init__(**data)

class UserProfile(BaseModel):
    age: int
    state: str
    occupation: str
    annualIncome: int
    category: str
    gender: str
    specialConditions: List[str] = Field(default_factory=list)
    education: str = ''

class SchemeMatchRequest(BaseModel):
    profile: UserProfile

class GuideRequest(BaseModel):
    schemeId: str
    profile: UserProfile

class TranslateRequest(BaseModel):
    text: str
    targetLanguage: str = 'hi'

class SchemeMatch(BaseModel):
    scheme: Dict[str, Any]
    eligibility_score: int
    match_reasons: List[str]
    missing_criteria: List[str]
