# Architecture Documentation — SevaSetu

## System Overview

SevaSetu follows a **serverless, event-driven architecture** on AWS, designed for:
- **Zero cold-start latency** on DynamoDB reads
- **Elastic scaling** from 0 to thousands of concurrent users
- **Cost efficiency** — runs entirely within AWS Free Tier for hackathon
- **Multi-agent AI orchestration** via Strands Agents SDK

## Data Flow

### 1. Scheme Discovery Flow
```
User fills profile wizard (7 steps)
        ↓
Frontend POST /api/schemes/match
        ↓
API Gateway → Lambda → Eligibility Service
        ↓
Rule-based engine scores all 30+ schemes
        ↓ (optional)
Strands Eligibility Agent enhances with Bedrock reasoning
        ↓
Returns ranked SchemeMatch[] with scores & reasons
        ↓
Frontend renders Scheme Dashboard with animated cards
```

### 2. Application Guide Flow
```
User clicks scheme → "Get Application Guide"
        ↓
Frontend POST /api/agent/guide
        ↓
API Gateway → Lambda → Strands Guide Agent
        ↓
Agent calls Bedrock Nova Lite with scheme data + user profile
        ↓
Returns personalized step-by-step guidance
        ↓
Frontend renders interactive application wizard
```

### 3. Document Verification Flow
```
User uploads document (Aadhaar, certificate)
        ↓
Frontend → Pre-signed S3 URL → Direct S3 upload
        ↓
S3 Event → Lambda → Amazon Textract
        ↓
Textract extracts text, forms, tables
        ↓
Strands Document Agent validates against scheme requirements
        ↓
Returns verification status with matched/unmatched fields
```

## DynamoDB Table Design

### Schemes Table
- **Partition Key**: `pk` (String) = `SCHEME#{scheme_id}`
- **Sort Key**: `sk` (String) = `METADATA`
- **Attributes**: name, ministry, category, eligibility, benefits, steps, docs, url

### Users Table  
- **Partition Key**: `pk` (String) = `USER#{user_id}`
- **Sort Key**: `sk` (String) = `PROFILE` | `SESSION#{session_id}`
- **Attributes**: profile data, matched schemes, conversation history

## Security

- **Amazon Cognito** for user authentication
- **IAM Least Privilege** — each Lambda has only the permissions it needs
- **Bedrock Guardrails** — PII redaction, content filtering
- **Pre-signed URLs** — documents never pass through Lambda (direct S3 upload)
- **HTTPS everywhere** — CloudFront terminates TLS

## Cost Analysis (Free Tier)

| Service | Free Tier | Our Usage | Cost |
|---------|-----------|-----------|------|
| Lambda | 1M requests/month | ~10K requests | $0 |
| DynamoDB | 25 RCU/WCU, 25 GB | 30+ schemes, <1 GB | $0 |
| S3 | 5 GB, 20K GETs | <1 GB documents | $0 |
| Bedrock | Pay-per-token | ~$2-5 for hackathon | ~$3 |
| Textract | 1K pages free (3 months) | ~100 pages | $0 |
| Translate | 2M chars free (12 months) | ~500K chars | $0 |
| Amplify | 1K build min, 15 GB | <5 builds | $0 |
| **Total** | | | **~$3** |

*The entire platform costs less than a cup of coffee to run for the weekend.*
