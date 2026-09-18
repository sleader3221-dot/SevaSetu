import boto3
import logging

logger = logging.getLogger(__name__)

SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:991752019659:SevaSetu-Alerts"
sns_client = boto3.client('sns', region_name='us-east-1')

def subscribe_user(destination: str, scheme_name: str = 'All Schemes') -> dict:
    """
    Subscribes a citizen email or phone number to scheme deadline notifications via Amazon SNS.
    """
    try:
        is_email = '@' in destination
        protocol = 'email' if is_email else 'sms'
        
        response = sns_client.subscribe(
            TopicArn=SNS_TOPIC_ARN,
            Protocol=protocol,
            Endpoint=destination.strip(),
            ReturnSubscriptionArn=True
        )
        
        subscription_arn = response.get('SubscriptionArn', '')
        
        return {
            'status': 'success',
            'destination': destination,
            'protocol': protocol,
            'scheme_name': scheme_name,
            'subscription_arn': subscription_arn,
            'message': f"Successfully subscribed {destination} to {scheme_name} alerts via Amazon SNS! Please check your inbox to confirm."
        }
    except Exception as e:
        logger.error(f'SNS error: {e}')
        return {'status': 'error', 'error': str(e), 'destination': destination}