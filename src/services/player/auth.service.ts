import bcrypt from "bcryptjs";
import { Token, Player } from "../../models";
import {
  STATUS_CODES,
  ERROR_MESSAGES,
} from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";


const signup = async (body: Dictionary) => {
  const { fullName, email, password, mobileNumber, countryCode, age, region, gender } = body;
  try {
   const hashedPassword = await bcrypt.hash(password, 10)
   const player = await Player.create({fullName, email, password:hashedPassword, mobileNumber, countryCode, age, region, gender})
    return player;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const login = async (body: Dictionary) => {
  const { email, password } = body;
  try {
    const player = await Player.findOne({ email })
      if (!player) {
        throw new OperationalError(
          STATUS_CODES.ACTION_FAILED,
          ERROR_MESSAGES.PLAYER_NOT_FOUND,  
      )
    }
    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      )
    }
    return player;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};


export {
  signup,
  login,
};
