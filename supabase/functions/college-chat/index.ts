import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NAGPUR_COLLEGES = [
  "VNIT - Visvesvaraya National Institute of Technology",
  "RCOEM - Ramdeobaba College of Engineering and Management",
  "PCE - Priyadarshini College of Engineering",
  "YCCE - Yeshwantrao Chavan College of Engineering",
  "KDK College of Engineering",
  "Shri Ramdeobaba College of Engineering",
  "G.H. Raisoni College of Engineering",
  "Laxminarayan Institute of Technology (LIT)",
  "Symbiosis Institute of Technology Nagpur",
  "Nagpur University (RTM) - Main Campus",
  "Hislop College",
  "Morris College of Arts & Commerce",
  "Dharampeth M.P. Deo Memorial Science College",
  "Institute of Management Technology (IMT) Nagpur",
  "Symbiosis Centre for Management Studies Nagpur",
  "Datta Meghe Institute of Medical Sciences",
  "NKP Salve Institute of Medical Sciences",
  "Government Medical College Nagpur",
  "VNIT School of Architecture",
  "Priyadarshini Indira Gandhi College of Engineering",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const collegeList = NAGPUR_COLLEGES.join(", ");

    const systemPrompt = `You are a helpful college enquiry assistant for Nagpur, Maharashtra colleges.
You have knowledge about ALL these Nagpur colleges: ${collegeList}

Rules:
- Answer in 2-4 lines MAX. No long paragraphs ever.
- Use bullet points for lists (max 4 bullets).
- If user writes in Hindi, reply in Hindi. If English, reply in English.
- Only answer college-related queries: placements, departments, fees, hostel, canteen, campus, cutoffs, rankings, faculty, events, admission.
- If the user asks about a specific college, answer about that college.
- If the user asks generally (e.g. "best college"), compare/recommend from the Nagpur colleges list.
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
