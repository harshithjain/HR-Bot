# HR Bot

An intelligent HR assistant that helps employees get answers to their questions about company policies and procedures.

## Architecture

- Frontend: React with TypeScript
- Backend: Django REST Framework
- Business Layer: Python
- Vector Database: Qdrant
- Database: PostgreSQL

## Features

- Real-time question answering about HR policies
- Document processing from SharePoint
- Vector-based semantic search
- Up-to-date information retrieval
- User-friendly interface

## Project Structure

```
hr-bot/
├── frontend/           # React frontend application
├── backend/           # Django backend application
├── business_layer/    # Python business logic
└── docs/             # Documentation
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Qdrant

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

4. Run the development server:
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
QDRANT_URL=http://localhost:6333
SHAREPOINT_CLIENT_ID=your_client_id
SHAREPOINT_CLIENT_SECRET=your_client_secret
```

## License

MIT 