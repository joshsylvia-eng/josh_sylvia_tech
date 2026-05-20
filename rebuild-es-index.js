#!/usr/bin/env node

/**
 * Elasticsearch Index Rebuild Script
 * Usage: node rebuild-es-index.js
 */

require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || ''
    }
});

const ES_INDEX = process.env.ELASTICSEARCH_INDEX || 'josh-expertise';

async function rebuildIndex() {
    try {
        console.log('🔧 Starting Elasticsearch index rebuild...');
        
        // Check if Elasticsearch is running
        const health = await esClient.cluster.health();
        console.log('✅ Elasticsearch connection successful');
        console.log(`   Status: ${health.status}`);

        // Delete existing index
        const indexExists = await esClient.indices.exists({ index: ES_INDEX });
        if (indexExists) {
            console.log(`🗑️  Deleting existing index: ${ES_INDEX}`);
            await esClient.indices.delete({ index: ES_INDEX });
            console.log('✅ Index deleted');
        }

        // Create new index with updated mapping
        console.log(`📝 Creating new index: ${ES_INDEX}`);
        await esClient.indices.create({
            index: ES_INDEX,
            body: {
                mappings: {
                    properties: {
                        title: { type: 'text' },
                        content: { type: 'text' },
                        keywords: { type: 'text' },  // text type for partial matching
                        category: { type: 'keyword' }
                    }
                }
            }
        });
        console.log('✅ Index created with mappings');

        // All documents including new cybersecurity content
        const documents = [
            {
                title: "Network Security Fundamentals",
                content: "Josh Sylvia specializes in network security architecture, including firewall configuration, intrusion detection systems, and zero-trust security models. Expert in implementing comprehensive security frameworks for enterprise environments.",
                keywords: ["network", "security", "firewall", "intrusion", "zero-trust"],
                category: "cybersecurity"
            },
            {
                title: "Cloud Security Best Practices",
                content: "Extensive experience in securing cloud infrastructure across AWS, Azure, and GCP. Implements cloud-native security solutions, identity and access management, and compliance frameworks like SOC 2 and ISO 27001.",
                keywords: ["cloud", "aws", "azure", "gcp", "compliance", "soc2", "iso27001"],
                category: "cybersecurity"
            },
            {
                title: "Penetration Testing",
                content: "Certified penetration tester with expertise in identifying vulnerabilities in web applications, mobile apps, and network infrastructure. Proficient in using tools like Burp Suite, Metasploit, and custom security assessment methodologies.",
                keywords: ["penetration", "testing", "vulnerability", "burp", "metasploit"],
                category: "cybersecurity"
            },
            {
                title: "Cloud Architecture Design",
                content: "Designs scalable, resilient cloud architectures using microservices, containerization, and serverless computing. Expert in AWS services including EC2, Lambda, RDS, and infrastructure as code with Terraform.",
                keywords: ["architecture", "microservices", "containers", "serverless", "aws", "terraform"],
                category: "cloud"
            },
            {
                title: "DevOps Pipeline Implementation",
                content: "Builds comprehensive CI/CD pipelines using Jenkins, GitLab CI, and GitHub Actions. Implements automated testing, deployment strategies, and monitoring solutions for cloud-native applications.",
                keywords: ["devops", "cicd", "jenkins", "gitlab", "automation", "monitoring"],
                category: "cloud"
            },
            {
                title: "Kubernetes and Container Orchestration",
                content: "Expert in Kubernetes deployment, management, and optimization. Designs container orchestration strategies for high-availability applications and implements service mesh architectures.",
                keywords: ["kubernetes", "containers", "orchestration", "docker", "service-mesh"],
                category: "cloud"
            },
            {
                title: "Infrastructure as Code",
                content: "Specializes in IaC using Terraform, CloudFormation, and Ansible. Creates reusable infrastructure templates and implements GitOps workflows for infrastructure management.",
                keywords: ["iac", "terraform", "cloudformation", "ansible", "gitops"],
                category: "devops"
            },
            {
                title: "Monitoring and Observability",
                content: "Implements comprehensive monitoring solutions using Prometheus, Grafana, and ELK stack. Designs alerting strategies and creates dashboards for system health and performance metrics.",
                keywords: ["monitoring", "observability", "prometheus", "grafana", "elk", "metrics"],
                category: "devops"
            },
            {
                title: "Automation Scripting",
                content: "Proficient in Python, Bash, and PowerShell for automation tasks. Creates custom scripts for deployment, monitoring, and maintenance of complex infrastructure.",
                keywords: ["automation", "python", "bash", "powershell", "scripting"],
                category: "devops"
            },
            {
                title: "Machine Learning Engineering",
                content: "Builds and deploys machine learning models using TensorFlow, PyTorch, and scikit-learn. Expert in model optimization, deployment pipelines, and MLOps practices for production ML systems.",
                keywords: ["machine learning", "tensorflow", "pytorch", "mlops", "deployment"],
                category: "ai"
            },
            {
                title: "Natural Language Processing",
                content: "Develops NLP solutions using transformers, BERT, and GPT models. Implements text classification, sentiment analysis, and custom language models for business applications.",
                keywords: ["nlp", "transformers", "bert", "gpt", "text", "classification"],
                category: "ai"
            },
            {
                title: "AI System Architecture",
                content: "Designs scalable AI systems with focus on performance, reliability, and cost optimization. Expert in distributed computing, model serving, and AI infrastructure management.",
                keywords: ["ai architecture", "distributed", "serving", "infrastructure", "optimization"],
                category: "ai"
            },
            {
                title: "Cybersecurity",
                content: "Comprehensive cybersecurity framework covering software engineering security fundamentals, CompTIA AI Security+, and CISSP compliance frameworks. Includes versioning, identity & access management (IAM), Transport Layer Security (TLS), API security, secure coding practices, authentication & authorization, AI security basics, data security for AI, model security & prompt injection attacks, AI governance, NIST 800-53 security controls, CCPA & GDPR privacy regulations, PHI & PII protection, FISMA & FedRAMP federal compliance, enterprise risk management, and incident response procedures. Implements secure software development with MFA, SSO, RBAC, encryption, rate limiting, input validation, and comprehensive audit logging.",
                keywords: ["cybersecurity", "security", "compliance", "NIST", "GDPR", "CCPA", "HIPAA", "FISMA", "FedRAMP", "IAM", "TLS", "encryption", "authentication", "API security", "risk management", "incident response", "AI security", "prompt injection"],
                category: "cybersecurity"
            },
            {
                title: "Cybersecurity - Software Engineering Security",
                content: "Secure software development fundamentals including versioning (semantic versioning, signed commits), Identity & Access Management (IAM - authentication, authorization, least privilege, RBAC, ABAC), Transport Layer Security (TLS 1.2+, cipher suites, certificate management, HSTS), API Security (OAuth 2.0, API keys, rate limiting, input validation, OWASP Top 10 API risks), Secure Coding Practices (input validation, parameterized queries, output encoding, secure error handling, dependency management), and Authentication & Authorization mechanisms (MFA, passwordless auth, SSO, SAML, FIDO2).",
                keywords: ["software security", "secure coding", "versioning", "IAM", "TLS", "API security", "authentication", "authorization", "RBAC", "encryption"],
                category: "cybersecurity"
            },
            {
                title: "Cybersecurity - CompTIA AI Security+",
                content: "AI-specific security challenges including AI Security Fundamentals (adversarial examples, model poisoning, supply chain risks, model extraction, backdoor attacks), Data Security for AI (data classification, encryption, anonymization, differential privacy, data lineage tracking), Model Security & Prompt Injection (generative AI threats including prompt injection, jailbreaking, data exfiltration, adversarial prompts, model poisoning, defense strategies with input filtering, output validation, rate limiting, audit logging), and AI Governance (ethics review boards, explainability requirements, bias audits, human-in-the-loop approval, compliance documentation).",
                keywords: ["AI security", "CompTIA", "prompt injection", "adversarial examples", "model security", "data privacy", "generative AI", "AI governance", "model poisoning"],
                category: "cybersecurity"
            },
            {
                title: "Cybersecurity - NIST 800-53",
                content: "NIST SP 800-53 comprehensive security controls catalog for federal information systems. Control categories include Access Control (AC), Identification & Authentication (IA), System & Communications Protection (SC), Audit & Accountability (AU), System Development & Change Management (SA), Incident & Response Planning (IR), Contingency Planning (CP), and System & Information Integrity (SI). Implementation approach includes security categorization (FIPS 199), baseline control selection based on impact level (low/moderate/high), risk-based tailoring, and continuous monitoring.",
                keywords: ["NIST", "NIST 800-53", "security controls", "federal compliance", "access control", "authentication", "audit logging", "change management"],
                category: "cybersecurity"
            },
            {
                title: "Cybersecurity - CCPA & GDPR",
                content: "Privacy regulations and consumer data protection. GDPR requirements include legal basis for processing, Data Protection Impact Assessment (DPIA), right to be forgotten, right to data portability, 72-hour breach notification, privacy by design, and Data Processing Agreements (DPA). CCPA requirements include right to know, right to delete, right to opt-out, right to non-discrimination, vendor management, and security safeguards. GDPR penalties up to €20 million or 4% of global revenue; CCPA penalties up to $7,500 per intentional violation. Enforcement by national DPAs and private rights of action.",
                keywords: ["GDPR", "CCPA", "privacy", "data protection", "personal data", "compliance", "DPA", "DPIA", "data breach notification"],
                category: "cybersecurity"
            },
            {
                title: "Cybersecurity - FISMA & FedRAMP",
                content: "Federal information security compliance requirements. FISMA (Federal Information Security Management Act) requires information security categorization, NIST 800-53 control selection, control assessment & authorization, continuous monitoring, and annual compliance assessment. FedRAMP (Federal Risk and Authorization Management Program) provides standardized approach with three baselines (Low, Moderate, High impact levels). FedRAMP authorization process includes assessment by authorized Third Party Assessment Organizations (3PAOs), Security Assessment Report (SAR), Plan of Action & Milestones (POA&M), and JAB or Agency authorization with continuous monitoring.",
                keywords: ["FISMA", "FedRAMP", "federal compliance", "FIPS 199", "security categorization", "government security", "authorization", "continuous monitoring", "3PAO"],
                category: "cybersecurity"
            },
            {
                title: "Cybersecurity - PHI & PII",
                content: "Protected Health Information (PHI) and Personally Identifiable Information (PII) security and privacy. HIPAA privacy, security, and breach notification rules require administrative, physical, and technical safeguards. Protected data includes SSN, driver's license, medical records, financial information. HIPAA technical safeguards include encryption, access controls, audit logs, and system integrity controls. Business Associate Agreements (BAA) required with vendors. PII protection strategies include data minimization, encryption at rest/in transit, role-based access control, de-identification, anonymization, and regular vulnerability assessments. Breach notification to individuals and regulators required.",
                keywords: ["HIPAA", "PHI", "PII", "personal data", "health information", "privacy", "data protection", "encryption", "breach notification", "BAA"],
                category: "cybersecurity"
            },
            {
                title: "Cybersecurity - Risk Management",
                content: "Enterprise risk management framework including NIST Risk Management Framework (RMF) with seven steps: Prepare, Categorize, Select, Implement, Assess, Authorize, and Monitor. Risk assessment methodology includes threat identification, vulnerability assessment, likelihood determination, impact analysis, risk calculation (Risk = Likelihood × Impact), and prioritization. Risk treatment options include mitigation (implement controls), acceptance (documented acknowledgment), avoidance (discontinue activity), and transfer (insurance/outsourcing). Continuous monitoring, vulnerability scanning, and regular control assessments ensure ongoing effectiveness.",
                keywords: ["risk management", "NIST RMF", "threat", "vulnerability", "risk assessment", "mitigation", "control selection", "continuous monitoring"],
                category: "cybersecurity"
            },
            {
                title: "Cybersecurity - Incident Response",
                content: "Incident response management lifecycle including Preparation (tools, processes, training), Detection & Analysis (identify and classify incidents), Containment (short and long-term), Eradication (remove artifacts and root causes), Recovery (restore systems), and Post-Incident (lessons learned). Incident response team roles include incident commander, security analysts, system administrators, network engineers, legal/compliance, and executive management. Communication procedures include escalation, customer notification, regulatory reporting (72-hour GDPR requirement), and media/public communication. Forensic preservation and evidence handling critical for investigation and legal proceedings.",
                keywords: ["incident response", "IR", "breach response", "forensics", "investigation", "containment", "eradication", "recovery", "post-incident review", "notification"],
                category: "cybersecurity"
            },
            {
                title: "APIs",
                content: "API design, security, and implementation covering REST principles, GraphQL, gRPC, and WebSocket protocols. Security practices include OAuth 2.0, API key management, rate limiting, input validation, output encoding, CORS configuration, and comprehensive logging. API versioning strategies and backward compatibility. OWASP Top 10 API Security risks including broken object level authorization (BOLA), broken authentication, unrestricted resource consumption, and broken function level authorization. API gateway patterns and microservices integration.",
                keywords: ["API", "APIs", "REST", "GraphQL", "gRPC", "OAuth", "rate limiting", "API security", "microservices"],
                category: "apis"
            }
        ];

        // Bulk index documents
        console.log(`📚 Indexing ${documents.length} documents...`);
        const bulkBody = documents.flatMap(doc => [
            { index: { _index: ES_INDEX, _id: doc.title } },
            doc
        ]);

        const bulkResponse = await esClient.bulk({ body: bulkBody });
        
        if (bulkResponse.errors) {
            console.error('❌ Some documents failed to index');
            bulkResponse.items.forEach((item, idx) => {
                if (item.index.error) {
                    console.error(`   Document ${idx}: ${item.index.error.reason}`);
                }
            });
        } else {
            console.log(`✅ Successfully indexed ${documents.length} documents`);
        }

        // Verify document count
        const countResponse = await esClient.count({ index: ES_INDEX });
        console.log(`\n📊 Index Status:`);
        console.log(`   Index: ${ES_INDEX}`);
        console.log(`   Total documents: ${countResponse.count}`);

        // Test searches
        console.log(`\n🔍 Testing searches:`);
        
        const searches = ['api', 'security', 'NIST', 'cybersecurity', 'GDPR', 'cloud'];
        for (const term of searches) {
            const result = await esClient.search({
                index: ES_INDEX,
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    multi_match: {
                                        query: term,
                                        fields: ['keywords^5', 'title^3', 'content^1'],
                                        operator: 'or',
                                        fuzziness: 'AUTO'
                                    }
                                },
                                {
                                    match: {
                                        keywords: {
                                            query: term,
                                            boost: 10
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    size: 3
                }
            });
            console.log(`   "${term}": ${result.hits.total.value} results ${result.hits.hits.length > 0 ? '✅' : '❌'}`);
        }

        console.log('\n✨ Elasticsearch index rebuild complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error rebuilding index:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Ensure Elasticsearch is running on http://localhost:9200');
        console.error('2. Check ELASTICSEARCH_NODE environment variable if using custom host');
        console.error('3. Run: npm start (after this script completes)');
        process.exit(1);
    }
}

rebuildIndex();
