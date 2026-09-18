import json
import logging
from strands import Agent, tool

logger = logging.getLogger(__name__)

try:
    from data.schemes import SCHEMES_DATA
    from services.eligibility_service import match_schemes
except ImportError:
    SCHEMES_DATA = []
    def match_schemes(p, s): return []

@tool
def search_eligible_schemes(user_profile_json: str) -> str:
    """Search government schemes matching a user profile. Input is JSON string of user profile."""
    try:
        profile_dict = json.loads(user_profile_json)
        matches = match_schemes(profile_dict, SCHEMES_DATA)
        return json.dumps(matches)
    except Exception as e:
        logger.error(f'Error in search_eligible_schemes: {e}')
        return json.dumps({'error': str(e)})

try:
    eligibility_agent = Agent(
        model='us.amazon.nova-lite-v1:0',
        system_prompt='You are SevaSetu, an AI assistant helping Indian citizens discover government welfare schemes. Use the search_eligible_schemes tool to find matches, then explain them clearly to the user.',
        tools=[search_eligible_schemes]
    )
except Exception as e:
    logger.warning(f'Could not initialize eligibility_agent: {e}')
    eligibility_agent = None
