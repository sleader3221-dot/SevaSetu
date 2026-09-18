import boto3
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

translate_client = boto3.client('translate', region_name='us-east-1')

def translate_text(text: str, target_lang: str = 'hi') -> str:
    try:
        response = translate_client.translate_text(
            Text=text, SourceLanguageCode='auto', TargetLanguageCode=target_lang
        )
        return response['TranslatedText']
    except Exception as e:
        logger.error(f'Translate error: {e}')
        return text  # Return original on error
