import express, { Router } from 'express';
import { validate } from '../../middlewares/validate';
import validation from '../../validations/admin/blog.validation';
import controller from '../../controllers/admin/blog.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';

const router = express.Router();

router.route('/')
    .post(auth(USER_TYPE.ADMIN), validate(validation.createBlog), controller.createBlog)
    .get(auth(USER_TYPE.ADMIN), validate(validation.getBlog), controller.getBlog)
    .put(auth(USER_TYPE.ADMIN), validate(validation.updateBlog), controller.updateBlog)
    .delete(auth(USER_TYPE.ADMIN), validate(validation.deleteBlog), controller.deleteBlog);

    router.get('/blogDetails', auth(USER_TYPE.USER), validate(validation.blogDetails), controller.blogDetails)


export default router
