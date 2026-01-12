// this is from AI LLM unit and checks to make sure user query is a string
// probably don't need this since we're hard-coding in drop-down menu options
// this would be needed if user could simply type in their prompt


// import { Request, RequestHandler } from 'express';
// import { ServerError } from '../types';

// export const parseNaturalLanguageQuery: RequestHandler = async (
//   req: Request<unknown, unknown, Record<string, unknown>>,
//   res,
//   next
// ) => {
//   if (!req.body.naturalLanguageQuery) {
//     const error: ServerError = {
//       log: 'Natural language query not provided',
//       status: 400,
//       message: { err: 'An error occurred while parsing the user query' },
//     };
//     return next(error);
//   }

//   const { naturalLanguageQuery } = req.body;

//   if (typeof naturalLanguageQuery !== 'string') {
//     const error: ServerError = {
//       log: 'Natural language query is not a string',
//       status: 400,
//       message: { err: 'An error occurred while parsing the user query' },
//     };
//     return next(error);
//   }

//   res.locals.naturalLanguageQuery = naturalLanguageQuery;
//   return next();
// };
