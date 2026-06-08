export default async function handler(req, res) {
  // CORS - 모든 도메인 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // OPTIONS 프리플라이트
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  try {
    const { messages, model, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '잘못된 요청입니다.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25초 타임아웃

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-5',
        max_tokens: max_tokens || 1000,
        messages
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: '요청 시간이 초과됐습니다. 다시 시도해주세요.' });
    }
    return res.status(500).json({ error: '서버 오류: ' + err.message });
  }
}
