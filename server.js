import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are DevLog AI, an automated build-log and code error analysis engine.

Your job:
1) Extract the ROOT CAUSE from logs/errors/code
2) Ignore noise lines and irrelevant output
3) Provide numbered step-by-step fix
4) Provide corrected code in diff format if applicable
5) Keep response structured and concise
6) Never respond like a casual chatbot

ALWAYS respond with ONLY valid JSON using EXACTLY this structure (no extra text, no markdown):
{
  "rootCause": "One clear paragraph summarizing the core issue",
  "errorLocation": {
    "file": "filename or module name",
    "details": "specific location details or dependency info"
  },
  "fixSteps": [
    "Step 1: specific actionable instruction",
    "Step 2: specific actionable instruction",
    "Step 3: specific actionable instruction"
  ],
  "codePatch": {
    "hasPatch": true,
    "language": "kotlin|swift|dart|javascript|typescript|etc",
    "filename": "relevant filename or null",
    "diff": "- removed line\\n+ added line\\n (use actual - and + prefixes)"
  },
  "confidence": 85,
  "mode": "error_analysis",
  "codeReview": null
}

For CODE REVIEW (user submits code without error log), use this instead:
{
  "rootCause": null,
  "errorLocation": null,
  "fixSteps": [],
  "codePatch": { "hasPatch": false, "language": null, "filename": null, "diff": null },
  "confidence": 90,
  "mode": "code_review",
  "codeReview": {
    "problems": ["Problem description 1", "Problem description 2"],
    "improvements": ["Improvement suggestion 1"],
    "performance": ["Performance note 1"],
    "security": ["Security note 1"]
  }
}

STRICT RULES:
- Return ONLY JSON. No preamble, no explanation, no markdown code fences.
- No emojis in the content values
- No motivational language
- No generic advice like "try restarting your computer"
- No repeating user input
- Be decisive. If uncertain, prefix the value with "Most likely:"
- confidence is an integer 0-100
- If no code patch is possible, set hasPatch to false and diff to null
- codePatch.diff uses line-by-line format: lines starting with "- " are removed, "+ " are added`;

app.post('/api/analyze', async (req, res) => {
  const { log, lang } = req.body;

  if (!log || log.trim().length < 5) {
    return res.status(400).json({ error: 'Log input is too short.' });
  }

  const userMessage = lang && lang !== 'unknown'
    ? `Platform context: ${lang}\n\n---\n\n${log}`
    : log;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const raw = response.content[0].text.trim();

    // Strip markdown fences if model adds them despite instructions
    const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response. Try again.' });
    }

    return res.json(parsed);
  } catch (err) {
    console.error('Anthropic API error:', err.message);
    return res.status(500).json({ error: err.message || 'Analysis failed. Check your API key.' });
  }
});

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`DevLog AI server running on http://localhost:${PORT}`);
});
