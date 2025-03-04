import bcrypt from "bcryptjs";
import { Admin, Token, User } from "../../models";
import {
  STATUS_CODES,
  ERROR_MESSAGES,
} from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import Stripe from "stripe"
import config from "../../config/config";
import { Dictionary } from "../../types";
import { TokenDocument, UserDocument } from "../../interfaces";
import { forgotPasswordEmail } from "../../libs/sendMails";
import { ObjectId, trusted } from "mongoose";
const stripeInstance = new Stripe(config.stripeSecretKey);


const login = async (body: Dictionary) => {
  const { mobileNumber } = body;
  console.log(body, "body............");
  try {
    const user = await User.findOneAndUpdate({ mobileNumber }, { isDeleted: false }, { upsert: true, new: true });
    console.log(user);
    if (user.isBlocked) {
      throw new OperationalError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.ACCOUNT_BLOCKED
      );
    }
    // const stripeCustomer = await stripeInstance.customers.create({
    //       name: firstName,
    //       email,
    //       phone: `${countryCode}${mobileNumber}`,
    //     });

    //     user.stripeCustomerId = stripeCustomer.id;
    //     await user.save();
    //     return user;
    return user;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const createProfile = async (body: Dictionary, userId: ObjectId) => {
  const { fullName, email, age, gender } = body
  try {
    const updatedUserData = await User.findByIdAndUpdate(userId, { fullName, email, age, gender, isCreatedProfileUser: true }, { new: true }) as UserDocument
    const stripeCustomer = await stripeInstance.customers.create({
      name: fullName,
      email,
      phone: `${updatedUserData?.countryCode}${updatedUserData?.mobileNumber}`,
    });

    updatedUserData.stripeCustomerId = stripeCustomer.id;
    await updatedUserData?.save();
    return updatedUserData;
  } catch (error: any) {
    console.log(error)
    throw new error
  }
}

const deleteAccount = async (user: Dictionary, query: Dictionary) => {
  const { password } = query;
  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      );
    }

    const [deletedUser, deletedToken] = await Promise.all([
      User.findByIdAndUpdate(
        user._id,
        { isDeleted: true, isVerified: false },
        { lean: true, new: true }
      ),
      Token.updateMany(
        { user: user._id },
        { isDeleted: false },
        { lean: true, new: true }
      ),
    ]);
    if (!deletedUser) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }

};

const logout = async (userId: ObjectId) => {
  await Token.updateMany({ user: userId }, { isDeleted: false });
};

const editProfile = async (userId: ObjectId, body: UserDocument) => {
  const {
    fullName,
    email,
    age,
    gender
  } = body;
  try {
    const updatedProfileData = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        age,
        gender
      },
      { lean: true, new: true }
    );
    if (!updatedProfileData) {
      throw new OperationalError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.USER_NOT_FOUND
      );
    }
    return updatedProfileData;
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};


const userInfo = async (user: Dictionary, query: Dictionary) => {
  return user
};

const pushNotificationStatus = async (user: UserDocument) => {
  try {
    if (user.isPushNotification) {
      user.isPushNotification = false
    } else if (!user.isPushNotification) {
      user.isPushNotification = true
    }
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export {
  login,
  createProfile,
  deleteAccount,
  logout,
  editProfile,
  userInfo,
  pushNotificationStatus
};
