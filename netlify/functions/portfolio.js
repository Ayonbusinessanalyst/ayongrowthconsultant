exports.handler = async () => {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN || '';

  if (!projectId || projectId === 'your_project_id_here') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: [],
        source: 'fallback',
        message: 'Set SANITY_PROJECT_ID and SANITY_DATASET in Netlify environment variables.'
      })
    };
  }

  const query = `*[_type in ["caseStudy", "blogPost", "portfolioItem", "testimonial"]] | order(_createdAt desc) { _id, _type, title, excerpt, category, slug, url, youtubeId, publishedAt }[0...12]`;
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!response.ok) {
      throw new Error(`Sanity request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ items: data.result || [], source: 'sanity' })
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: JSON.stringify({
        items: [],
        source: 'fallback',
        message: 'Unable to reach Sanity right now. Using fallback content.'
      })
    };
  }
};
