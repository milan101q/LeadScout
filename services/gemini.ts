import { GoogleGenAI } from "@google/genai";
import { BusinessLead, SearchCriteria } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findLeads = async (criteria: SearchCriteria): Promise<BusinessLead[]> => {
  const { location, quantity, minReviews, maxDistance, ratingThreshold } = criteria;

  const prompt = `
    I need you to act as a lead generation specialist.
    Search for small businesses in or around "${location}" using Google Maps.

    **Search & Filtering Criteria:**
    1.  **Area:** Within "${location}"${maxDistance ? ` (Radius: approx ${maxDistance})` : ''}.
    2.  **Target:** Small businesses that ideally have NO website listed.
    3.  **Rating:** strictly BELOW ${ratingThreshold} stars.
    4.  **Reviews:** At least ${minReviews || 0} reviews.
    5.  **Quantity:** Try to find ${quantity} businesses that match these criteria.

    **Output Format:**
    Return the results strictly as a JSON array of objects.
    Each object must have these exact keys:
    - "companyName": string
    - "rating": number
    - "reviewCount": number
    - "phoneNumber": string (or "N/A" if not found)
    - "address": string
    - "postalCode": string
    - "googleMapsUrl": string

    If you cannot find exactly ${quantity} matching specifically matching "no website" and "low rating", prioritize the rating filter first, then the website filter.
    Do not include any markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // We instruct the model to output JSON in the prompt, but we don't enforce responseMimeType: application/json
        // when using tools sometimes to allow the tool to function freely, but for 2.5-flash it usually works well.
        // However, with Google Maps tool, it's safer to parse the text manually to catch grounding links if needed.
        // For this specific request where we need structured data *from* the map search, let's rely on the prompt instructions.
      },
    });

    let textResponse = response.text || "[]";
    
    // Cleanup potential markdown code blocks if the model adds them despite instructions
    textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    // Attempt to parse JSON
    let leads: BusinessLead[] = [];
    try {
      leads = JSON.parse(textResponse);
    } catch (e) {
      console.warn("Failed to parse JSON directly, attempting to extract array.", e);
      const match = textResponse.match(/\[.*\]/s);
      if (match) {
        leads = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse leads from response.");
      }
    }

    // Enhance with grounding metadata if strictly needed, but usually the model fills the JSON well.
    // However, the Google Maps tool grounding chunks often contain the most accurate map links.
    // We will trust the model's generated JSON for now as it aggregates the tool output.

    return leads;

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};