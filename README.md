# 🇮🇳 SevaSetu (सेवासेतु) — AI-Powered Government Scheme Navigator for Bharat

> **Your Bridge to Government Services** — Discover every government welfare scheme you're eligible for, in your language, in under 2 minutes.

[![Built with AWS](https://img.shields.io/badge/Built%20with-AWS-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com)
[![Strands Agents](https://img.shields.io/badge/Powered%20by-Strands%20Agents%20SDK-blue?style=for-the-badge)](https://github.com/strands-agents/sdk-python)
[![Amazon Bedrock](https://img.shields.io/badge/AI-Amazon%20Bedrock-purple?style=for-the-badge)](https://aws.amazon.com/bedrock/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

---

## 🌐 Live Production Deployment on AWS

| Service | Live AWS URL / Identifier |
|---|---|
| **Live Web App (Amplify + CloudFront)** | **[https://main.d29f8mjvik7gji.amplifyapp.com](https://main.d29f8mjvik7gji.amplifyapp.com)** |
| **Document OCR Vault** | **[https://main.d29f8mjvik7gji.amplifyapp.com/verify](https://main.d29f8mjvik7gji.amplifyapp.com/verify)** |
| **S3 Website Mirror** | **[http://sevasetu-frontend-991752.s3-website-us-east-1.amazonaws.com](http://sevasetu-frontend-991752.s3-website-us-east-1.amazonaws.com)** |
| **Live Cloud API Gateway** | **`https://snlktzwf6g.execute-api.us-east-1.amazonaws.com`** |
| **API Health Check** | **[`https://snlktzwf6g.execute-api.us-east-1.amazonaws.com/api/health`](https://snlktzwf6g.execute-api.us-east-1.amazonaws.com/api/health)** |
| **DynamoDB Database Table** | `SevaSetu-Schemes` (30 Real Verified Welfare Schemes) |
| **S3 Document Vault** | `s3://sevasetu-documents-991752` |
| **Voice Speech Synthesis** | Amazon Polly (`Aditi` Indian bilingual voice) |
| **Deadline & SMS Alerts** | Amazon SNS (`arn:aws:sns:us-east-1:991752019659:SevaSetu-Alerts`) |
| **Document OCR Engine** | Amazon Textract (`detect_document_text`) |
| **AWS Region** | `us-east-1` (N. Virginia) |

---

## 🎯 The Problem

India has **700+ government welfare schemes** worth ₹lakhs of crores in benefits. Yet, **60% of eligible citizens never claim them** — not because they don't need help, but because they don't know these schemes exist.

- 📋 Information is scattered across **50+ government portals** in formal English
- 🌍 **Digital literacy gap** — rural/semi-urban citizens can't navigate complex websites
- 🔍 **No single system** tells you ALL schemes you're eligible for
- 💰 **Middlemen charge ₹500-5,000** for what should be free government services
- ❌ Small application errors cause rejection, wasting months of effort

**Result:** Over **800 million Indians** miss out on welfare benefits they rightfully deserve.

---

## 💡 The Solution: SevaSetu

SevaSetu is an **AI-powered agentic platform** that:

1. **Asks 5-7 simple questions** about your demographics
2. **AI agents autonomously search** through 30+ verified central and state welfare schemes in DynamoDB
3. **Shows a personalized dashboard** of schemes you're eligible for, with match percentages
4. **Digital Citizen Welfare Passbook** — Generates a tamper-evident entitlement passbook with a unique cryptographic reference ID (`SEVA-2026-XX-XXXXXX`) and 1-click print/PDF export
5. **SevaMitra AI Copilot** — Floating multi-turn conversational agent with Indian voice playback via Amazon Polly (`Aditi`)
6. **Side-by-Side Comparison Matrix** — Compare eligibility criteria, benefits, and documents for up to 3 schemes simultaneously
7. **Document OCR Vault** — Live verification of Aadhaar, PAN, and Income Certificates with Amazon Textract
8. **Works in 5 Indian languages** — English, Hindi, Tamil, Telugu, Bengali with Amazon Translate
9. **Interactive India Map Explorer** — Geographic navigation across all 36 States & UTs with in-situ demographic condition entry and real-time state scheme queries
10. **Holographic 3D Bharat Globe & Simulator** — Sci-Fi Three.js WebGL globe with custom Fresnel atmospheric shader, highlighted Indian subcontinent, state capital laser pillars, and animated DBT energy arcs

### What Makes This Different? (100% Live Cloud, Zero Mock Data)

Unlike static scheme finders (e.g., MyScheme.gov.in), SevaSetu uses **autonomous AI agents** built with the [Strands Agents SDK](https://github.com/strands-agents/sdk-python) and **13 active AWS Cloud services**:
- **Zero Mock Data Guarantee**: 100% of data is stored and fetched from Amazon DynamoDB, with Amazon Textract OCR, Amazon Polly speech, Amazon Translate, and Amazon SNS live.
- **Reason about complex eligibility** — multi-condition rules with income brackets, age ranges, category combinations
- **Extract and validate documents** — using Amazon Textract for intelligent OCR with confidence scores
- **Provide personalized guidance** — AI-generated step-by-step instructions tailored to YOUR situation
- **Send proactive reminders** — deadline alerts via Amazon SNS directly to SMS/Email
- **Digital Passbook Generation** — Cryptographic hash-based entitlement cards ready for CSC / Seva Kendra validation

---

## 🏗️ Architecture

### System Design
```
┌──────────────────────────────────────────────────────┐
│           FRONTEND — Next.js 14 + Tailwind           │
│              AWS Amplify + CloudFront CDN             │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐  │
│  │ Profile  │ │ Scheme   │ │ Apply   │ │ Document │  │
│  │ Wizard   │ │Dashboard │ │ Guide   │ │ Upload   │  │
│  └────┬─────┘ └────┬─────┘ └────┬────┘ └────┬─────┘  │
│       └─────────────┴────────────┴───────────┘        │
│                  Amazon Cognito (Auth)                 │
└──────────────────────┬────────────────────────────────┘
                       │ HTTPS
              ┌────────┴─────────┐
              │  API Gateway     │
              │  (HTTP API)      │
              └────────┬─────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
┌───┴────┐   ┌────────┴────────┐   ┌─────┴──────┐
│Lambda: │   │ Lambda:         │   │ Lambda:    │
│Scheme  │   │ Agent           │   │ Document   │
│API     │   │ Orchestrator    │   │ Processor  │
└───┬────┘   └────────┬────────┘   └─────┬──────┘
    │                 │                   │
    │        ┌────────┴────────┐   ┌──────┴──────┐
    │        │ Strands Agents  │   │ Amazon      │
    │        │ SDK (Python)    │   │ Textract    │
    │        │ • Eligibility   │   └─────────────┘
    │        │ • Guide         │
    │        │ • Document      │
    │        └────────┬────────┘
    │                 │
    │        ┌────────┴────────┐
    │        │ Amazon Bedrock  │
    │        │ Claude + Nova   │
    │        │ + Guardrails    │
    │        └─────────────────┘
    │
┌───┴──────────────────────────────────────┐
│               DATA LAYER                  │
│  DynamoDB │ S3 │ Translate │ EventBridge  │
│  CloudWatch │ SNS                         │
└──────────────────────────────────────────┘
```

### AWS Services Used (15 Total)

| Service | Purpose |
|---------|---------|
| **Amazon Bedrock** | LLM backbone (Claude 3.5 Sonnet + Nova Lite) |
| **Bedrock Guardrails** | PII redaction, safety filtering |
| **Strands Agents SDK** | Multi-agent orchestration framework |
| **AWS Lambda** | Serverless compute (Python 3.12) |
| **API Gateway** | HTTP API with CORS |
| **Amazon DynamoDB** | Scheme database, user sessions |
| **Amazon S3** | Document storage |
| **Amazon Textract** | Document OCR and data extraction |
| **Amazon Translate** | Multilingual support (5 languages) |
| **Amazon Cognito** | User authentication |
| **Amazon EventBridge** | Scheduled deadline reminders |
| **Amazon SNS** | Email notifications |
| **AWS CloudFront** | CDN for global delivery |
| **AWS Amplify** | Frontend hosting with CI/CD |
| **Amazon CloudWatch** | Monitoring and logging |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- AWS CLI configured with credentials
- AWS account with Bedrock model access

### Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts at http://localhost:3000
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000   # Starts at http://localhost:8000
```

### Deploy to AWS
```bash
cd backend
sam build
sam deploy --guided   # Deploy Lambda + API Gateway + DynamoDB

cd ../frontend
# Connect to AWS Amplify via GitHub for auto-deploy
```

---

## 📊 Scheme Database

SevaSetu includes **30+ verified Indian government schemes** covering:

| Category | Count | Examples |
|----------|-------|---------|
| Education | 5 | Post-Matric Scholarship, NMMS, Central Sector |
| Health | 3 | Ayushman Bharat, PM Jeevan Jyoti, PM Suraksha Bima |
| Agriculture | 4 | PM Kisan, Fasal Bima, Kisan Credit Card |
| Housing | 2 | PM Awas Yojana (Urban + Rural) |
| Finance | 5 | Mudra, Stand-Up India, Sukanya Samriddhi |
| Women & Child | 4 | Matru Vandana, Ujjwala, Beti Bachao, Mahila Samman |
| Employment | 3 | Agnipath, Digital India, Startup India |
| Social Welfare | 4+ | PM SVANidhi, Senior Citizen, Deendayal |

All data sourced from official government portals: MyScheme.gov.in, India.gov.in, and ministry websites.

---

## 🤖 AI Agent Architecture

### Eligibility Matcher Agent
Autonomously evaluates user profiles against complex, multi-condition eligibility rules using a hybrid approach:
- **Rule-based engine** for deterministic scoring (fast, reliable)
- **Bedrock Claude** for edge cases and natural language explanation

### Application Guide Agent
Generates personalized, step-by-step application guidance:
- Tailored document checklists based on user's existing documents
- Tips and common mistakes specific to each scheme
- Direct links to official application portals

### Document Intelligence Agent
Processes uploaded documents via Amazon Textract:
- Extracts structured data from Aadhaar, PAN, income certificates
- Cross-validates extracted data against scheme requirements
- Returns verification status with confidence scores

---

## 🌐 Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English | en | ✅ Full support |
| Hindi (हिंदी) | hi | ✅ Full support |
| Tamil (தமிழ்) | ta | ✅ Via Amazon Translate |
| Telugu (తెలుగు) | te | ✅ Via Amazon Translate |
| Bengali (বাংলা) | bn | ✅ Via Amazon Translate |

---

## 🎬 Demo Video

📺 [Watch the 3-minute demo on YouTube](https://youtube.com/watch?v=PLACEHOLDER)

---

## 🧰 AI Tools Used (Disclosure)

As required by hackathon rules, the following AI tools were used during development:

| Tool | Purpose |
|------|---------|
| **Amazon Bedrock (Claude 3.5 Sonnet)** | AI agent reasoning and eligibility analysis |
| **Amazon Bedrock (Nova Lite)** | Fast structured guidance generation |
| **GitHub Copilot** | Code autocompletion and boilerplate |
| **Google Antigravity (Claude)** | Architecture planning, code generation, debugging |
| **Amazon Q Developer** | AWS service configuration assistance |

All code was authored during the hackathon window (Sept 17-20, 2026).

---

## 📁 Project Structure

```
sevasetu/
├── frontend/           # Next.js 14 frontend
│   ├── src/
│   │   ├── app/        # Pages (landing, profile, dashboard, scheme)
│   │   ├── components/ # Reusable UI components
│   │   └── lib/        # Utilities, types, API client
│   └── ...
├── backend/            # Python backend
│   ├── agents/         # Strands Agents (eligibility, guide, document)
│   ├── services/       # Business logic, Textract, Translate
│   ├── data/           # Scheme database
│   ├── models/         # Pydantic schemas
│   ├── app.py          # FastAPI application
│   └── template.yaml   # AWS SAM template
├── docs/               # Architecture documentation
└── README.md           # This file
```

---

## 👥 Team

- **[Your Name]** — Full-Stack Developer

---

## 📜 License

This project was built for the First Commit Hackathon (Bharat Builds Tour, Sept 2026).

All intellectual property belongs to the project creator(s).

Built with ❤️ for Bharat 🇮🇳
