import express, { Router } from 'express';
import { validate } from '../../middlewares/validate';
import validation from '../../validations/admin/course.validation';
import controller from '../../controllers/admin/course.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';

const router = express.Router();

router.route('/')
    .post(auth(USER_TYPE.ADMIN), validate(validation.createCourse), controller.createCourse)
    .get(auth(USER_TYPE.ADMIN), validate(validation.getCourse), controller.getCourse)
    .put(auth(USER_TYPE.ADMIN), validate(validation.updateCourse), controller.updateCourse)
    .delete(auth(USER_TYPE.ADMIN), validate(validation.deleteCourse), controller.deleteCourse);

router.get('/courseDetails', auth(USER_TYPE.ADMIN), validate(validation.courseDetails), controller.courseDetails)

router.get('/orderListing', auth(USER_TYPE.ADMIN), validate(validation.orderListing), controller.orderListing)

export default router;
