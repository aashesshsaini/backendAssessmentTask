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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = void 0;
const models_1 = require("../../models");
const universalFunctions_1 = require("../../utils/universalFunctions");
const redis_1 = __importDefault(require("../../utils/redis"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config/config"));
const stripeInstance = new stripe_1.default(config_1.default.stripeSecretKey);
const getCourses = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, limit = 10, search } = query;
    const cacheKey = `Courses:page=${page}:limit=${limit}:search=${search || 'all'}`;
    try {
        const cachedData = yield redis_1.default.get(cacheKey);
        if (cachedData) {
            console.log("Fetching from Redis Cache...");
            return JSON.parse(cachedData);
        }
        var filter = {
            isDeleted: false,
        };
        if (search) {
            filter = Object.assign(Object.assign({}, filter), { $or: [
                    { CourseName: { $regex: RegExp(search, "i") } },
                ] });
        }
        const [CourseListing, CourseCount] = yield Promise.all([
            models_1.Course.find(filter, { cartUsers: 0 }, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.Course.countDocuments(filter),
        ]);
        const result = { CourseListing, CourseCount };
        const redisData = yield redis_1.default.setEx(cacheKey, 36, JSON.stringify(result));
        return result;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.getCourses = getCourses;
