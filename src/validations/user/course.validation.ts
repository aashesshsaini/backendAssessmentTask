import Joi from 'joi';
import { CART_ACTION_CASE, JOI } from '../../config/appConstant';

const getCourses = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow('')
    })
}

const courseDetails = {
    query: Joi.object().keys({
        courseId: JOI.OBJECTID
    })
}

const createOrder = {
    body: Joi.object().keys({
        courseId: JOI.OBJECTID,
    })
}

const myCourses = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit:JOI.LIMIT
    })
}

export default { getCourses, courseDetails, createOrder, myCourses }