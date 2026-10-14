export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const response = await fetch('https://server.plusuidesign.com/marketing/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body), signal: AbortSignal.timeout(15000),
    });
    return res.status(response.status).json(await response.json());
  } catch { return res.status(503).json({ error: 'Unable to submit. Please try again.' }); }
}
