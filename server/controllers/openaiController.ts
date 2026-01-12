import { Request, Response, NextFunction } from "express";
import OpenAI from 'openai';
import 'dotenv/config';

import { ServerError } from "../types";
// npm install openai

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string
});

// note: 2 DIFFERENT response objs here: 1 response from api to server, 1 res from server to client
// add OPEN_API_KEY to .env file

export default {

generateAstroData: async (req: Request, res: Response, next: NextFunction) => {
  const { userId, birthdate, birthplace, birthtime } = res.locals;

  if (!userId) {
    const error: ServerError = {
      log: 'no userId found',
      status: 500,
      message: { err: 'user must be created before generating astro data' },
    };
    return next(error);
  }

  const systemPrompt = `
You are an expert astrocartographer. Given a person's birth information:
- Date of birth: ${birthdate}
- Birth place: ${birthplace}
- Birth time: ${birthtime}

Extract and return ONLY this information in JSON format:
{
  "zodiac_sign": "exact zodiac sign",
  "age": "calculate age in years",
  "best_locations": ["location1", "location2", "location3", "location4", "location5"]
}

list of valid zodiac signs: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

Rules:
1. Calculate age based on current date ${new Date().toISOString().split('T')[0]}
2. List exactly 5 best locations based on user's birth data for astrocartography
3. Use proper location names (city, country format)
4. Make sure zodiac sign is valid, according to list above.
4. No additional text, only JSON
`.trim();


    try {
      const resp = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: systemPrompt,
      });

      if (!resp.output_text){
        const error: ServerError = {
          log: 'OpenAI did not return a response',
          status: 500,
          message: {err: 'An error occurred while querying OpenAI'},
        };
        return next(error);
      }

      // store raw response for parsing onto res.locals
      res.locals.rawOpenAIResp = resp.output_text;
      return next();

    } catch (err) {
      const error: ServerError = {
      log: `queryOpenAI: ${err}`,
      status: 500,
      message: { err: 'An error occurred while querying OpenAI' },
    };
    return next(error)
    }
  }


  // getAllAnime: async (req: Request, res: Response, next: NextFunction) => {
  //   // this middleware actually wasn't ever used
  //   try {
  //     // Use fetch to get all anime data
  //     // https://anime-db.p.rapidapi.com/anime to get anime data

  //     // hard-coded queries
  //     // will get 8 entries (size) from page 1
  //     const page = 1;
  //     const size = 8;

  //     const baseUrl = `https://anime-db.p.rapidapi.com/anime`;

  //     // Construct URL for fetch, including query parameters
  //     const url = `${baseUrl}?page=${page}&size=${size}`;

  //     //  https://anime-db.p.rapidapi.com/anime?page=2&size=25

  //     const response = await fetch(
  //       url,
  //       { headers: { "X-RapidApi-Key": API_KEY } }
  //       // be sure to include API in headers
  //     );
  //     if (!response.ok) {
  //       throw new Error(`RapidAPI responded with status: ${response.status}`);
  //     }

  //     // parse API resp (FROM JSON input -> convert to usable JavaScript)
  //     const allAnime = await response.json();

  //     // limit chars to manageable num // unnecessary since this is already taken care of with page and size in query
  //     //   const limitAnime = allAnime.slice(0, 3);
  //     // Store char data in res.locals obj (res -> Express res to client)
  //     //   res.locals.getAnime = limitAnime;

  //     res.locals.getAnime = allAnime;

  //     // move to next middleware
  //     return next();
  //   } catch (err) {
  //     // invoke global error handler
  //     return next({
  //       log: `getAllAnime error: ${err}`,
  //       message: { err: "getAllAnimeData error" },
  //     });
  //   }
  // },



  // getByGenre: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     // get genre and sort from user input
  //     // const { genre, sort } = req.body;

  //     // hard-coded queries
  //     // will get 8 entries (size) from page 1
  //     const page = 1;
  //     const size = 8;
  //     const genre = req.query.genre as string; // user input ->
  //     const sort = "asc"; // user input -> should be either 'asc' or 'desc'

  //     const baseUrl = `https://anime-db.p.rapidapi.com/anime`;

  //     // Construct the URL for fetch, including query parameters
  //     const url = `${baseUrl}?page=${page}&size=${size}&genres=${genre}&sortBy=ranking&sortOrder=${sort}`;

  //     //  https://anime-db.p.rapidapi.com/anime?page=2&size=25

  //     const response = await fetch(
  //       url,
  //       { headers: { "X-RapidApi-Key": API_KEY } }
  //       // Check if API resp success
  //     );

  //     if (!response.ok) {
  //       throw new Error(`RapidAPI responded with status: ${response.status}`);
  //     }

  //     // Parse API resp (FROM JSON input -> convert to usable JavaScript)
  //     const genreAnime = await response.json();

  //     // limit chars to manageable num
  //     // const limitAnime = genreAnime.slice(0, 3);

  //     // Store char data in res.locals obj (res -> Express res to client)
  //     //   res.locals.getAnime = limitAnime;

  //     res.locals.animeGenre = genreAnime.data;

  //     // Move to next middleware
  //     return next();
  //   } catch (err) {
  //     // Invoke global error handler
  //     return next({
  //       log: `getByGenre error: ${err}`,
  //       message: { err: "getByGenre error" },
  //     });
  //   }
  // },


};
