import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Fortune Interpretation & Question Consultation Endpoint (Phase 4 from PRD)
  app.post("/api/fortune/ai-consult", async (req, res) => {
    try {
      const { nickname, birthDate, gender, overallScore, scores, userQuestion, fortuneSummary } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        // Return a thoughtful fallback if API key is not configured
        return res.json({
          success: true,
          consultation: `${nickname ? nickname + "님" : "당신"}의 오늘 기운(${overallScore}점)에 따르면, 차분하고 긍정적인 마음으로 임하시면 생각지 못한 좋은 흐름이 함께할 것입니다. 중요한 결정을 내릴 때는 주변 사람들의 조언을 경청해보세요.`,
          source: "offline_fallback",
        });
      }

      const prompt = `당신은 따뜻하고 신뢰감 있는 데일리 라이프스타일 운세 카운슬러입니다.
사용자 정보:
- 닉네임: ${nickname || "사용자"}
- 생년월일: ${birthDate || "미입력"}
- 성별: ${gender || "미선택"}
- 오늘의 종합 운세 점수: ${overallScore}점
- 분야별 점수: 연애운 ${scores?.love ?? 80}점, 금전운 ${scores?.money ?? 75}점, 직장/학업운 ${scores?.work ?? 85}점, 건강운 ${scores?.health ?? 80}점
- 오늘의 기본 운세 요약: "${fortuneSummary || '새로운 기회가 찾아오는 날'}"
${userQuestion ? `- 사용자의 고민/질문: "${userQuestion}"` : "오늘의 운세에 대한 심층 조언을 요청했습니다."}

지침:
1. 지나치게 미신적이거나 공포감을 주는 표현은 금지합니다.
2. 따뜻하고 실천 가능한 실질적 행동 팁(~해보는 것도 좋아요, ~할 가능성이 커요)을 3~4문장으로 친절하게 한국어로 작성해주세요.
3. 점수와 질문 내용의 맥락을 자연스럽게 반영하여 맞춤형으로 이야기해주세요.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      const text = response.text || "오늘 하루도 당신의 빛나는 여정을 응원합니다.";
      res.json({
        success: true,
        consultation: text.trim(),
        source: "gemini",
      });
    } catch (error: any) {
      console.error("AI consult error:", error);
      res.status(500).json({
        success: false,
        error: "운세 풀이 중 일시적인 오류가 발생했습니다.",
        fallbackMessage: "차분하고 긍정적인 마음으로 오늘을 시작해보세요.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Daily Fortune Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
