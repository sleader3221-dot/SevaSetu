import logging
import json
from strands import Agent

logger = logging.getLogger(__name__)

try:
    doc_agent = Agent(
        model='us.amazon.nova-lite-v1:0',
        system_prompt='You are a document verification assistant. Review the extracted text and confirm if it meets the requirements.'
    )
except Exception as e:
    logger.warning(f'Could not initialize doc_agent: {e}')
    doc_agent = None

def verify_document(extracted_text: dict, requirements: str) -> str:
    if not doc_agent:
        return 'AI verification not available.'
    
    try:
        prompt = f"Extracted text: {json.dumps(extracted_text)}\nRequirements: {requirements}\nDoes this document meet the requirements?"
        response = doc_agent(prompt)
        return str(response)
    except Exception as e:
        logger.error(f'Doc verification error: {e}')
        return 'Verification failed due to an error.'
