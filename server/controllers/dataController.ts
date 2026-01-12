import { Request, Response, NextFunction } from "express";
import { ServerError } from "../types";
import { DataController } from "../types.ts";

// input parameter from res.locals.rawOpenAIResp
// need to extract zodiac_sign, age, and  best_locations from openAI generated raw response
// extract JSON from markdown code bloccks (```json```) since ChatGPT could put response inside of code block
// validate that raw response has been cleaned (see validateInput.ts)
//
const dataController: DataController = {
  parseRawData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rawOpenAIResp } = res.locals;

      if (!rawOpenAIResp) {
        const error: ServerError = {
          log: "no rawOpenAIResp found",
          status: 500,
          message: { err: "openAi response must exist" },
        };
        return next(error);
      }

      const jsonMatch =
        rawOpenAIResp.match(/```json\n([\s\S]*?)\n```/) ||
        rawOpenAIResp.match(/{[\s\S]*?}/);

      console.log("jsonMatch: ", jsonMatch);

      let astroData;

      //Parse JSON
      if (jsonMatch) {
        const cleanStr = jsonMatch[0].replace(/```json\n|\n```/g, "");

        console.log("cleanStr: ", cleanStr);

        try {
          astroData = JSON.parse(cleanStr);

          astroData.age = Number(astroData.age)

          res.locals.astroData = astroData;
        } catch (err) {
          const error: ServerError = {
            log: "Failed to parse AI JSON",
            status: 500,
            message: {
              err: "Invalid JSON format from AI",
            },
          };
        }
      }
     console.log("astroData outside: ", res.locals.astroData);
      return next();
    } catch (err) {
      return next(err);
    }
  },

  validateAstroData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // use variable astroData as clean data
    // check validation from astroData
    const errors: string[] = [];

    const astroData = res.locals.astroData;

    // 1. zodiac sign valid
    const validSigns = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ];

    if (astroData.zodiac_sign && !validSigns.includes(astroData.zodiac_sign)) {
      errors.push("Invalid zodiac sign received from AI");
    }

    // 2. age valid (optional)
    if (astroData.age && (astroData.age < 0 || astroData.age > 120)) {
      errors.push("Invalid age received from AI");
    }

    // 3. locations valid
    if (astroData.best_locations) {
      // check if array
      if (!Array.isArray(astroData.best_locations)) {
        errors.push("Locations should be an array");
      }
      // check max length
      if (astroData.best_locations.length > 5) {
        errors.push("Too many locations received");
      }
    }
    console.log("errors: ", errors);
    return next();
  },
};

export default dataController;
