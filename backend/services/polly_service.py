import boto3
import base64
import logging

logger = logging.getLogger(__name__)

polly_client = boto3.client('polly', region_name='us-east-1')

def text_to_speech(text: str, language: str = 'en') -> dict:
    """
    Synthesize text into Indian-accented speech using Amazon Polly.
    Voices:
    - 'Aditi': Indian English & Hindi bilingual voice
    - 'Kajal': Indian English voice
    """
    try:
        # Sanitize length (Polly max text is 3000 chars)
        clean_text = text[:1500] if len(text) > 1500 else text
        
        # Pick appropriate Indian voice
        voice_id = 'Aditi'
        
        response = polly_client.synthesize_speech(
            Text=clean_text,
            OutputFormat='mp3',
            VoiceId=voice_id,
            Engine='standard'
        )
        
        audio_stream = response.get('AudioStream')
        if audio_stream:
            audio_bytes = audio_stream.read()
            b64_audio = base64.b64encode(audio_bytes).decode('utf-8')
            return {
                'status': 'success',
                'audio_url': f"data:audio/mp3;base64,{b64_audio}",
                'voice': voice_id,
                'provider': 'Amazon Polly Neural'
            }
    except Exception as e:
        logger.warning(f'Polly neural attempt: {e}, falling back to standard')
        try:
            # Fallback to standard engine if neural not available in region/voice
            response = polly_client.synthesize_speech(
                Text=clean_text,
                OutputFormat='mp3',
                VoiceId='Aditi',
                Engine='standard'
            )
            audio_stream = response.get('AudioStream')
            if audio_stream:
                audio_bytes = audio_stream.read()
                b64_audio = base64.b64encode(audio_bytes).decode('utf-8')
                return {
                    'status': 'success',
                    'audio_url': f"data:audio/mp3;base64,{b64_audio}",
                    'voice': 'Aditi (Standard)',
                    'provider': 'Amazon Polly Standard'
                }
        except Exception as e2:
            logger.error(f'Polly error: {e2}')
            return {'status': 'error', 'error': str(e2), 'audio_url': ''}