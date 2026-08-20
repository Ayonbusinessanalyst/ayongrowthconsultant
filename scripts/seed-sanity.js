require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token || projectId === 'your_project_id_here') {
  console.error('Missing SANITY_PROJECT_ID or SANITY_API_TOKEN in .env');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false
});

const docs = [
  {
    _type: 'blogPost',
    title: 'The Meta Ads Strategy That Actually Works in 2026',
    slug: { _type: 'slug', current: 'meta-ads-strategy-2026' },
    excerpt: 'Stop wasting money on outdated tactics. Here is the modern approach to Meta Ads that algorithm favors today.',
    category: 'blog',
    publishedAt: new Date().toISOString(),
    url: '/blogs/meta-ads-strategy.html'
  },
  {
    _type: 'caseStudy',
    title: 'How I Scaled an E-commerce Brand to 4x ROAS',
    slug: { _type: 'slug', current: 'ecommerce-scale-4x-roas' },
    excerpt: 'A deep dive into the exact funnel, ad creatives, and targeting strategy used to quadruple return on ad spend.',
    category: 'case-study',
    publishedAt: new Date().toISOString(),
    url: '/case-studies/ecommerce-4x-roas.html'
  },
  {
    _type: 'portfolioItem',
    title: 'Full Funnel Marketing Breakdown',
    slug: { _type: 'slug', current: 'full-funnel-marketing-breakdown' },
    excerpt: 'Watch over my shoulder as I build a complete conversion funnel from scratch in this masterclass.',
    category: 'video',
    youtubeId: 'dQw4w9WgXcQ',
    publishedAt: new Date().toISOString(),
    url: '#'
  }
];

(async () => {
  try {
    const created = await Promise.all(
      docs.map((doc) => client.create(doc))
    );
    console.log('Inserted Sanity docs:', created.length);
    created.forEach((doc) => console.log(doc._id, doc.title));
  } catch (error) {
    console.error('Sanity seed failed:', error.message);
    process.exit(1);
  }
})();
