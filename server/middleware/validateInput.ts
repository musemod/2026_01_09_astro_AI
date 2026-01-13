// import { Request, Response, NextFunction } from "express";

// // validate astro data from generated response
// // need to store astroData onto res.locals

// // output string of errors
// export const validateAstroData = (astroData: any): string[] => {

//     const errors: string[] = [];

// // 1. zodiac sign valid
//   const validSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

//   if (astroData.zodiac_sign && !validSigns.includes(astroData.zodiac_sign)) {
//     errors.push('Invalid zodiac sign received from AI');
//   }
  
//   // 2. age valid (optional)
//   if (astroData.age && (astroData.age < 0 || astroData.age > 120)) {
//     errors.push('Invalid age received from AI');
//   }
  
//   // 3. locations valid
//   if (astroData.best_locations) {
//     // check if array
//     if (!Array.isArray(astroData.best_locations)) {
//       errors.push('Locations should be an array');
//     }
//     // check max length
//     if (astroData.best_locations.length > 5) {
//       errors.push('Too many locations received');
//     }
//   }
  
//   return errors;
// };



