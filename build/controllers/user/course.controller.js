"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const response_1 = require("../../utils/response");
const appConstant_1 = require("../../config/appConstant");
const universalFunctions_1 = require("../../utils/universalFunctions");
const getCourses = (0, universalFunctions_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield services_1.userCourseService.getCourses(req.query);
    return (0, response_1.successResponse)(req, res, appConstant_1.STATUS_CODES.SUCCESS, appConstant_1.SUCCESS_MESSAGES.SUCCESS, courses);
}));
// const addRemoveToCart = catchAsync(async (req: Request, res: Response) => {
//     const orderData = await userCourseService.addRemoveToCart(req.body, req.token?.user?._id);
//     return successResponse(
//         req,
//         res,
//         STATUS_CODES.SUCCESS,
//         SUCCESS_MESSAGES.SUCCESS,
//         orderData
//     );
// });
// const createOrder = catchAsync(async (req: Request, res: Response) => {
//     const orderData = await userCourseService.createOrder(req.body, req.token?.user?._id);
//     return successResponse(
//         req,
//         res,
//         STATUS_CODES.SUCCESS,
//         SUCCESS_MESSAGES.SUCCESS,
//         orderData
//     );
// });
// const webhook = catchAsync(async (req: Request, res: Response) => {
//     const orderData = await userCourseService.webhook(req.body);
//     return successResponse(
//         req,
//         res,
//         STATUS_CODES.SUCCESS,
//         SUCCESS_MESSAGES.SUCCESS,
//         orderData
//     );
// });
exports.default = { getCourses };
