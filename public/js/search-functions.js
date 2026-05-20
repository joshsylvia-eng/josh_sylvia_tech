// Comprehensive Search Index (Elasticsearch-like)
const searchIndex = [
    // Pages
    { id: 1, title: 'Home', category: 'page', url: 'index.html', description: 'Josh Sylvia - Principal Software Engineer & Technology Innovator homepage with CISSP certification', keywords: ['josh', 'sylvia', 'principal', 'software', 'engineer', 'technology', 'innovator', 'cissp', 'certified', 'cybersecurity', 'home', 'portfolio'] },
    { id: 2, title: 'AI Chatbot', category: 'page', url: 'ai.html', description: 'AI-powered chatbot with OpenAI and Groq integration', keywords: ['ai', 'artificial', 'intelligence', 'chatbot', 'openai', 'groq', 'machine', 'learning', 'automation'] },
    { id: 3, title: 'APIs', category: 'page', url: 'apis.html', description: 'REST API documentation and integration guides', keywords: ['api', 'rest', 'endpoint', 'service', 'web', 'integration', 'documentation'] },
    { id: 4, title: 'QA', category: 'page', url: 'qa.html', description: 'Quality assurance and testing resources', keywords: ['qa', 'quality', 'assurance', 'testing', 'questions', 'answers', 'debugging'] },
    { id: 5, title: 'Tutorials', category: 'page', url: 'tutorials.html', description: 'Video tutorials and learning resources', keywords: ['tutorial', 'guide', 'how', 'to', 'learn', 'video', 'github', 'education'] },
    { id: 6, title: 'About', category: 'page', url: 'about.html', description: 'Professional background and experience', keywords: ['about', 'bio', 'background', 'experience', 'skills', 'career', 'resume'] },
    { id: 7, title: 'Contact', category: 'page', url: 'contact.html', description: 'Contact information and message form', keywords: ['contact', 'email', 'message', 'reach', 'out', 'communication'] },
    
    // Technologies and Skills
    { id: 8, title: 'CISSP Certification', category: 'certification', url: 'index.html', description: 'Certified Information Systems Security Professional (CISSP) - Certificate Number: 2273572', keywords: ['cissp', 'certified', 'information', 'systems', 'security', 'professional', 'certificate', '2273572', 'cybersecurity'] },
    { id: 9, title: 'Node.js Development', category: 'technology', url: 'apis.html', description: 'Server-side JavaScript development with Express.js', keywords: ['nodejs', 'javascript', 'express', 'server', 'backend', 'development'] },
    { id: 10, title: 'React Frontend', category: 'technology', url: 'tutorials.html', description: 'Modern React applications with hooks and components', keywords: ['react', 'frontend', 'javascript', 'components', 'hooks', 'ui'] },
    { id: 11, title: 'Cloud Architecture', category: 'technology', url: 'index.html', description: 'AWS, Azure, and Google Cloud platform expertise', keywords: ['cloud', 'aws', 'azure', 'gcp', 'architecture', 'infrastructure', 'devops', 'devsecops'] },
    { id: 12, title: 'Database Design', category: 'technology', url: 'apis.html', description: 'PostgreSQL, MongoDB, and database optimization', keywords: ['database', 'postgresql', 'mongodb', 'sql', 'nosql', 'optimization'] },
    
    // Projects and Tools
    { id: 13, title: 'Metasploit Framework', category: 'project', url: 'tutorials.html', description: 'Penetration testing framework for security professionals', keywords: ['metasploit', 'penetration', 'testing', 'security', 'framework', 'cybersecurity'] },
    { id: 14, title: 'OSQuery Monitoring', category: 'project', url: 'tutorials.html', description: 'SQL-powered operating system instrumentation and monitoring', keywords: ['osquery', 'monitoring', 'security', 'siem', 'instrumentation', 'sql'] },
    { id: 15, title: 'Kubernetes Orchestration', category: 'project', url: 'tutorials.html', description: 'Container orchestration and microservices management', keywords: ['kubernetes', 'containers', 'orchestration', 'microservices', 'docker'] },
    { id: 16, title: 'Terraform Infrastructure', category: 'project', url: 'tutorials.html', description: 'Infrastructure as code with Terraform and AWS provider', keywords: ['terraform', 'infrastructure', 'code', 'iac', 'aws', 'automation'] },
    
    // Security Topics
    { id: 17, title: 'DEFCON Conference', category: 'security', url: 'index.html', description: 'Regular attendee at DEFCON security conference', keywords: ['defcon', 'conference', 'security', 'hacking', 'cybersecurity', 'networking'] },
    { id: 18, title: 'Security Tools', category: 'security', url: 'tutorials.html', description: 'Collection of security tools and resources for developers', keywords: ['security', 'tools', 'devsecops', 'penetration', 'testing', 'vulnerability'] },
    { id: 19, title: 'Network Security', category: 'security', url: 'about.html', description: 'Network security implementation and best practices', keywords: ['network', 'security', 'firewall', 'vpn', 'encryption', 'protocols'] },
    
    // Development Topics
    { id: 20, title: 'Full Stack Development', category: 'development', url: 'about.html', description: 'End-to-end web application development', keywords: ['fullstack', 'full', 'stack', 'development', 'frontend', 'backend'] },
    { id: 21, title: 'API Development', category: 'development', url: 'apis.html', description: 'RESTful API design and implementation', keywords: ['api', 'development', 'rest', 'endpoint', 'microservices'] },
    { id: 22, title: 'Performance Optimization', category: 'development', url: 'tutorials.html', description: 'Application performance tuning and optimization', keywords: ['performance', 'optimization', 'tuning', 'caching', 'database'] },
    { id: 23, title: 'DevSecOps Practices', category: 'development', url: 'about.html', description: 'Security-integrated DevOps practices with automated security scanning, compliance automation, and shift-left security', keywords: ['devsecops', 'devops', 'security', 'automation', 'cicd', 'compliance', 'shift-left', 'security-as-code'] }
];

// Search functionality
let autocompleteTimeout;
let currentResults = [];
let selectedIndex = -1;

// Make functions globally available
window.handleSearchKeydown = function(event) {
    console.log('DEBUG: handleSearchKeydown called', event.key, event.target.value);
    const dropdown = document.getElementById('autocomplete-dropdown');
    const items = dropdown.querySelectorAll('.autocomplete-item');
    
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        updateSelectedIndex(items);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelectedIndex(items);
    } else if (event.key === 'Enter') {
        if (selectedIndex >= 0 && items[selectedIndex]) {
            event.preventDefault();
            items[selectedIndex].click();
        } else {
            // If no item selected, perform full search
            performSearch();
            closeAutocomplete();
        }
    } else if (event.key === 'Escape') {
        console.log('DEBUG: Escape key pressed, closing autocomplete');
        closeAutocomplete();
    }
};

function updateSelectedIndex(items) {
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('selected');
        }
    });
}

window.handleAutocomplete = async function(event) {
    console.log('DEBUG: handleAutocomplete called', event.target.value);
    const searchTerm = event.target.value.trim();
    
    clearTimeout(autocompleteTimeout);
    
    if (searchTerm.length < 2) {
        console.log('DEBUG: Search term too short, closing autocomplete');
        closeAutocomplete();
        return;
    }
    
    autocompleteTimeout = setTimeout(async () => {
        console.log('DEBUG: Searching Elastic Search for:', searchTerm);
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: searchTerm })
            });
            
            if (!response.ok) {
                throw new Error('Search API request failed');
            }
            
            const data = await response.json();
            const results = data.documents || [];
            
            console.log('DEBUG: Found', results.length, 'results from Elastic Search');
            displayAutocomplete(results, searchTerm);
        } catch (error) {
            console.error('Elastic Search API error in autocomplete:', error);
            closeAutocomplete();
        }
    }, 300);
};

window.displayAutocomplete = function(results, searchTerm) {
    const dropdown = document.getElementById('autocomplete-dropdown');
    
    if (results.length === 0) {
        closeAutocomplete();
        return;
    }
    
    const limitedResults = results.slice(0, 8);
    
    const html = limitedResults.map(item => {
        const highlightedTitle = highlightText(item.title, searchTerm);
        const highlightedContent = highlightText(item.content, searchTerm);
        
        return `
            <div class="autocomplete-item" onclick="selectAutocompleteItem('${item.title}')">
                <div class="title">${highlightedTitle}</div>
                <div class="category">${item.keywords ? item.keywords.join(', ') : ''}</div>
                <div class="description">${highlightedContent}</div>
            </div>
        `;
    }).join('');
    
    dropdown.innerHTML = html;
    dropdown.classList.add('show');
    currentResults = results;
};

window.highlightText = function(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
};

window.selectAutocompleteItem = function(title) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = title;
    closeAutocomplete();
    // Optionally trigger a full search with the selected title
    performSearch();
};

window.closeAutocomplete = function() {
    const dropdown = document.getElementById('autocomplete-dropdown');
    dropdown.classList.remove('show');
    dropdown.innerHTML = '';
};

window.performSearch = async function() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        return;
    }
    
    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: searchTerm })
        });
        
        if (!response.ok) {
            throw new Error('Search API request failed');
        }
        
        const data = await response.json();
        const results = data.documents || [];
        
        displaySearchResults(results, searchTerm);
        closeAutocomplete();
    } catch (error) {
        console.error('Elastic Search API error in performSearch:', error);
        displaySearchResults([], searchTerm);
        closeAutocomplete();
    }
};

window.displaySearchResults = function(results, searchTerm) {
    let modal = document.getElementById('search-results-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'search-results-modal';
        modal.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 700px;
            max-height: 500px;
            overflow-y: auto;
            z-index: 10000;
            padding: 20px;
        `;
        document.body.appendChild(modal);
    }
    
    if (results.length === 0) {
        modal.innerHTML = `
            <h3>No results found for "${searchTerm}"</h3>
            <p>Try searching for different keywords like: Network Security, Cloud Architecture, DevOps, AI, Machine Learning</p>
            <button onclick="closeSearchResults()" style="margin-top: 10px; padding: 8px 16px; background: #6B46C1; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        `;
    } else {
        const resultsHtml = results.map(result => `
            <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <h4 style="color: #6B46C1; margin: 0 0 8px 0;">${result.title}</h4>
                <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                    <span style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; margin-right: 8px;">Score: ${result.relevanceScore ? result.relevanceScore.toFixed(2) : 'N/A'}</span>
                    ${result.keywords ? result.keywords.map(k => `<span style="background: #e0e0e0; padding: 2px 6px; border-radius: 3px; margin-right: 4px;">${k}</span>`).join('') : ''}
                </div>
                <p style="color: #666; font-size: 14px; margin: 0;">${result.content}</p>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <h3>Search Results for "${searchTerm}" (${results.length} found)</h3>
            ${resultsHtml}
            <button onclick="closeSearchResults()" style="margin-top: 15px; padding: 8px 16px; background: #6B46C1; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        `;
    }
    
    setTimeout(() => {
        document.addEventListener('click', function closeSearchModal(e) {
            if (!modal.contains(e.target) && e.target.id !== 'search-input') {
                closeSearchResults();
                document.removeEventListener('click', closeSearchModal);
            }
        });
    }, 100);
};

window.closeSearchResults = function() {
    const modal = document.getElementById('search-results-modal');
    if (modal) {
        modal.remove();
    }
};

// Close autocomplete when clicking outside
document.addEventListener('click', function(event) {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(event.target)) {
        closeAutocomplete();
    }
});

// Initialize search input debugging
document.addEventListener('DOMContentLoaded', function() {
    console.log('DEBUG: DOM loaded, search functions available');
});
