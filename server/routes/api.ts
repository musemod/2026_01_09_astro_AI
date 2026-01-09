import express from "express";
import openaiController from "../controllers/openaiController.ts";
import userController from "../controllers/userController.ts";
import sessionController from "../controllers/sessionController.ts";

const apiRouter = express.Router(); // creates a mini Express app for routing

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
//GET req if req path matches '/api/' 

// FIGURE OUT MIDDLEWARE FLOW WITH TEAM

// ADD GET ROUTE HANDLER HERE
apiRouter.get(
  "/",
  openaiController.getAllAnime,
  (_req, res) => {
    return res.status(200).json({ getAnime: res.locals.getAnime });
  }
);

// http://localhost:3000/api/genre
apiRouter.get(
  "/genre",
  openaiController.getByGenre,
  (req, res) => {
    return res.status(200).json({ animeGenre: res.locals.animeGenre });
  }
);

// http://localhost:3000/api/genre
apiRouter.post(
  "/genre", sessionController.isLoggedIn,
  userController.addToFavorites, 
  (req, res) => {
    return res.status(200).json( {
      message: 'anime added to user favs',
      favorites: res.locals.userFavs
    });
  }
);


// EXPORT THE ROUTER
export default apiRouter;
