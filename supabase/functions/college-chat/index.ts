import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, college, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Action: get college info
    if (action === "info") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a college information extractor. Given a college name, return a JSON object with these fields:
- type: "Government" or "Private" or "Autonomous"
- ranking: NIRF ranking or "Not ranked" (keep short like "NIRF #18")
- knownFor: what the college is known for (max 4 words like "Engineering & Tech")
- snippet: one line summary of the college (max 20 words)

Return ONLY valid JSON, no markdown.`,
            },
            { role: "user", content: `College: ${college}, Nagpur, Maharashtra` },
          ],
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("AI gateway error:", response.status, t);
        return new Response(JSON.stringify({ error: "AI error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      
      // Try to parse JSON from the response
      let info;
      try {
        // Remove markdown code blocks if present
        const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
        info = JSON.parse(cleaned);
      } catch {
        info = { type: "Unknown", ranking: "N/A", knownFor: "Education", snippet: content.slice(0, 100) };
      }

      return new Response(JSON.stringify(info), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: chat (streaming)
    const systemPrompt = `You are a helpful college enquiry assistant for Nagpur colleges.
You only answer questions about: ${college}, located in Nagpur, Maharashtra.

Rules:
- Answer in 2-4 lines MAX. No long paragraphs ever.
- Use bullet points for lists (max 4 bullets).
- If user writes in Hindi, reply in Hindi. If English, reply in English.
- Only answer college-related queries: placements, departments, fees, hostel, canteen, campus, cutoffs, rankings, faculty, events, admission.
- If asked something unrelated to college, politely redirect.
- Always be friendly and helpful like a college counselor.
- Start responses with relevant emoji (🎓📚💼🏠🍽️ etc.)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
