const { put, list, del } = require('@vercel/blob');

const BLOB_KEY = 'tastymap-data.json';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: BLOB_KEY });
      if (blobs.length === 0) {
        return res.status(200).json([]);
      }
      const response = await fetch(blobs[0].url);
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const data = req.body;
      await put(BLOB_KEY, JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false,
      });
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
