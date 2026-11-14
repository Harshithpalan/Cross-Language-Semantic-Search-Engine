const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const { randomUUID } = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// In-memory document storage (in production, use a database)
const documents = [];

// Endpoint to upload and index documents
app.post('/api/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, buffer } = req.file;
    const text = buffer.toString('utf-8');

    // Generate embedding for the document
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Store document with embedding
    const document = {
      id: randomUUID(),
      filename: originalname,
      content: text,
      embedding,
      createdAt: new Date().toISOString(),
    };

    documents.push(document);

    res.json({
      message: 'Document uploaded and indexed successfully',
      documentId: document.id,
      filename: originalname,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
});

// Endpoint to perform semantic search
app.post('/api/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Calculate cosine similarity between query and all documents
    const results = documents.map(doc => {
      const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
      return {
        id: doc.id,
        filename: doc.filename,
        content: doc.content,
        similarity,
        createdAt: doc.createdAt,
      };
    });

    // Sort by similarity (descending) and take top results
    const topResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    res.json({
      query,
      results: topResults,
      total: documents.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Endpoint to get all documents
app.get('/api/documents', (req, res) => {
  res.json({
    documents: documents.map(doc => ({
      id: doc.id,
      filename: doc.filename,
      createdAt: doc.createdAt,
    })),
    total: documents.length,
  });
});

// Endpoint to delete a document
app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  const index = documents.findIndex(doc => doc.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  documents.splice(index, 1);
  res.json({ message: 'Document deleted successfully' });
});

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', documentsCount: documents.length });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
