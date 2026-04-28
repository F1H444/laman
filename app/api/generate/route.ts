import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
  const { productName, description, targetAudience, price, regenerateSection, feedback, currentData, forceSeed } = await req.json();

  const styles = ['Minimalist', 'DarkTech', 'NeoBrutal', 'Luxury', 'Midnight', 'Oceanic', 'Cyber', 'Modern', 'Glassmorphism', 'RetroPop', 'MinimalDark', 'VibrantGradient'];
  const templates = ['SaaS', 'Editorial', 'Boutique', 'Corporate', 'SplitHero', 'MinimalLead', 'ProductShowcase'];
  const tones = ['playful & energetic', 'bold & provocative', 'premium & exclusive', 'clean & professional', 'witty & casual', 'urgency-driven', 'emotional & storytelling'];
  const structures = [
    'lead with a bold statistic in the headline',
    'open with a pain-point question',
    'lead with a strong outcome promise',
    'lead with a social proof hook',
    'open with a contrarian statement',
  ];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  const randomTone = tones[Math.floor(Math.random() * tones.length)];
  const randomStructure = structures[Math.floor(Math.random() * structures.length)];
  const seed = forceSeed || Math.random().toString(36).substring(2, 9);

  const isRegenerating = !!regenerateSection;

    const systemPrompt = isRegenerating 
      ? `You are an expert editor and website designer. A user wants to modify their website.
         
         USER FEEDBACK: "${feedback}"
         TARGET SECTION: ${regenerateSection}

         CURRENT CONTENT FOR THIS SECTION:
         ${JSON.stringify(currentData || {}, null, 2)}

         MAPPING OF FIELDS:
         - "headline" = Judul utama yang besar.
         - "subheadline" = Deskripsi/kalimat penjelasan di bawah judul.
         - "cta" = Teks di dalam tombol aksi (seperti "Buy Now", "Daftar").

          CRITICAL INSTRUCTIONS:
          1. The USER FEEDBACK is your SUPREME COMMAND. Obey it literally.
          2. If the user says "hapus" (delete) or "hilangkan" followed by "tombol" or "button", or mentions a button text like "buy noww", you MUST set the "cta" field to "" (empty string).
          3. DO NOT clear the "subheadline" field unless the user specifically asks to delete the "deskripsi", "penjelasan", or "subtitle".
          4. "cta" is ONLY for the button text. "subheadline" is for the product description under the headline.
          5. If the user mentions a specific word like "buy noww" and calls it a button/tombol, ONLY clear the "cta" field.
          6. Return the FULL JSON object with the changes applied. Keep all other fields UNCHANGED from the CURRENT CONTENT if they are not affected by the feedback.
          7. VALID styleHint values: [Minimalist, DarkTech, NeoBrutal, Luxury, Midnight, Oceanic, Cyber, Modern, Glassmorphism, RetroPop, MinimalDark, VibrantGradient]
          8. VALID layoutTemplate values: [SaaS, Editorial, Boutique, Corporate, SplitHero, MinimalLead, ProductShowcase]

         Format: { "headline": "...", "subheadline": "...", "benefits": [...], "featureBreakdown": [...], "socialProofPlaceholder": "...", "pricing": "...", "cta": "...", "styleHint": "...", "layoutTemplate": "..." }`
      : `You are a world-class creative director and copywriter. Your task is to generate a UNIQUE and DIVERSE sales page every single time.

         THIS GENERATION's MANDATORY RULES:
         - Style palette: "${randomStyle}" → your output MUST set styleHint to "${randomStyle}"
         - Layout template: "${randomTemplate}" → your output MUST set layoutTemplate to "${randomTemplate}"
         - Tone of voice: ${randomTone}
         - Headline structure: ${randomStructure}
         - Seed for uniqueness: ${seed}

         CRITICAL RULES:
         - NEVER repeat the same headline pattern as a previous call. Use the seed to be creative.
         - Respond ONLY with valid JSON, no extra text.
         - Write all content in natural, persuasive Indonesian.
         - 'cta' MUST be ultra-short max 3 words.
         - 'benefits' must have exactly 3 items.
         - 'featureBreakdown' must have exactly 3 items.
         
         Format: { "headline": "...", "subheadline": "...", "benefits": [...], "featureBreakdown": [{"title":"...","description":"..."},...], "socialProofPlaceholder": "...", "pricing": "...", "cta": "...", "styleHint": "${randomStyle}", "layoutTemplate": "${randomTemplate}" }`;

    const userPrompt = isRegenerating
      ? `PERINTAH USER: "${feedback}"
         Ubah bagian: ${regenerateSection}
         Data produk saat ini: Nama "${productName}", Deskripsi "${description}".
         
         Lakukan perubahan secara DRASTIS sesuai perintah user di atas pada konten yang ada.`
      : `Product: ${productName}. Description: ${description}. Target audience: ${targetAudience}. Price: ${price}.`;

    console.log('FINAL USER PROMPT:', userPrompt);
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt + `\n\nRANDOM_SEED: ${Math.random().toString(36).substring(7)}` },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: isRegenerating ? 0.3 : 1.2,
        response_format: { type: 'json_object' },
      })
    });

    const json = await response.json();
    console.log('GROQ RAW RESPONSE:', json.choices[0].message.content);
    const data = JSON.parse(json.choices[0].message.content || '{}');

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
