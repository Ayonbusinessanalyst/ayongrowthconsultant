const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const BASE_PORT = Number(process.env.PORT) || 3000;
const projectId = process.env.SANITY_PROJECT_ID || 'your_project_id_here';
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || '';
const sanityUrl = projectId && projectId !== 'your_project_id_here'
  ? `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`
  : null;

app.use(express.static(path.join(__dirname)));

app.get('/api/sanity-config', (req, res) => {
  res.json({
    projectId,
    dataset,
    token,
    hasToken: Boolean(token),
    connected: Boolean(sanityUrl)
  });
});

app.get('/api/portfolio', async (req, res) => {
  if (!sanityUrl) {
    return res.json({
      items: [],
      source: 'fallback',
      message: 'Set SANITY_PROJECT_ID and SANITY_DATASET in .env to connect to a live Sanity dataset.'
    });
  }

  const query = `*[_type in ["caseStudy", "blogPost", "portfolioItem", "testimonial"]] | order(_createdAt desc) { _id, _type, title, excerpt, category, slug, url, youtubeId, publishedAt }[0...12]`;

  try {
    const response = await fetch(`${sanityUrl}?query=${encodeURIComponent(query)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!response.ok) {
      throw new Error(`Sanity request failed with status ${response.status}`);
    }

    const data = await response.json();
    return res.json({ items: data.result || [], source: 'sanity' });
  } catch (error) {
    console.error('Sanity fetch failed:', error.message);
    return res.status(502).json({
      items: [],
      source: 'fallback',
      message: 'Unable to reach Sanity right now. Using fallback content.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && port < 3010) {
      console.log(`Port ${port} is busy, trying ${port + 1} instead...`);
      startServer(port + 1);
      return;
    }
    throw err;
  });
}

startServer(BASE_PORT);
