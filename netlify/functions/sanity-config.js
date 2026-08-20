exports.handler = async () => {
  const projectId = process.env.SANITY_PROJECT_ID || 'your_project_id_here';
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN || '';

  return {
    statusCode: 200,
    body: JSON.stringify({
      projectId,
      dataset,
      token,
      hasToken: Boolean(token),
      connected: !!(projectId && projectId !== 'your_project_id_here')
    })
  };
};
