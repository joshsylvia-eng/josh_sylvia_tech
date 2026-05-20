// Load path module first to ensure availability
var path            = require('path');

// modules =================================================
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var compression     = require('compression');
var http            = require('http');
var { Client }      = require('@elastic/elasticsearch');
require('dotenv').config();

// Enhanced logging for deployment debugging
console.log('=== SERVER STARTUP DEBUGGING ===');
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('Path module loaded:', typeof path !== 'undefined');
console.log('Path.extname function:', typeof path.extname === 'function');
console.log('Working directory:', __dirname);
console.log('=== END DEBUGGING ===');

// configuration ===========================================

// PostgreSQL Database Configuration
// Database connection is handled in config/database.js
var port = process.env.PORT || 8080; // set our port

// Elastic Search Configuration
const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || ''
    }
});

const ES_INDEX = process.env.ELASTICSEARCH_INDEX || 'josh-expertise';

// Initialize Elastic Search index with documents
async function initializeElasticSearch() {
    try {
        // Check if we need to force rebuild the index
        const forceReindex = process.env.FORCE_REINDEX === 'true' || process.argv.includes('--force-reindex');
        
        // Check if index exists
        let indexExists = await esClient.indices.exists({ index: ES_INDEX });
        
        if (forceReindex && indexExists) {
            console.log('Force rebuild: Deleting existing Elastic Search index:', ES_INDEX);
            await esClient.indices.delete({ index: ES_INDEX });
            indexExists = false;
        }
        
        if (!indexExists) {
            console.log('Creating Elastic Search index:', ES_INDEX);
            
            // Create index with mapping - keywords as text for partial matching
            await esClient.indices.create({
                index: ES_INDEX,
                body: {
                    mappings: {
                        properties: {
                            title: { type: 'text' },
                            content: { type: 'text' },
                            keywords: { type: 'text' },  // Changed from 'keyword' to 'text' for partial matching
                            category: { type: 'keyword' }
                        }
                    }
                }
            });
            
            // Index documents
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
                }
            ];
            
            // Bulk index documents
            const bulkBody = documents.flatMap(doc => [
                { index: { _index: ES_INDEX, _id: doc.title } },
                doc
            ]);
            
            await esClient.bulk({ body: bulkBody });
            console.log('Elastic Search index initialized with', documents.length, 'documents');
        } else {
            console.log('Elastic Search index already exists:', ES_INDEX);
        }
    } catch (error) {
        console.error('Error initializing Elastic Search:', error);
    }
}



// Enable gzip compression
app.use(compression());

// Parse request bodies
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Override HTTP methods
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// Serve static files with optimized caching headers
app.use(express.static(__dirname + '/public', {
    maxAge: '7d', // Cache for 7 days
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      console.log('=== STATIC FILE DEBUGGING ===');
      console.log('File path:', filePath);
      console.log('Path module available:', typeof path !== 'undefined');
      console.log('Path.extname available:', typeof path.extname === 'function');
      console.log('=== END STATIC DEBUG ===');
      
      if (path.extname(filePath) === '.js') {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.extname(filePath) === '.css') {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      } else if (path.extname(filePath) === '.html') {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
      return res;
    }
}));

// HTTPS redirection middleware - fixed to prevent redirect loops
app.use((req, res, next) => {
    // Only redirect if not already HTTPS and not an API call
    if (req.header('x-forwarded-proto') !== 'https' && !req.url.startsWith('/api/')) {
        return res.redirect(301, `https://${req.header('host')}${req.url}`);
    }
    next();
});

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// SSL certificate management
const fs = require('fs');
const sslDir = path.join(__dirname, 'ssl');

// Ensure SSL directory exists
if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
    console.log('Created SSL directory');
}

// CDN integration for static assets
const cdnMiddleware = (req, res, next) => {
    // Serve static files from CDN in production
    if (process.env.NODE_ENV === 'production') {
        const cdnUrl = 'https://cdn.jsdelivr.net';
        res.setHeader('X-CDN-Cache-Control', 'public, max-age=31536000');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
};

// Performance monitoring
const performanceMonitor = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`Request processed in ${duration}ms`);
    });
    next();
};

// routes ==================================================
	// Basic API routes for AI functionality
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AI Chatbot Server is running',
    timestamp: new Date().toISOString()
  });
});

// Elastic Search API endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required' 
      });
    }
    
    const response = await esClient.search({
      index: ES_INDEX,
      body: {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: query,
                  fields: ['keywords^5', 'title^3', 'content^1'],
                  type: 'best_fields',
                  operator: 'or',
                  fuzziness: 'AUTO'
                }
              },
              {
                match: {
                  keywords: {
                    query: query,
                    boost: 10
                  }
                }
              }
            ]
          }
        },
        size: 8
      }
    });
    
    const documents = response.hits.hits.map(hit => ({
      title: hit._source.title,
      content: hit._source.content,
      keywords: hit._source.keywords,
      relevanceScore: hit._score
    }));
    
    res.json({ 
      success: true, 
      documents: documents,
      total: response.hits.total.value
    });
  } catch (error) {
    console.error('Elastic Search API error:', error.message);
    // Return empty array instead of 500 error when Elastic Search is unavailable
    res.json({ 
      success: true, 
      documents: [],
      total: 0,
      error: 'Elastic Search unavailable'
    });
  }
});


// Cache for videos data
let videosCache = null;
let cacheTimeout = null;

// Videos API endpoint
app.get('/api/videos', async (req, res) => {
  try {
    // Check cache first
    if (videosCache && cacheTimeout && Date.now() - cacheTimeout < 300000) { // 5 minutes cache
      console.log('Returning cached videos data');
      return res.json(videosCache);
    }
    
    const fs = require('fs');
    const path = require('path');
    const videosDataFile = path.join(__dirname, 'data', 'videos.json');
    
    let content = [];
    let videos = [];
    
    // Read videos from JSON file
    if (fs.existsSync(videosDataFile)) {
      const videosData = fs.readFileSync(videosDataFile, 'utf8');
      videos = JSON.parse(videosData);
      content = content.concat(videos);
      console.log(`Loaded ${videos.length} videos from JSON file`);
      
      // Update cache
      videosCache = {
        data: content,
        timestamp: Date.now()
      };
      cacheTimeout = Date.now();
    }
    
    // Add GitHub repositories
    const githubRepos = [
      {
        title: 'Metasploit Framework',
        description: 'The world\'s most used penetration testing framework. Advanced exploitation framework for security professionals and ethical hackers.',
        youtube_id: '',
        location: 'Cybersecurity Tools',
        tags: ['cybersecurity', 'penetration testing', 'security', 'metasploit'],
        is_featured: false,
        type: 'github',
        category: 'cybersecurity',
        file_path: 'https://github.com/rapid7/metasploit-framework',
        file_size: 0,
        duration: 0,
        created_at: '2024-01-15T00:00:00Z'
      },
      {
        title: 'OSQuery',
        description: 'SQL powered operating system instrumentation and monitoring. Query your devices like a database for security monitoring and compliance.',
        youtube_id: '',
        location: 'Security Monitoring',
        tags: ['security', 'monitoring', 'siem', 'osquery'],
        is_featured: false,
        type: 'github',
        category: 'cybersecurity',
        file_path: 'https://github.com/osquery/osquery',
        file_size: 0,
        duration: 0,
        created_at: '2024-01-20T00:00:00Z'
      },
      {
        title: 'Security Tools for Developers',
        description: 'Comprehensive collection of security tools and resources for developers. Essential security utilities for modern software development.',
        youtube_id: '',
        location: 'Developer Security',
        tags: ['security', 'development', 'tools', 'devsecops'],
        is_featured: false,
        type: 'github',
        category: 'cybersecurity',
        file_path: 'https://github.com/erev0s/Security-Tools-for-Developers',
        file_size: 0,
        duration: 0,
        created_at: '2024-01-25T00:00:00Z'
      },
      {
        title: 'Terraform Provider AWS',
        description: 'Official Terraform AWS provider for infrastructure as code. Manage AWS resources with declarative configuration files.',
        youtube_id: '',
        location: 'Cloud Infrastructure',
        tags: ['aws', 'terraform', 'infrastructure', 'devops'],
        is_featured: false,
        type: 'github',
        category: 'cloud-devops',
        file_path: 'https://github.com/hashicorp/terraform-provider-aws',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-01T00:00:00Z'
      },
      {
        title: 'Kubernetes',
        description: 'Production-grade container orchestration platform. Automate deployment, scaling, and management of containerized applications.',
        youtube_id: '',
        location: 'Container Orchestration',
        tags: ['kubernetes', 'containers', 'orchestration', 'devops'],
        is_featured: false,
        type: 'github',
        category: 'cloud-devops',
        file_path: 'https://github.com/kubernetes/kubernetes',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-05T00:00:00Z'
      },
      {
        title: 'Next.js',
        description: 'The React framework for production. Full-stack React framework with server-side rendering, routing, and more.',
        youtube_id: '',
        location: 'Frontend Framework',
        tags: ['react', 'nextjs', 'frontend', 'javascript'],
        is_featured: false,
        type: 'github',
        category: 'fullstack',
        file_path: 'https://github.com/vercel/next.js',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-10T00:00:00Z'
      },
      {
        title: 'Express.js',
        description: 'Fast, unopinionated web framework for Node.js. Minimal and flexible Node.js web application framework.',
        youtube_id: '',
        location: 'Backend Framework',
        tags: ['nodejs', 'express', 'backend', 'api'],
        is_featured: false,
        type: 'github',
        category: 'fullstack',
        file_path: 'https://github.com/expressjs/express',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-15T00:00:00Z'
      },
      {
        title: 'LangChain',
        description: 'Building applications with LLMs through composability. Framework for developing applications powered by large language models.',
        youtube_id: '',
        location: 'AI & LLM Framework',
        tags: ['ai', 'llm', 'langchain', 'machine learning'],
        is_featured: false,
        type: 'github',
        category: 'ai-rag',
        file_path: 'https://github.com/langchain-ai/langchain',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-20T00:00:00Z'
      }
    ];
    
    content = content.concat(githubRepos);
    console.log(`Serving ${content.length} total items (${videos.length} videos + ${githubRepos.length} GitHub repos)`);
    
    // Update cache before sending response
    videosCache = {
      data: content,
      timestamp: Date.now()
    };
    cacheTimeout = Date.now();
    
    res.json(content);
    
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch content' 
    });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, Email, Subject, and Message are required' 
      });
    }

    // Get email from environment variables
    const recipientEmail = process.env.CONTACT_EMAIL || 'joshsylvia@yahoo.com';
    
    console.log('Contact Form Submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('To:', recipientEmail);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    
    // Import Mailtrap for development email testing
    const { MailtrapClient } = require('mailtrap');
    
    // Create Mailtrap client
    let client;
    
    // Check for Mailtrap credentials
    const TOKEN = process.env.MAILTRAP_TOKEN || '607ef5e8b5da9a30591e536ee4d19573';
    
    if (!TOKEN || TOKEN === 'your-mailtrap-token') {
      console.log('Mailtrap token not configured in .env file');
      console.log('Email sending disabled - using development mode');
      client = null;
    } else {
      try {
        client = new MailtrapClient({
          token: TOKEN,
        });
        console.log('Mailtrap client configured successfully');
      } catch (error) {
        console.error('Failed to create Mailtrap client:', error);
        client = null;
        console.log('Email sending disabled - using development mode');
      }
    }
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@yahoo.com',
      to: recipientEmail,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 10px;">New Contact Form Submission</h2>
            <p style="color: #666; line-height: 1.5;"><strong>Name:</strong> ${name}</p>
            <p style="color: #666; line-height: 1.5;"><strong>Email:</strong> ${email}</p>
            <p style="color: #666; line-height: 1.5;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #666; line-height: 1.5;"><strong>Message:</strong></p>
            <div style="background: #fff; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message}
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">Sent from: ${req.ip || 'Unknown IP'}</p>
            <p style="color: #999; font-size: 12px;">Date: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };
    
    // Send email using Mailtrap
    if (client) {
      try {
        console.log('Attempting to send email via Mailtrap...');
        
        const sender = {
          email: email || 'noreply@joshylvia.com',
          name: name || 'Contact Form',
        };
        
        const recipients = [
          {
            email: recipientEmail,
          }
        ];
        
        const mailOptions = {
          from: sender,
          to: recipients,
          subject: subject,
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <h2 style="color: #333; margin-bottom: 10px;">New Contact Form Submission</h2>
                <p style="color: #666; line-height: 1.5;"><strong>Name:</strong> ${name}</p>
                <p style="color: #666; line-height: 1.5;"><strong>Email:</strong> ${email}</p>
                <p style="color: #666; line-height: 1.5;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #666; line-height: 1.5;"><strong>Message:</strong></p>
                <div style="background: #fff; padding: 15px; border-radius: 4px; margin-top: 10px;">
                  ${message}
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">Sent from: ${req.ip || 'Unknown IP'}</p>
                <p style="color: #999; font-size: 12px;">Date: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `
        };
        
        const response = await client.send(mailOptions);
        console.log('Mailtrap response:', response);
        
        res.json({ 
          success: true, 
          message: 'Message received successfully. Email sent to ' + recipientEmail 
        });
        
      } catch (error) {
        console.error('Mailtrap error:', error);
        
        // Provide specific error handling for Mailtrap issues
        let errorMessage = 'Failed to send email: ' + error.message;
        if (error.response) {
          errorMessage = 'Mailtrap API error: ' + error.response.data.errors[0].message;
        } else if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Connection to Mailtrap failed. Please check your API token.';
        } else {
          errorMessage = 'Email service temporarily unavailable. Please try again later.';
        }
        
        res.status(500).json({ 
          success: false, 
          error: errorMessage
        });
      }
    } else {
      // Development mode - just log and return success
      console.log('Development mode - logging email submission only');
      console.log('Contact Form Submission:');
      console.log('To:', recipientEmail);
      console.log('Subject:', subject);
      console.log('Message:', message);
      console.log('Timestamp:', new Date().toISOString());
      
      res.json({ 
        success: true, 
        message: 'Message received successfully (development mode)' 
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process contact form' 
    });
  }
});

app.use(function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});


/**
 * Create HTTP server.
 */

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('AI Chatbot Server listening on ' + bind);
  
  // Initialize Elastic Search after server starts
  initializeElasticSearch();
}

exports = module.exports = app;						// expose app
