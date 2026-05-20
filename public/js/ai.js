// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Document Retrieval Function using Elastic Search API only
async function retrieveRelevantDocs(userQuery) {
    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: userQuery })
        });
        
        if (!response.ok) {
            throw new Error('Search API request failed');
        }
        
        const data = await response.json();
        return data.documents || [];
    } catch (error) {
        console.error('Elastic Search API error:', error);
        return [];
    }
}

// Connect to Groq LLM using OpenAI client approach
async function getLLMResponse(userMessage) {
    try {
        // Check if OpenAI library is loaded
        if (typeof OpenAI === 'undefined') {
            return "I'm experiencing technical difficulties with the AI library, but I'm here to help with your technology questions! As Josh Sylvia's AI assistant, I bring expertise in cybersecurity, cloud architecture, and AI development to solve your technical challenges.";
        }

        // RAG: Retrieve relevant documents from Elastic Search
        const relevantDocs = await retrieveRelevantDocs(userMessage);
        
        // Build context-aware system prompt
        let contextInfo = '';
        if (relevantDocs.length > 0) {
            contextInfo = '\n\nRELEVANT EXPERTISE CONTEXT:\n';
            relevantDocs.forEach((doc, index) => {
                contextInfo += `\n${index + 1}. ${doc.title}: ${doc.content}\n`;
            });
            contextInfo += '\nUse this context to provide specific, detailed responses about Josh Sylvia\'s expertise.';
        }
        
        // Check for API key in environment variables or prompt user
        const apiKey = process.env.GROQ_API_KEY || 
                       prompt('Please enter your Groq API key:', '') ||
                       'demo-key';
        
        if (!apiKey || apiKey === 'demo-key') {
            return "I'm currently in demo mode. To use the full AI capabilities, please configure your Groq API key. As Josh Sylvia's AI assistant, I bring expertise in cybersecurity, cloud architecture, and AI development to solve your technical challenges.";
        }
        
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://api.groq.com/openai/v1',
            dangerouslyAllowBrowser: true
        });

        const response = await client.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: `You are Josh Sylvia, an expert AI assistant specializing in cybersecurity, cloud architecture, DevOps automation, and AI development. You have extensive experience in machine learning, natural language processing, and building intelligent systems that solve complex technical problems.${contextInfo}

Provide helpful, accurate responses about technology questions, emphasizing your expertise in these areas. When relevant, reference specific projects, technologies, or methodologies from your experience. Be detailed and practical in your responses.`
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error('Error calling Groq API:', error);
        return "I apologize, but I'm experiencing technical difficulties with the AI service. As Josh Sylvia's AI assistant, I can still help with general questions about cybersecurity, cloud architecture, and AI development based on my training. Please try again later for more specific assistance.";
    }
}

// Chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    console.log('Sending message:', input.value);
    if (input.value.trim() === '') return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.style.cssText = 'margin-bottom: 15px; padding: 12px; background: #4A90E2; border-radius: 10px; color: #ffffff;';
    userMessage.innerHTML = `<strong>You:</strong> ${input.value}`;
    messages.appendChild(userMessage);
    
    // Get AI response from LLM
    setTimeout(async () => {
        // Show thinking indicator
        const aiMessage = document.createElement('div');
        aiMessage.style.cssText = 'margin-bottom: 15px; padding: 12px; background: #87CEEB; border-radius: 10px; color: #ffffff;';
        aiMessage.innerHTML = '<strong>AI Assistant:</strong> <em>(thinking...)</em>';
        messages.appendChild(aiMessage);
        messages.scrollTop = messages.scrollHeight;
        
        console.log('Waiting for LLM response...');
        const llmResponse = await getLLMResponse(input.value);
        console.log('LLM response received:', llmResponse);
        
        // Update with actual response
        setTimeout(() => {
            aiMessage.innerHTML = `<strong>AI Assistant:</strong> ${llmResponse}`;
            messages.scrollTop = messages.scrollHeight;
        }, 1500); // Show thinking for 1.5 seconds
    }, 1000);
    
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
}

// Load shared navigation component
async function loadNavigation() {
    try {
        const response = await fetch('components/navigation.html');
        const navigationHTML = await response.text();
        document.getElementById('navigation-container').innerHTML = navigationHTML;
        
        // Set active page based on current URL
        setActiveNavigation();
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// Initialize OpenAI library when page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('OpenAI library loading...');
    if (typeof OpenAI !== 'undefined') {
        console.log('OpenAI library loaded successfully');
    } else {
        console.error('OpenAI library not loaded - waiting for library...');
        // Retry after delay
        setTimeout(() => {
            if (typeof OpenAI !== 'undefined') {
                console.log('OpenAI library loaded after retry');
            } else {
                console.error('OpenAI library still not available');
            }
        }, 2000);
    }
});

// Set active navigation link based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Remove active classes
    navLinks.forEach(link => link.classList.remove('active'));
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page links
    if (currentPage === 'ai.html' || currentPage === '') {
        document.querySelector('.nav-link[href="ai.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="ai.html"]')?.classList.add('active');
    } else if (currentPage === 'about.html') {
        document.querySelector('.nav-link[href="about.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="about.html"]')?.classList.add('active');
    } else if (currentPage === 'tutorials.html') {
        document.querySelector('.nav-link[href="tutorials.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="tutorials.html"]')?.classList.add('active');
    } else if (currentPage === 'contact.html') {
        document.querySelector('.nav-link[href="contact.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="contact.html"]')?.classList.add('active');
    }
}

// Add toggleSidebar function for mobile menu
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (window.innerWidth <= 768 && 
        sidebar && 
        !sidebar.contains(event.target) && 
        !navToggle.contains(event.target) && 
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// Load navigation when page loads
document.addEventListener('DOMContentLoaded', loadNavigation);
