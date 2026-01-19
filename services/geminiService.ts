
import { GoogleGenAI, Type } from "@google/genai";
import { MatchAnalysisResponse } from "../types";

export const getFootballAnalysis = async (homeTeam: string, awayTeam: string): Promise<MatchAnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze the football match between ${homeTeam} and ${awayTeam}. 
    Follow these strict rules:
    1. Scan last 5 H2H and last 5 individual matches.
    2. Analyze League averages for niche stats like VAR, Medical Team, and Goal Kicks.
    3. Factor in Referee styles for Red/Yellow cards and Penalties.
    4. Provide probabilities for EVERY SINGLE mandatory option listed in the request.
    5. Explanations MUST be in Bengali. Market Names MUST be in English.
    6. If probability is >70%, explain why in exactly one sentence in Bengali.
    
    Categories and Items to include:
    - Match Outcomes: Home Win, Away Win, Draw, Double Chance (Home/Away), Draw in one half, Win by margin (1,2,3,4+).
    - Goals & BTS: Total Goals (U/O), Handicap, Goal count, BTS (Yes/No), Winner+BTS, Winner+U/O, 1st Goal Team, 1st Goal by Kick, Goal in both halves, Goals in a row (2,3,4,5), One-sided field scoring.
    - Special Events: Goal outside box, Header goal, Goal after corner (10s), Substitute to score, Injury time goal, Double Chance + BTS.
    - Discipline & Fouls: Red Card, Penalty or Red Card, Penalty Awarded, No Penalty/No Red Card, Yellow Card (U/O), Both team 1+ card, Foul winner.
    - Set Pieces & Stats: Corner Winner, Total Corners (U/O), Last Corner Time, Race to 7/9 Corners, Shots on Target (U/O & Winner), Offside (U/O), Goal Kicks Winner, More Saves, More Shots towards bar.
    - VAR & Misc: VAR Checked, Medical team entry (2+ times), Ball in net but no goal.`,
    config: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchInfo: {
            type: Type.OBJECT,
            properties: {
              homeTeam: { type: Type.STRING },
              awayTeam: { type: Type.STRING },
              predictionConfidence: { type: Type.STRING },
              summary: { type: Type.STRING, description: "Bengali summary of the match outlook" },
            },
            required: ["homeTeam", "awayTeam", "predictionConfidence", "summary"]
          },
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                categoryName: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      marketName: { type: Type.STRING },
                      probability: { type: Type.NUMBER },
                      explanation: { type: Type.STRING }
                    },
                    required: ["marketName", "probability", "explanation"]
                  }
                }
              },
              required: ["categoryName", "items"]
            }
          }
        },
        required: ["matchInfo", "categories"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI engine");
  return JSON.parse(text) as MatchAnalysisResponse;
};
