import mongoose from "mongoose";
// import {Schema, Document } from 'mongoose'; // make sure to import Document type from mongoose (unless already imported from line above)? yes
import bcrypt from "bcryptjs";

// extend Document type from Mongoose
export interface IUser extends Document {
  username: string;
  password?: string;

  // birth info
  birthdate: Date;
  birthtime?: string;
  birthplace?: string;
  current_location?: string;
  
  // generated astro data
  zodiac_sign?: string;
  age?: number;
  best_locations: string[]; // array of strings
  
  // matches (array of user IDs or match objects)
  match_preference: string;
  matches: mongoose.Types.ObjectId[]; // store other user IDs
  
  // timestamps
  created_at: Date;
  last_updated?: Date;

}

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

// create userSchema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },

 // birth info
  birthdate: {type: Date, required: [true, 'Birthdate required'] },
  birthtime: { type: String, required: true, default: 'unknown' },
  birthplace: {type: String, required: true},
  current_location: {type: String, required: true, default: 'not given'},
  
  // generated astro data
  zodiac_sign: {type: String, required: false, trim: true },
  age: { 
    type: Number,
    min: 0,
    max: 120,
    required: false
  },
  best_locations: { // MIGHT change later to array of objects [ { city: country}, { city: country} ] 
    type: [String], // array of strings,
    required: false,
    default: [], // init empty arr
    validate: {
      validator: function(locations: string[]) {
        // limit to 5 locations
        return locations.length <= 5;
      },
      message: 'Max 5 locations allowed'
    }
  },
  
  // matches - store refs to other users
  match_preference: {type: String, required: false, enum: ['man', 'woman', 'any'], default: 'any'},
  matches: [{
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'User',
    default: []
  }],
  
  // timestamps
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  last_updated: { 
    type: Date 
  }
});

userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // hash password with salt rounds
    const hashPwd = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    this.password = hashPwd;
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("User", userSchema);

