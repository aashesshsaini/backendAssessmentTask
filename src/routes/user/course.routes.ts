import express, { Router } from "express";
import { validate, validateView } from "../../middlewares/validate";
import validation from "../../validations/user/course.validation";
import userCourseController from "../../controllers/user/course.controller";
import auth from "../../middlewares/auth";
import { USER_TYPE } from "../../config/appConstant";
import { Request, Response, NextFunction } from "express";

const router: Router = express.Router();

router.get('/', auth(USER_TYPE.USER), validate(validation.getCourses), userCourseController.getCourses)

router.get('/courseDetails', auth(USER_TYPE.USER), validate(validation.courseDetails), userCourseController.courseDetails)

router.post('/createOrder', auth(USER_TYPE.USER), validate(validation.createOrder), userCourseController.createOrder)

router.post('/webhook', userCourseController.webhook)

router.get('/myCourses', auth(USER_TYPE.USER), validate(validation.myCourses), userCourseController.myCourses)

router.get('/blogs', auth(USER_TYPE.USER), validate(validation.getBlogs), userCourseController.getBlogs)

router.get('/blogDetails', auth(USER_TYPE.USER), validate(validation.blogDetails), userCourseController.blogDetails)



export default router

