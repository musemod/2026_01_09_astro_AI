import { Request, Response, NextFunction } from "express";
// import { RequestHandler } from "express";
import OpenAI from 'openai';
// import 'dotenv/config';
// npm install openai

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string
});


// note: 2 DIFFERENT response objs here: 1 response from api to server, 1 res from server to client
// add OPEN_API_KEY to .env file
// 

export default {

queryOpenAIChat: async (_req: Request, res: Response, next: NextFunction) => {
  const { userQuery } = res.locals;
  if (!userQuery) {
    const error: ServerError = {
      log: 'queryOpenAIChat did not receive a user query',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }
  

    const prompt = `
  You are a helpful movie recommender.

  User Request: "${userQuery}"

  Here are relevant movies (You MUST pick exactly one of these titles): 
  

  Rules:
- Recommend exactly ONE movie and it MUST be one of the listed titles.
- Explain why in 1-2 sentences.
`.trim();


    try {
      const resp = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: prompt,
      });

      if (!resp.output_text){
        const error: ServerError = {
          log: 'OpenAI did not return a response',
          status: 500,
          message: {err: 'An error occurred while querying OpenAI'},
        };
        return next(error);
      }

      res.locals.movieRecommendation = resp.output_text;
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
