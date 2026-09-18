import boto3
import json
from data.schemes import SCHEMES_DATA

def seed():
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('SevaSetu-Schemes')
    
    with table.batch_writer() as batch:
        for scheme in SCHEMES_DATA:
            item = {
                'pk': f"SCHEME#{scheme['id']}",
                'sk': 'METADATA',
                **{k: v for k, v in scheme.items() if v is not None}
            }
            # Convert lists/dicts to JSON strings for DynamoDB
            for key, val in item.items():
                if isinstance(val, (list, dict)):
                    item[key] = json.dumps(val)
            batch.put_item(Item=item)
    
    print(f'Seeded {len(SCHEMES_DATA)} schemes to DynamoDB')

if __name__ == '__main__':
    seed()
