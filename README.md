[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![CrewAI](https://img.shields.io/badge/CrewAI-Latest-purple.svg)](https://github.com/joaomdmoura/crewai)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](LICENSE)


# Company Report Generator 🔍

![Web UI](src/assets/UI/web-ui.jpg)

## Overview

**Company Report Generator** is an AI-powered application that generates comprehensive, professional company research reports using multi-agent systems. The system leverages CrewAI, Cohere LLM, and Tavily Search API to automate the research, analysis, and report generation process.

## Demo

Watch the application in action:

https://github.com/user-attachments/assets/eebc3684-c03d-40a0-b17f-f5200f78aab7

**Demo Features:**
- Real-time API key configuration
- Live company research process
- Streaming report generation
- Professional markdown display

## Features

  **`Intelligent Multi-Agent System`**
  - Research Agent: Gathers and extracts company information
  - Analysis Agent: Structures and organizes data
  - Writer Agent: Generates professional reports

  **Real-Time Web Search**
  - Parallel search queries for comprehensive data collection
  - Automatic source extraction and citation

**Professional Report Generation**
  - Structured JSON output with Pydantic validation
  - Beautiful Markdown rendering with streaming display
  - Executive summaries and detailed analysis

  **Organized Asset Management**
  - Unique project directories with random suffixes
  - Separate JSON files for each agent output
  - Automatic metadata tracking

  **User-Friendly Interface**
  - Web-based dashboard with modern UI
  - Real-time streaming report display
  - API key configuration with visibility toggle

## API Keys Required

#### Cohere & Tavily
- Get your API key from [Cohere Dashboard](https://dashboard.cohere.com/api-keys)
- Get your API key from [Tavily App](https://app.tavily.com)


## Tech Stack

### Backend
- **Framework:** FastAPI
- **LLM:** Cohere (command-a-03-2025)
- **Multi-Agent:** CrewAI
- **Search:** Tavily API
- **Data Validation:** Pydantic
  
### Frontend
- **HTML/CSS/JavaScript** (Vanilla, no frameworks)
- **Responsive Design** with modern UI
- **Real-time Streaming Animation**

## Installation

### Prerequisites
- Python 3.12+
- pip or uv package manager - prefer using uv

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/ahmdeltoky/company-report-generator.git
cd company-report-generator
```

2. **Install uv package manager**
```bash
pip install uv
```

3. **Create virtual environment with uv**
```bash
uv venv
source .venv/bin/activate - if you use ubuntu 
```

4. **Sync dependencies with uv**
```bash
uv sync
```

5. **Create .env file**
```bash
cp .env.example .env
```


Edit `.env` and add your API keys:
```
COHERE_API_KEY=your_cohere_api_key
TAVILY_API_KEY=your_tavily_api_key
```

6. **Run the application**
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The application will be available at `http://localhost:8000`

**Or with uv:**
```bash
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## Usage

### Web Interface

1. Open `http://localhost:8000` in your browser
2. Configure API keys:
   - Paste your Cohere API key
   - Paste your Tavily API key
   - Click "Configure API Keys"
3. Enter company details:
   - Company Name (required)
   - Company URL (optional)
4. Click "Start Research"
5. View the generated report with streaming animation

### API Endpoints

#### Set API Keys
```bash
POST /api/keys/set
Content-Type: application/json

{
  "cohere_api_key": "your_key_here",
  "tavily_api_key": "your_key_here"
}
```

#### Generate Report
```bash
POST /api/report/generate
Content-Type: application/json

{
  "company_name": "Meta",
  "company_link": "www.meta.com"
}
```

Response:
```json
{
  "company_name": "Meta",
  "report": {
    "company_name": "Meta",
    "overview": {...},
    "industry": {...},
    "financials": {...},
    "news": {...},
    "references": {...}
  }
}
```

#### Health Check
```bash
GET /api/health
```

## Project Structure

```
company-report-generator/
├── src/
│   ├── agents/
│   │   ├── research_agent.py      # Research data extraction
│   │   ├── analysis_agent.py      # Data structure organization
│   │   ├── writer_agent.py        # Report generation
│   │   └── crew.py                # Multi-agent orchestration
│   ├── services/
│   │   ├── report_generator.py    # Report generation orchestration
│   │   ├── report_formatter.py    # Report formatting
│   │   └── tavily_service.py      # Web search service
│   ├── models/
│   │   └── schemas.py             # Pydantic data models
│   ├── routes/
│   │   ├── base.py                # Base routes
│   │   ├── keys.py                # API key management
│   │   └── reports.py             # Report generation routes
│   ├── assets/                    # Generated reports
│   ├── config.py                  # Configuration settings
│   └── main.py                    # FastAPI application
├── static/
│   ├── css/style.css              # Styling
│   └── js/script.js               # Frontend logic
├── templates/
│   └── index.html                 # Web interface
├── demo/
│   └── demo.mp4                   # Demo video
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
└── README.md                      # This file
```

## Output Structure

Generated reports are organized in `src/assets/`:

```
src/assets/
├── company_name_random_suffix/
│   ├── research.json
│   ├── analysis.json
│   └── writer.json
```

Each JSON file contains structured data from the respective agent.

## Report Schema

The generated reports follow this structure:

```json
{
  "company_name": "Company Name",
  "overview": {
    "business_description": "...",
    "core_products_and_services": [...],
    "leadership_team": [{"name": "...", "role": "..."}],
    "target_market": "...",
    "competitive_advantages": [{"point": "..."}],
    "business_model": "...",
    "funding_and_investment": "..."
  },
  "industry": {
    "market_landscape": "...",
    "competition": [...],
    "market_challenges": "..."
  },
  "financials": {
    "revenue_model": "...",
    "revenue_2024": "...",
    "growth_rate": "...",
    "key_metrics": [...]
  },
  "news": {
    "news_items": [{"title": "...", "date": "...", "summary": "..."}]
  },
  "references": {
    "references": [{"source_name": "...", "url": "..."}]
  }
}
```


## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CrewAI](https://github.com/joaomdmoura/crewai) - Multi-agent orchestration
- [FastAPI](https://fastapi.tiangolo.com/) - backend
- [Cohere](https://cohere.ai/) - LLM Providers
- [Tavily](https://tavily.com/) - Web search API
- [Pydantic](https://docs.pydantic.dev/) - Data validation & Structuring Output



**Author:** [Ahmad Deltoky](https://github.com/ahmdeltoky)
**Email:** ahmdeltoky4@gmail.com
