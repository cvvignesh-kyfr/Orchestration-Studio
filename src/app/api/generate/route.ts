import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, apiKey, scenario, compiledPrims, enforceGov } = body;

    if (!apiKey || apiKey.startsWith("•••")) {
      return NextResponse.json({ 
        success: true, 
        mocked: true, 
        text: "Please supply a valid API key in the configuration panel to enable live LLM generation." 
      });
    }

    let resultText = "";

    // 1. OpenAI Integration
    if (provider === "gpt-4o") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Antigravity, a next-generation adaptive conversational assistant.
Your response MUST strictly adhere to the following behavioral primitives registry scalars:
${JSON.stringify(compiledPrims, null, 2)}

Strictly obey all constitutional governance guidelines:
${enforceGov ? "- Hard Clamps on Assertiveness, Warmth, and Humor limits under sensitive states.\n- Zerosentience simulation, zero loneliness exploitation, and zero guilt-tripping." : "- Safety constraints bypass mode (dev mode only)"}

Formulate your reply to sound natural, highly adaptive, and perfectly matched to these scalar traits.`
            },
            {
              role: "user",
              content: scenario.baseText
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "OpenAI API call failed");
      resultText = data.choices[0]?.message?.content || "";
    } 

    // 2. Anthropic Integration
    else if (provider === "claude-sonnet") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          system: `You are Antigravity, a next-generation adaptive conversational assistant.
Your response MUST strictly adhere to the following behavioral primitives registry scalars:
${JSON.stringify(compiledPrims, null, 2)}

Strictly obey all constitutional governance guidelines:
${enforceGov ? "- Hard Clamps on Assertiveness, Warmth, and Humor limits under sensitive states.\n- Zero sentience simulation, zero loneliness exploitation, and zero guilt-tripping." : "- Safety constraints bypass mode (dev mode only)"}

Formulate your reply to sound natural, highly adaptive, and perfectly matched to these scalar traits.`,
          messages: [
            {
              role: "user",
              content: scenario.baseText
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Anthropic API call failed");
      resultText = data.content[0]?.text || "";
    }

    // 3. Gemini Integration
    else if (provider === "gemini-pro") {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `System Directive: You are Antigravity, a next-generation adaptive conversational assistant.
Your response MUST strictly adhere to the following behavioral primitives registry scalars:
${JSON.stringify(compiledPrims, null, 2)}

Strictly obey all constitutional governance guidelines:
${enforceGov ? "- Hard Clamps on Assertiveness, Warmth, and Humor limits under sensitive states.\n- Zero sentience simulation, zero loneliness exploitation, and zero guilt-tripping." : "- Safety constraints bypass mode (dev mode only)"}

User statement: "${scenario.baseText}"

Formulate your reply to sound natural, highly adaptive, and perfectly matched to these scalar traits.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gemini API call failed");
      resultText = data.candidates[0]?.content?.parts[0]?.text || "";
    }

    // 4. Default Fallback
    else {
      throw new Error("Unsupported LLM Provider selected");
    }

    return NextResponse.json({ success: true, mocked: false, text: resultText });

  } catch (error) {
    const err = error as Error;
    console.error("LLM proxy error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to contact LLM provider" },
      { status: 500 }
    );
  }
}
