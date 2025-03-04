import Joi from 'joi';
import { JOI } from '../../config/appConstant';
import { duration } from 'moment';
import { query } from 'express';

const createCourse = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        video: Joi.string().required(),
        duration:Joi.string().required(),
        price: Joi.number().required(),
        priceWithOffer: Joi.number().required()
    })
}

const getCourse = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow('')
    })
}

const updateCourse = {
    body: Joi.object().keys({
        courseId:JOI.OBJECTID,
        title: Joi.string(),
        description: Joi.string(),
        video: Joi.string(),
        duration: Joi.string(),
        price: Joi.number(),
        priceWithOffer: Joi.number()
    })
}


const deleteCourse = {
    query: Joi.object().keys({
        courseId: JOI.OBJECTID
    })
}

const courseDetails = {
    query: Joi.object().keys({
        courseId: JOI.OBJECTID
    })
}

const orderListing = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow('')
    })
}


export default { createCourse, getCourse, updateCourse, deleteCourse, courseDetails, orderListing }