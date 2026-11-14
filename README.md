# Cross-Language Semantic Search Engine

A full-stack web application that enables semantic search across documents in multiple languages using OpenAI embeddings.

## Features

- **Document Upload**: Upload text documents (.txt, .md, .json, .csv) for indexing
- **Semantic Search**: Search documents using natural language queries in any language
- **Cross-Language Support**: Find relevant content even when the query and documents are in different languages
- **Similarity Scoring**: Results ranked by semantic similarity with match percentage
- **Document Management**: View and delete uploaded documents

## Tech Stack

### Frontend
- React 18
- Axios for API calls
- CSS Grid for responsive layout

### Backend
- Node.js with Express
- OpenAI API for embeddings (text-embedding-3-small model)
- Multer for file uploads
- In-memory document storage (can be upgraded to a database)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
PORT=5000
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will open on `http://localhost:3000`

## Usage

1. **Upload Documents**:
   - Click "Choose File" to select a text document
   - Click "Upload" to index the document
   - The document will be processed and stored with its semantic embedding

2. **Search**:
   - Enter a search query in any language
   - Click "Search" to find semantically similar documents
   - Results are ranked by similarity score (percentage match)

3. **Manage Documents**:
   - View all uploaded documents in the sidebar
   - Delete documents you no longer need

## API Endpoints

### POST /api/upload
Upload and index a document
- Body: multipart/form-data with 'document' field
- Response: { message, documentId, filename }

### POST /api/search
Perform semantic search
- Body: { query, limit }
- Response: { query, results, total }

### GET /api/documents
Get all uploaded documents
- Response: { documents, total }

### DELETE /api/documents/:id
Delete a document
- Response: { message }

### GET /api/health
Health check endpoint
- Response: { status, documentsCount }

## How It Works

1. **Document Processing**:
   - When a document is uploaded, it's converted to text
   - OpenAI's text-embedding-3-small model generates a vector embedding
   - The embedding represents the semantic meaning of the content

2. **Search Process**:
   - User query is converted to an embedding using the same model
   - Cosine similarity is calculated between query and all document embeddings
   - Results are ranked by similarity score

3. **Cross-Language Capability**:
   - OpenAI embeddings are trained on multilingual data
   - Semantic meaning is preserved across languages
   - A query in English can find content in Spanish, French, etc.

## Future Enhancements

- [ ] Add database persistence (PostgreSQL/MongoDB)
- [ ] Implement vector database (Pinecone, Weaviate)
- [ ] Add support for PDF and Word documents
- [ ] Implement user authentication
- [ ] Add document preview with highlighted matches
- [ ] Support for multiple embedding models
- [ ] Batch document upload
- [ ] Export search results

## License

MIT
