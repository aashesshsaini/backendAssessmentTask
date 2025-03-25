import Joi from 'joi';
import { JOI } from '../../config/appConstant';


const createBlog= {
body: Joi.object().keys({
        title: Joi.string().required(),
        mainImage: Joi.string(),
        introduction: Joi.string().required(),
        sections:Joi.array().items(
            Joi.object().keys({
                image: Joi.string(),
                title: Joi.string(),
                description: Joi.string(),
                bullets: Joi.string(),
                paragraph: Joi.string(),
            })
        )
    })
}

const getBlog = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow('')
    })
}

const updateBlog = {
    body: Joi.object().keys({
        blogId:JOI.OBJECTID,
        title: Joi.string(),
        mainImage: Joi.string(),
        introduction: Joi.string(),
        sections:Joi.array().items(
            Joi.object().keys({
                image: Joi.string(),
                title: Joi.string(),
                description: Joi.string(),
                bullets: Joi.string(),
                paragraph: Joi.string(),
            })
        )
    })
}


const deleteBlog = {
    query: Joi.object().keys({
        blogId: JOI.OBJECTID
    })
}

const blogDetails = {
    query: Joi.object().keys({
        blogId: JOI.OBJECTID
    })
}


export default {createBlog, getBlog, updateBlog, deleteBlog, blogDetails}