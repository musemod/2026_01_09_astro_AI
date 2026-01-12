import express from "express";
import openaiController from "../controllers/openaiController.ts";
import userController from "../controllers/userController.ts";
import sessionController from "../controllers/sessionController.ts";
import { createSecureServer } from "http2";
import dataController from "../controllers/dataController.ts";
import { validateInputTools } from "openai/lib/ResponsesParser.mjs";

const apiRouter = express.Router(); // creates a mini Express app for routing

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
//GET req if req path matches '/api/'

// FIGURE OUT MIDDLEWARE FLOW WITH TEAM

// ADD GET ROUTE HANDLER HERE

// route middleware chain:
// 1. createUser (save basic info to DB) →
// 2. queryOpenAIChat (get astro data) →
// 3. possibly parse / validate astro data
// 4. updateUserWithAstroData (update with zodiac/locations)

// http://localhost:3000/api/createUser
apiRouter.post("/createUser", 
  userController.createUser, 
  openaiController.generateAstroData, 
  dataController.parseRawData,
  dataController.validateAstroData,
  // userController.updateUser,

  (req, res) => {
  return res.status(200).json({
    message: "created User profile",
    user: {
      id: res.locals.userId,
      username: res.locals.username,
      birthdate: res.locals.birthdate,
      birthtime: res.locals.birthtime,
      birthplace: res.locals.birthplace,
      // zodiac_sign: res.locals.zodiac_sign,
      // age: res.locals.age,
      // best_locations: res.locals.best_locations
    },
    openAiRaw: res.locals.rawOpenAIResp,
    astroData: res.locals.astroData
  });
});



// apiRouter.get(
//   "/",
//   openaiController.getAllAnime,
//   (_req, res) => {
//     return res.status(200).json({ getAnime: res.locals.getAnime });
//   }
// );

// // http://localhost:3000/api/genre
// apiRouter.get(
//   "/genre",
//   openaiController.getByGenre,
//   (req, res) => {
//     return res.status(200).json({ animeGenre: res.locals.animeGenre });
//   }
// );

// // http://localhost:3000/api/genre
// apiRouter.post(
//   "/genre", sessionController.isLoggedIn,
//   userController.addToFavorites,
//   (req, res) => {
//     return res.status(200).json( {
//       message: 'anime added to user favs',
//       favorites: res.locals.userFavs
//     });
//   }
// );

// EXPORT THE ROUTER
export default apiRouter;
