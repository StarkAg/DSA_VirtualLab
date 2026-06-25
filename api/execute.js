// Vercel serverless endpoint: POST { language, source, stdin } → normalized result.
// Uses the free Piston API by default, or your self-hosted Judge0 if JUDGE0_URL is set.
import { runExecution } from './_exec.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { language, source, stdin } = req.body || {};
    const out = await runExecution({ language, source, stdin });
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
