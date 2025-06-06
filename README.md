# BxA Knowledge Base

An intelligent HR assistant that helps employees get answers to their questions about company policies and procedures.

## Architecture

- Frontend: React with TypeScript
- Backend: Django REST Framework
- Business Layer: Python
- Vector Database: FAISS (Facebook AI Similarity Search)
- Database: PostgreSQL
- LLM Integration: OpenAI

## Features

- Real-time question answering about HR policies
- Document processing and vectorization
- Vector-based semantic search using FAISS
- Up-to-date information retrieval
- User-friendly interface
- Secure document storage and retrieval

## Project Structure

```
hr-bot/
├── frontend/           # React frontend application
├── backend/           # Django backend application
│   ├── hrbot/        # Main Django application
│   │   ├── core/     # Core business logic
│   │   └── api/      # API endpoints
│   └── faiss_index/  # Vector store for document embeddings
└── docs/             # Documentation
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- OpenAI API key

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up the database:
```bash
python manage.py migrate
```

4. Create a `.env` file in the backend directory with required environment variables (see below)

5. Run the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/hrbot
OPENAI_API_KEY=your_openai_api_key
```

## Document Processing

The system uses FAISS for efficient similarity search of document embeddings. Documents are:
1. Split into chunks using RecursiveCharacterTextSplitter
2. Converted to embeddings using OpenAI's text-embedding-ada-002 model
3. Stored in a FAISS index for fast similarity search
4. Retrieved based on semantic similarity to user queries

## License

MIT 