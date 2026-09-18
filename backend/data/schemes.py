SCHEMES_DATA = [
    {
        "id": "1",
        "name": "PM Kisan Samman Nidhi",
        "name_hindi": "पीएम किसान सम्मान निधि",
        "ministry": "Ministry of Agriculture and Farmers Welfare",
        "description": "Income support to all landholding farmer families.",
        "benefits": "₹6,000 per year in three equal installments.",
        "benefit_value": "₹6,000/yr",
        "benefit_amount": 6000,
        "eligibility": {
            "occupations": [
                "Farmer"
            ],
            "special_conditions": [
                "Land less than 2 hectares"
            ]
        },
        "application_steps": [
            "Visit PM Kisan portal",
            "Register with Aadhaar",
            "Submit land details"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Bank Passbook",
            "Land holding papers"
        ],
        "portal_url": "https://pmkisan.gov.in/",
        "category": "Agriculture",
        "target_group": [
            "Farmers"
        ]
    },
    {
        "id": "2",
        "name": "Ayushman Bharat PM-JAY",
        "name_hindi": "आयुष्मान भारत पीएम-जय",
        "ministry": "Ministry of Health and Family Welfare",
        "description": "Health insurance cover for secondary and tertiary care hospitalization.",
        "benefits": "Health cover of ₹5 lakhs per family per year.",
        "benefit_value": "₹5,000,000 cover",
        "benefit_amount": 500000,
        "eligibility": {
            "categories": [
                "SC",
                "ST",
                "OBC",
                "General",
                "EWS"
            ],
            "special_conditions": [
                "BPL Family"
            ]
        },
        "application_steps": [
            "Check eligibility on PMJAY portal",
            "Visit empanelled hospital",
            "Get e-card"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Ration Card"
        ],
        "portal_url": "https://pmjay.gov.in/",
        "category": "Health",
        "target_group": [
            "Poor families"
        ]
    },
    {
        "id": "3",
        "name": "Post-Matric Scholarship for SC",
        "name_hindi": "एससी के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
        "ministry": "Ministry of Social Justice and Empowerment",
        "description": "Financial assistance to SC students pursuing post-matriculation courses.",
        "benefits": "Maintenance allowance and reimbursement of fees.",
        "benefit_value": "Variable",
        "benefit_amount": 10000,
        "eligibility": {
            "categories": [
                "SC"
            ],
            "income_limit": 250000
        },
        "application_steps": [
            "Register on NSP",
            "Fill application",
            "Upload documents"
        ],
        "required_documents": [
            "Caste Certificate",
            "Income Certificate",
            "Mark sheets"
        ],
        "portal_url": "https://scholarships.gov.in/",
        "category": "Education",
        "target_group": [
            "SC Students"
        ]
    },
    {
        "id": "4",
        "name": "PM Awas Yojana - Gramin",
        "name_hindi": "पीएम आवास योजना - ग्रामीण",
        "ministry": "Ministry of Rural Development",
        "description": "Housing for All in rural areas.",
        "benefits": "Financial assistance of ₹1.2 lakh (plains) or ₹1.3 lakh (hilly areas).",
        "benefit_value": "₹1.2L-1.3L",
        "benefit_amount": 120000,
        "eligibility": {
            "special_conditions": [
                "Rural resident",
                "Houseless or living in kutcha house"
            ]
        },
        "application_steps": [
            "Gram Sabha identification",
            "Registration by Gram Panchayat",
            "Sanction order"
        ],
        "required_documents": [
            "Aadhaar",
            "Bank Account Details",
            "Job Card"
        ],
        "portal_url": "https://pmayg.nic.in/",
        "category": "Housing",
        "target_group": [
            "Rural houseless"
        ]
    },
    {
        "id": "5",
        "name": "PM Awas Yojana - Urban",
        "name_hindi": "पीएम आवास योजना - शहरी",
        "ministry": "Ministry of Housing and Urban Affairs",
        "description": "Housing for All in urban areas.",
        "benefits": "Interest subsidy up to ₹2.67 lakh.",
        "benefit_value": "₹2.67L Subsidy",
        "benefit_amount": 267000,
        "eligibility": {
            "income_limit": 1800000,
            "special_conditions": [
                "Urban resident",
                "Does not own a pucca house"
            ]
        },
        "application_steps": [
            "Apply online or via CSC",
            "Assessment",
            "Bank loan sanction"
        ],
        "required_documents": [
            "Aadhaar",
            "Income Proof",
            "Property documents"
        ],
        "portal_url": "https://pmaymis.gov.in/",
        "category": "Housing",
        "target_group": [
            "Urban EWS/LIG"
        ]
    },
    {
        "id": "6",
        "name": "Sukanya Samriddhi Yojana",
        "name_hindi": "सुकन्या समृद्धि योजना",
        "ministry": "Ministry of Finance",
        "description": "Small deposit scheme for the girl child.",
        "benefits": "High interest rate (approx 8%) and tax benefits.",
        "benefit_value": "High Interest",
        "benefit_amount": 0,
        "eligibility": {
            "max_age": 10,
            "gender": [
                "Female"
            ]
        },
        "application_steps": [
            "Visit Post Office or Bank",
            "Fill account opening form",
            "Submit documents"
        ],
        "required_documents": [
            "Birth Certificate of child",
            "Parent/Guardian ID"
        ],
        "portal_url": "https://www.indiapost.gov.in/",
        "category": "Women & Child",
        "target_group": [
            "Girl children"
        ]
    },
    {
        "id": "7",
        "name": "PM Mudra Yojana",
        "name_hindi": "पीएम मुद्रा योजना",
        "ministry": "Ministry of Finance",
        "description": "Loans to micro/small business entities.",
        "benefits": "Loans up to ₹10 lakhs.",
        "benefit_value": "Up to ₹10L loan",
        "benefit_amount": 1000000,
        "eligibility": {
            "occupations": [
                "Business",
                "Self-employed"
            ]
        },
        "application_steps": [
            "Approach Bank/NBFC",
            "Submit business plan",
            "Loan sanction"
        ],
        "required_documents": [
            "ID Proof",
            "Address Proof",
            "Business proof"
        ],
        "portal_url": "https://www.mudra.org.in/",
        "category": "MSME",
        "target_group": [
            "Small businesses"
        ]
    },
    {
        "id": "8",
        "name": "Atal Pension Yojana",
        "name_hindi": "अटल पेंशन योजना",
        "ministry": "Ministry of Finance",
        "description": "Pension scheme for unorganized sector workers.",
        "benefits": "Guaranteed minimum pension of ₹1,000 to ₹5,000 per month.",
        "benefit_value": "₹1K-5K/mo",
        "benefit_amount": 5000,
        "eligibility": {
            "min_age": 18,
            "max_age": 40,
            "special_conditions": [
                "Unorganized worker"
            ]
        },
        "application_steps": [
            "Visit bank where saving account is held",
            "Fill APY form",
            "Set auto-debit"
        ],
        "required_documents": [
            "Aadhaar",
            "Savings Bank Account"
        ],
        "portal_url": "https://npscra.nsdl.co.in/",
        "category": "Finance",
        "target_group": [
            "Unorganized workers"
        ]
    },
    {
        "id": "9",
        "name": "PM Vishwakarma",
        "name_hindi": "पीएम विश्वकर्मा",
        "ministry": "Ministry of MSME",
        "description": "Support for traditional artisans and craftspeople.",
        "benefits": "Credit support up to ₹3 lakh, toolkit incentive ₹15,000.",
        "benefit_value": "₹3L support",
        "benefit_amount": 315000,
        "eligibility": {
            "min_age": 18,
            "occupations": [
                "Artisan",
                "Craftsman",
                "Self-employed"
            ]
        },
        "application_steps": [
            "Register on portal",
            "Verification by Gram Panchayat",
            "Training and credit"
        ],
        "required_documents": [
            "Aadhaar",
            "Bank Account Details",
            "Skill proof"
        ],
        "portal_url": "https://pmvishwakarma.gov.in/",
        "category": "MSME",
        "target_group": [
            "Artisans",
            "Craftsmen"
        ]
    },
    {
        "id": "10",
        "name": "Stand-Up India",
        "name_hindi": "स्टैंड-अप इंडिया",
        "ministry": "Ministry of Finance",
        "description": "Promotes entrepreneurship among women and SC/ST.",
        "benefits": "Bank loans between ₹10 lakh and ₹1 Crore.",
        "benefit_value": "₹10L-1Cr loan",
        "benefit_amount": 10000000,
        "eligibility": {
            "min_age": 18,
            "categories": [
                "SC",
                "ST"
            ],
            "gender": [
                "Female"
            ],
            "occupations": [
                "Business"
            ]
        },
        "application_steps": [
            "Apply via portal",
            "Connect with bank",
            "Loan sanction"
        ],
        "required_documents": [
            "ID Proof",
            "Project Report",
            "Caste Certificate (if applicable)"
        ],
        "portal_url": "https://www.standupmitra.in/",
        "category": "MSME",
        "target_group": [
            "SC/ST/Women Entrepreneurs"
        ]
    },
    {
        "id": "11",
        "name": "PM Matru Vandana Yojana",
        "name_hindi": "पीएम मातृ वंदना योजना",
        "ministry": "Ministry of Women and Child Development",
        "description": "Maternity benefit programme.",
        "benefits": "Cash incentive of ₹5,000 in three installments.",
        "benefit_value": "₹5,000",
        "benefit_amount": 5000,
        "eligibility": {
            "gender": [
                "Female"
            ],
            "min_age": 19,
            "special_conditions": [
                "Pregnant woman"
            ]
        },
        "application_steps": [
            "Register at Anganwadi Centre",
            "Fill forms periodically",
            "Receive funds"
        ],
        "required_documents": [
            "Aadhaar",
            "MCP Card",
            "Bank Account Details"
        ],
        "portal_url": "https://wcd.nic.in/",
        "category": "Women & Child",
        "target_group": [
            "Pregnant women"
        ]
    },
    {
        "id": "12",
        "name": "Ujjwala Yojana",
        "name_hindi": "उज्ज्वला योजना",
        "ministry": "Ministry of Petroleum and Natural Gas",
        "description": "Provides LPG connections to women from BPL households.",
        "benefits": "Free LPG connection and first refill.",
        "benefit_value": "Free LPG",
        "benefit_amount": 1600,
        "eligibility": {
            "gender": [
                "Female"
            ],
            "min_age": 18,
            "special_conditions": [
                "BPL Family"
            ]
        },
        "application_steps": [
            "Apply to LPG distributor",
            "Submit KYC form",
            "Verification"
        ],
        "required_documents": [
            "BPL Ration Card",
            "Aadhaar",
            "Passport Photo"
        ],
        "portal_url": "https://www.pmuy.gov.in/",
        "category": "Social Welfare",
        "target_group": [
            "BPL Women"
        ]
    },
    {
        "id": "13",
        "name": "Startup India",
        "name_hindi": "स्टार्टअप इंडिया",
        "ministry": "Ministry of Commerce and Industry",
        "description": "Initiative to build a strong eco-system for nurturing innovation and Startups.",
        "benefits": "Tax exemptions and fast-track patenting.",
        "benefit_value": "Tax benefits",
        "benefit_amount": 0,
        "eligibility": {
            "occupations": [
                "Business",
                "Entrepreneur"
            ],
            "special_conditions": [
                "Registered Startup"
            ]
        },
        "application_steps": [
            "Incorporate business",
            "Register on Startup India portal",
            "DPIIT Recognition"
        ],
        "required_documents": [
            "Incorporation Certificate",
            "Brief on startup"
        ],
        "portal_url": "https://www.startupindia.gov.in/",
        "category": "MSME",
        "target_group": [
            "Startups"
        ]
    },
    {
        "id": "14",
        "name": "PM SVANidhi",
        "name_hindi": "पीएम स्वनिधि",
        "ministry": "Ministry of Housing and Urban Affairs",
        "description": "Micro-credit facility for street vendors.",
        "benefits": "Working capital loan up to ₹10,000 to ₹50,000.",
        "benefit_value": "₹10K-50K loan",
        "benefit_amount": 50000,
        "eligibility": {
            "occupations": [
                "Street Vendor"
            ]
        },
        "application_steps": [
            "Apply on SVANidhi portal or app",
            "Bank verification",
            "Loan disbursal"
        ],
        "required_documents": [
            "Aadhaar",
            "Vending Certificate/ID Card"
        ],
        "portal_url": "https://pmsvanidhi.mohua.gov.in/",
        "category": "Finance",
        "target_group": [
            "Street Vendors"
        ]
    },
    {
        "id": "15",
        "name": "National Fellowship for OBC",
        "name_hindi": "ओबीसी के लिए राष्ट्रीय फेलोशिप",
        "ministry": "Ministry of Social Justice & Empowerment",
        "description": "Financial assistance to OBC students for pursuing M.Phil/Ph.D.",
        "benefits": "Fellowship of ₹31,000/month for JRF.",
        "benefit_value": "₹31K/mo",
        "benefit_amount": 31000,
        "eligibility": {
            "categories": [
                "OBC"
            ],
            "education": [
                "Post Graduate"
            ],
            "income_limit": 800000
        },
        "application_steps": [
            "Qualify NET",
            "Apply via UGC portal",
            "Selection"
        ],
        "required_documents": [
            "OBC Certificate",
            "Income Certificate",
            "PG Marksheet"
        ],
        "portal_url": "https://ugc.ac.in/",
        "category": "Education",
        "target_group": [
            "OBC Scholars"
        ]
    },
    {
        "id": "16",
        "name": "National Means-cum-Merit Scholarship",
        "name_hindi": "राष्ट्रीय साधन-सह-मेधा छात्रवृत्ति",
        "ministry": "Ministry of Education",
        "description": "Scholarships for meritorious students of economically weaker sections.",
        "benefits": "₹12,000 per annum (₹1,000 per month).",
        "benefit_value": "₹12,000/yr",
        "benefit_amount": 12000,
        "eligibility": {
            "income_limit": 350000,
            "education": [
                "Class 8 pass"
            ]
        },
        "application_steps": [
            "Appear for selection test",
            "Apply on NSP",
            "Verification"
        ],
        "required_documents": [
            "Income Certificate",
            "Caste Certificate",
            "Previous marksheet"
        ],
        "portal_url": "https://scholarships.gov.in/",
        "category": "Education",
        "target_group": [
            "School Students"
        ]
    },
    {
        "id": "17",
        "name": "Central Sector Scholarship",
        "name_hindi": "केंद्रीय क्षेत्र छात्रवृत्ति",
        "ministry": "Ministry of Education",
        "description": "Provides financial assistance to meritorious students from low-income families.",
        "benefits": "₹10,000 to ₹20,000 per annum.",
        "benefit_value": "₹10K-20K/yr",
        "benefit_amount": 20000,
        "eligibility": {
            "income_limit": 450000,
            "education": [
                "Class 12 pass"
            ]
        },
        "application_steps": [
            "Apply on NSP",
            "College verification",
            "State board verification"
        ],
        "required_documents": [
            "Income Certificate",
            "Class 12 marksheet",
            "Bank details"
        ],
        "portal_url": "https://scholarships.gov.in/",
        "category": "Education",
        "target_group": [
            "College Students"
        ]
    },
    {
        "id": "18",
        "name": "PM Fasal Bima Yojana",
        "name_hindi": "पीएम फसल बीमा योजना",
        "ministry": "Ministry of Agriculture and Farmers Welfare",
        "description": "Crop insurance scheme for farmers.",
        "benefits": "Financial support in event of crop failure.",
        "benefit_value": "Crop Insurance",
        "benefit_amount": 0,
        "eligibility": {
            "occupations": [
                "Farmer"
            ]
        },
        "application_steps": [
            "Enroll via bank or CSC",
            "Pay premium",
            "Claim intimation if crop loss"
        ],
        "required_documents": [
            "Aadhaar",
            "Land Records",
            "Sowing Proof"
        ],
        "portal_url": "https://pmfby.gov.in/",
        "category": "Agriculture",
        "target_group": [
            "Farmers"
        ]
    },
    {
        "id": "19",
        "name": "Kisan Credit Card",
        "name_hindi": "किसान क्रेडिट कार्ड",
        "ministry": "Ministry of Finance",
        "description": "Provides farmers with timely access to credit.",
        "benefits": "Short term credit at subsidized interest rates.",
        "benefit_value": "Low interest credit",
        "benefit_amount": 300000,
        "eligibility": {
            "occupations": [
                "Farmer"
            ]
        },
        "application_steps": [
            "Apply at bank",
            "Submit land documents",
            "KCC issuance"
        ],
        "required_documents": [
            "Aadhaar",
            "Land holding documents",
            "Passport Photo"
        ],
        "portal_url": "https://sbi.co.in/",
        "category": "Agriculture",
        "target_group": [
            "Farmers"
        ]
    },
    {
        "id": "20",
        "name": "Pradhan Mantri Jeevan Jyoti Bima",
        "name_hindi": "प्रधानमंत्री जीवन ज्योति बीमा योजना",
        "ministry": "Ministry of Finance",
        "description": "Life insurance scheme.",
        "benefits": "Life cover of ₹2 Lakhs at ₹436/year.",
        "benefit_value": "₹2L Life Cover",
        "benefit_amount": 200000,
        "eligibility": {
            "min_age": 18,
            "max_age": 50
        },
        "application_steps": [
            "Visit bank",
            "Fill consent form",
            "Auto-debit setup"
        ],
        "required_documents": [
            "Aadhaar",
            "Bank Account Details"
        ],
        "portal_url": "https://jansuraksha.gov.in/",
        "category": "Finance",
        "target_group": [
            "All Citizens"
        ]
    },
    {
        "id": "21",
        "name": "PM Suraksha Bima Yojana",
        "name_hindi": "पीएम सुरक्षा बीमा योजना",
        "ministry": "Ministry of Finance",
        "description": "Accident insurance scheme.",
        "benefits": "Accidental death/disability cover of ₹2 Lakhs at ₹20/year.",
        "benefit_value": "₹2L Accidental Cover",
        "benefit_amount": 200000,
        "eligibility": {
            "min_age": 18,
            "max_age": 70
        },
        "application_steps": [
            "Visit bank",
            "Fill consent form",
            "Auto-debit setup"
        ],
        "required_documents": [
            "Aadhaar",
            "Bank Account Details"
        ],
        "portal_url": "https://jansuraksha.gov.in/",
        "category": "Finance",
        "target_group": [
            "All Citizens"
        ]
    },
    {
        "id": "22",
        "name": "Samagra Shiksha Abhiyan",
        "name_hindi": "समग्र शिक्षा अभियान",
        "ministry": "Ministry of Education",
        "description": "Overarching programme for the school education sector.",
        "benefits": "Free textbooks, uniforms, and improved school infrastructure.",
        "benefit_value": "Educational Support",
        "benefit_amount": 0,
        "eligibility": {
            "max_age": 18,
            "special_conditions": [
                "School student"
            ]
        },
        "application_steps": [
            "Enroll in government school"
        ],
        "required_documents": [
            "Birth Certificate",
            "Aadhaar"
        ],
        "portal_url": "https://samagra.education.gov.in/",
        "category": "Education",
        "target_group": [
            "School Students"
        ]
    },
    {
        "id": "23",
        "name": "Digital India Internship",
        "name_hindi": "डिजिटल इंडिया इंटर्नशिप",
        "ministry": "Ministry of Electronics and IT",
        "description": "Internship scheme for students.",
        "benefits": "Stipend of ₹10,000 per month.",
        "benefit_value": "₹10,000/mo",
        "benefit_amount": 10000,
        "eligibility": {
            "education": [
                "Undergraduate",
                "Postgraduate"
            ]
        },
        "application_steps": [
            "Apply on portal",
            "Interview",
            "Selection"
        ],
        "required_documents": [
            "Resume",
            "College NOC",
            "Marksheets"
        ],
        "portal_url": "https://meity.gov.in/",
        "category": "Employment",
        "target_group": [
            "Tech Students"
        ]
    },
    {
        "id": "24",
        "name": "Agnipath Scheme",
        "name_hindi": "अग्निपथ योजना",
        "ministry": "Ministry of Defence",
        "description": "Recruitment scheme for Indian armed forces.",
        "benefits": "4-year service with attractive package and Seva Nidhi.",
        "benefit_value": "Salary + ₹11.71L Seva Nidhi",
        "benefit_amount": 1171000,
        "eligibility": {
            "min_age": 17,
            "max_age": 21,
            "education": [
                "Class 10 pass",
                "Class 12 pass"
            ]
        },
        "application_steps": [
            "Apply online",
            "Physical test",
            "Medical test",
            "Written exam"
        ],
        "required_documents": [
            "Class 10/12 Certificates",
            "Aadhaar",
            "Domicile Certificate"
        ],
        "portal_url": "https://joinindianarmy.nic.in/",
        "category": "Employment",
        "target_group": [
            "Youth"
        ]
    },
    {
        "id": "25",
        "name": "PM Garib Kalyan Anna Yojana",
        "name_hindi": "पीएम गरीब कल्याण अन्न योजना",
        "ministry": "Ministry of Consumer Affairs, Food and Public Distribution",
        "description": "Food security scheme.",
        "benefits": "5 kg free wheat/rice per person per month.",
        "benefit_value": "Free Ration",
        "benefit_amount": 1000,
        "eligibility": {
            "special_conditions": [
                "BPL Family",
                "Antyodaya Anna Yojana beneficiary"
            ]
        },
        "application_steps": [
            "Visit fair price shop",
            "Aadhaar authentication"
        ],
        "required_documents": [
            "Ration Card",
            "Aadhaar"
        ],
        "portal_url": "https://dfpd.gov.in/",
        "category": "Social Welfare",
        "target_group": [
            "Poor Families"
        ]
    },
    {
        "id": "26",
        "name": "Mahila Samman Savings Certificate",
        "name_hindi": "महिला सम्मान बचत प्रमाण पत्र",
        "ministry": "Ministry of Finance",
        "description": "Small savings scheme for women and girls.",
        "benefits": "Fixed interest rate of 7.5% for a 2-year tenor.",
        "benefit_value": "7.5% Interest",
        "benefit_amount": 0,
        "eligibility": {
            "gender": [
                "Female"
            ]
        },
        "application_steps": [
            "Visit Bank/Post Office",
            "Fill account opening form",
            "Deposit money"
        ],
        "required_documents": [
            "Aadhaar",
            "PAN Card",
            "Photos"
        ],
        "portal_url": "https://www.indiapost.gov.in/",
        "category": "Women & Child",
        "target_group": [
            "Women",
            "Girls"
        ]
    },
    {
        "id": "27",
        "name": "Senior Citizen Savings Scheme",
        "name_hindi": "वरिष्ठ नागरिक बचत योजना",
        "ministry": "Ministry of Finance",
        "description": "Savings scheme tailored for senior citizens.",
        "benefits": "High interest rate of 8.2% per annum.",
        "benefit_value": "8.2% Interest",
        "benefit_amount": 0,
        "eligibility": {
            "min_age": 60
        },
        "application_steps": [
            "Visit Bank/Post Office",
            "Submit form",
            "Deposit funds"
        ],
        "required_documents": [
            "Age Proof",
            "Aadhaar",
            "PAN Card"
        ],
        "portal_url": "https://www.indiapost.gov.in/",
        "category": "Finance",
        "target_group": [
            "Senior Citizens"
        ]
    },
    {
        "id": "28",
        "name": "Deendayal Antyodaya Yojana",
        "name_hindi": "दीनदयाल अंत्योदय योजना",
        "ministry": "Ministry of Housing and Urban Affairs / Rural Development",
        "description": "Skill development scheme to uplift the poor.",
        "benefits": "Free skill training and placement assistance.",
        "benefit_value": "Skill Training",
        "benefit_amount": 0,
        "eligibility": {
            "min_age": 15,
            "max_age": 35,
            "special_conditions": [
                "BPL Family"
            ]
        },
        "application_steps": [
            "Register at training center",
            "Undergo training",
            "Placement"
        ],
        "required_documents": [
            "Aadhaar",
            "BPL Ration Card",
            "Education Proof"
        ],
        "portal_url": "https://nulm.gov.in/",
        "category": "Employment",
        "target_group": [
            "BPL Youth"
        ]
    },
    {
        "id": "29",
        "name": "PM CARES for Children",
        "name_hindi": "बच्चों के लिए पीएम केयर्स",
        "ministry": "Ministry of Women and Child Development",
        "description": "Support for children who lost their parents to COVID-19.",
        "benefits": "₹10 Lakh corpus, monthly stipend from age 18 to 23, health insurance.",
        "benefit_value": "₹10L Corpus + Support",
        "benefit_amount": 1000000,
        "eligibility": {
            "max_age": 18,
            "special_conditions": [
                "COVID Orphan"
            ]
        },
        "application_steps": [
            "Identification by District Magistrate",
            "Registration on portal"
        ],
        "required_documents": [
            "Death certificate of parents",
            "Birth Certificate of child"
        ],
        "portal_url": "https://pmcaresforchildren.in/",
        "category": "Women & Child",
        "target_group": [
            "Orphans"
        ]
    },
    {
        "id": "30",
        "name": "Beti Bachao Beti Padhao",
        "name_hindi": "बेटी बचाओ बेटी पढ़ाओ",
        "ministry": "Ministry of Women and Child Development",
        "description": "Campaign to generate awareness and improve welfare services for girls.",
        "benefits": "Awareness and empowerment programs, linkage with SSY.",
        "benefit_value": "Social Welfare",
        "benefit_amount": 0,
        "eligibility": {
            "gender": [
                "Female"
            ]
        },
        "application_steps": [
            "Participate in local programs",
            "Open SSY account"
        ],
        "required_documents": [],
        "portal_url": "https://wcd.nic.in/bbbp-schemes",
        "category": "Women & Child",
        "target_group": [
            "Girl children"
        ]
    }
]
