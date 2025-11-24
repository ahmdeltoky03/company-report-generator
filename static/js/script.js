// DOM Elements
const setKeysBtn = document.getElementById('set-keys-btn');
const generateBtn = document.getElementById('generate-btn');

const cohereKeyInput = document.getElementById('cohere-key');
const tavilyKeyInput = document.getElementById('tavily-key');
const companyNameInput = document.getElementById('company-name');
const companyLinkInput = document.getElementById('company-link');

const keysMessage = document.getElementById('keys-message');
const errorMessage = document.getElementById('error-message');
const loadingDiv = document.getElementById('loading');
const reportSection = document.getElementById('report-section');
const reportContent = document.getElementById('report-content');

let currentReportData = null;
let currentCompanyName = null;
let keysVisible = { cohere: false, tavily: false };
let storedKeys = { cohere: null, tavily: null };

window.addEventListener('DOMContentLoaded', () => {
    loadStoredKeys();
    setupToggleVisibility();
});

function loadStoredKeys() {
    const stored = sessionStorage.getItem('apiKeys');
    if (stored) {
        storedKeys = JSON.parse(stored);
        if (storedKeys.cohere) {
            cohereKeyInput.value = storedKeys.cohere;
            cohereKeyInput.type = 'password';
        }
        if (storedKeys.tavily) {
            tavilyKeyInput.value = storedKeys.tavily;
            tavilyKeyInput.type = 'password';
        }
    }
}

function setupToggleVisibility() {
    const toggles = document.querySelectorAll('.toggle-visibility');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const target = toggle.getAttribute('data-target');
            const input = document.getElementById(target);
            const keyType = target === 'cohere-key' ? 'cohere' : 'tavily';
            togglePasswordVisibility(input, toggle, keyType);
        });
    });
}

function togglePasswordVisibility(input, button, keyType) {
    keysVisible[keyType] = !keysVisible[keyType];
    
    if (keysVisible[keyType]) {
        input.type = 'text';
        button.textContent = 'Hide';
    } else {
        input.type = 'password';
        button.textContent = 'View';
    }
}

setKeysBtn.addEventListener('click', async () => {
    const cohereKey = cohereKeyInput.value.trim();
    const tavilyKey = tavilyKeyInput.value.trim();

    if (!cohereKey || !tavilyKey) {
        showMessage(keysMessage, 'Please enter both API keys', 'error');
        return;
    }

    try {
        const response = await fetch('/api/keys/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cohere_api_key: cohereKey,
                tavily_api_key: tavilyKey
            })
        });

        if (response.ok) {
            storedKeys.cohere = cohereKey;
            storedKeys.tavily = tavilyKey;
            sessionStorage.setItem('apiKeys', JSON.stringify(storedKeys));
            
            showMessage(keysMessage, 'API keys saved successfully', 'success');
            
            setTimeout(() => {
                cohereKeyInput.value = cohereKey;
                tavilyKeyInput.value = tavilyKey;
                cohereKeyInput.type = 'password';
                tavilyKeyInput.type = 'password';
                keysVisible.cohere = false;
                keysVisible.tavily = false;
            }, 1000);
        } else {
            showMessage(keysMessage, 'Failed to set API keys', 'error');
        }
    } catch (error) {
        showMessage(keysMessage, 'Error: ' + error.message, 'error');
    }
});

generateBtn.addEventListener('click', async () => {
    const companyName = companyNameInput.value.trim();
    const companyLink = companyLinkInput.value.trim();

    if (!companyName) {
        showMessage(errorMessage, 'Please enter a company name', 'error');
        return;
    }

    loadingDiv.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    reportSection.classList.remove('hidden');
    reportContent.innerHTML = '';
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
        const response = await fetch('/api/report/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_name: companyName,
                company_link: companyLink || null
            })
        });

        if (response.ok) {
            loadingDiv.classList.add('hidden');
            
            const data = await response.json();
            currentReportData = data;
            currentCompanyName = data.company_name;
            
            const capitalizedName = capitalizeFirstLetter(data.company_name);
            document.getElementById('report-title').textContent = capitalizedName + ' Research Report';
            
            const markdown = jsonToMarkdown(data.report);
            const html = markdownToHtml(markdown);
            
            streamContent(html);
            
        } else {
            const error = await response.json();
            showMessage(errorMessage, 'Error: ' + error.detail, 'error');
            loadingDiv.classList.add('hidden');
        }
    } catch (error) {
        showMessage(errorMessage, 'Error: ' + error.message, 'error');
        loadingDiv.classList.add('hidden');
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Start Research';
    }
});

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function streamContent(html) {
    reportContent.innerHTML = '';
    let index = 0;
    
    function typeNextCharacter() {
        if (index < html.length) {
            reportContent.innerHTML = html.substring(0, index + 1);
            index++;
            
            setTimeout(typeNextCharacter, 5);
            
            reportContent.scrollTop = reportContent.scrollHeight;
        } else {
            setTimeout(() => {
                reportSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }
    
    typeNextCharacter();
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function jsonToMarkdown(reportData) {
    let md = `# ${reportData.company_name} - Comprehensive Research Report\n\n`;
    
    md += `**Report Generated:** ${new Date().toLocaleDateString()}\n\n`;
    md += `---\n\n`;
    
    md += `## Executive Summary\n\n`;
    md += `${reportData.overview.business_description}\n\n`;
    
    md += `---\n\n`;
    
    md += `## Company Profile\n\n`;
    
    md += `### Overview\n`;
    md += `${reportData.overview.business_description}\n\n`;
    
    md += `### Core Products & Services\n`;
    md += `The company offers a comprehensive portfolio of products and services:\n\n`;
    reportData.overview.core_products_and_services.forEach((p, idx) => {
        md += `${idx + 1}. **${p}** - Advanced solution tailored for market demands\n`;
    });
    md += `\n`;
    
    md += `### Leadership & Management\n`;
    md += `The organization is led by experienced executives with proven track records:\n\n`;
    reportData.overview.leadership_team.forEach(l => {
        md += `- **${l.name}** | Position: ${l.role}\n`;
    });
    md += `\n`;
    
    md += `### Target Market & Customer Base\n`;
    md += `${reportData.overview.target_market || 'Global market'}\n\n`;
    
    md += `### Competitive Positioning\n`;
    md += `The organization maintains several key competitive advantages:\n\n`;
    reportData.overview.competitive_advantages.forEach((ca, idx) => {
        md += `${idx + 1}. **${ca.point}** - Strategic differentiator in the marketplace\n`;
    });
    md += `\n`;
    
    md += `### Business Model\n`;
    md += `${reportData.overview.business_model || 'Subscription and service-based model'}\n\n`;
    
    if (reportData.overview.funding_and_investment) {
        md += `### Funding & Investment\n`;
        md += `${reportData.overview.funding_and_investment}\n\n`;
    }
    
    md += `---\n\n`;
    
    md += `## Industry Analysis\n\n`;
    
    md += `### Market Landscape & Opportunities\n`;
    md += `${reportData.industry.market_landscape}\n\n`;
    md += `The market presents significant growth opportunities driven by digital transformation, increasing consumer demand, and technological innovation.\n\n`;
    
    md += `### Competitive Environment\n`;
    md += `**Key Competitors:**\n`;
    reportData.industry.competition.forEach((c, idx) => {
        md += `${idx + 1}. ${c}\n`;
    });
    md += `\n`;
    md += `Each competitor brings unique strengths to the market, creating a dynamic competitive landscape that drives innovation and market evolution.\n\n`;
    
    md += `### Market Challenges & Risks\n`;
    md += `${reportData.industry.market_challenges || 'Market faces several competitive and regulatory challenges'}\n\n`;
    md += `The organization must navigate these challenges through strategic innovation, operational excellence, and adaptive market strategies.\n\n`;
    
    md += `---\n\n`;
    
    md += `## Financial Performance & Metrics\n\n`;
    
    md += `### Revenue Model\n`;
    md += `**Primary Revenue Streams:**\n\n${reportData.financials.revenue_model}\n\n`;
    md += `The diversified revenue model ensures financial stability and sustainable growth across market cycles.\n\n`;
    
    if (reportData.financials.revenue_2024) {
        md += `### Financial Highlights - 2024\n`;
        md += `- **Revenue 2024:** ${reportData.financials.revenue_2024}\n`;
        if (reportData.financials.growth_rate) {
            md += `- **Growth Rate:** ${reportData.financials.growth_rate}\n`;
        }
        if (reportData.financials.net_income_change) {
            md += `- **Net Income Change:** ${reportData.financials.net_income_change}\n`;
        }
        md += `\n`;
    }
    
    md += `### Key Performance Indicators\n`;
    if (reportData.financials.key_metrics && reportData.financials.key_metrics.length > 0) {
        reportData.financials.key_metrics.forEach((m, idx) => {
            md += `${idx + 1}. ${m}\n`;
        });
        md += `\n`;
    }
    
    md += `These metrics demonstrate the organization's operational efficiency, market penetration, and financial health.\n\n`;
    
    md += `---\n\n`;
    
    md += `## Recent Developments & News\n\n`;
    md += `### Latest Announcements\n`;
    reportData.news.news_items.forEach((n, idx) => {
        md += `\n#### ${idx + 1}. ${n.title}\n`;
        if (n.date) md += `**Date:** ${n.date}\n`;
        if (n.summary) md += `${n.summary}\n`;
    });
    md += `\n`;
    
    md += `---\n\n`;
    
    md += `## Research Sources & References\n\n`;
    md += `This comprehensive report was compiled from the following authoritative sources:\n\n`;
    reportData.references.references.forEach((r, idx) => {
        md += `${idx + 1}. [${r.source_name}](${r.url})\n`;
    });
    md += `\n`;
    
    md += `---\n\n`;
    
    md += `## Conclusion\n\n`;
    md += `${reportData.company_name} stands as a significant player in its industry, demonstrating strong competitive positioning, diverse revenue streams, and strategic market presence. The organization's focus on innovation, customer-centric solutions, and operational excellence positions it favorably for continued growth and market leadership.\n\n`;
    
    md += `**Report Disclaimer:** This report is based on publicly available information and research conducted at the time of generation. Market conditions and company circumstances are subject to rapid change.\n\n`;
    
    return md;
}

function markdownToHtml(markdown) {
    let html = markdown;
    
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\n<ul>/g, '');
    
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-3]>)/g, '$1');
    html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    
    return html;
}

function displayReport(reportData) {
    const markdown = jsonToMarkdown(reportData);
    const html = markdownToHtml(markdown);
    reportContent.innerHTML = html;
    
    setTimeout(() => {
        reportSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message-box ' + type;
    element.classList.remove('hidden');
}

companyNameInput.addEventListener('focus', () => {
    errorMessage.classList.add('hidden');
});