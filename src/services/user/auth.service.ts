import bcrypt from "bcryptjs";
import { Token, User } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";

const signup = async (body: Dictionary) => {
  const { name, email, password } = body;
  try {
    const existingUserData = await User.findOne({ email }).lean();
    if (existingUserData) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.EMAIL_EXIST
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    return user;
  } catch (error: any) {
    console.log(error, "error...........");
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};

const login = async (body: Dictionary) => {
  const { email, password } = body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      );
    }
    return user;
  } catch (error: any) {
    console.log(error, "error...........");
    throw new OperationalError(STATUS_CODES.ERROR, ERROR_MESSAGES.SERVER_ERROR);
  }
};

export { signup, login };
