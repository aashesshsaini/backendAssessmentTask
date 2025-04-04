import Joi from 'joi';
import { JOI } from '../../config/appConstant';


// const createBlog= {
// body: Joi.object().keys({
//         title: Joi.string().required(),
//         mainImage: Joi.string(),
//         introduction: Joi.string().required(),
//         sections:Joi.array().items(
//             Joi.object().keys({
//                 image: Joi.string(),
//                 title: Joi.string(),
//                 description: Joi.string(),
//                 bullets: Joi.string(),
//                 paragraph: Joi.string(),
//             })
//         )
//     })
// }

export const createBlog = {
    body: Joi.object().keys({
      title: Joi.string().required(),
      introduction: Joi.string().required(),
             sections:Joi.array().items(
            Joi.object().keys({
                title: Joi.string(),
                description: Joi.string(),
                bullets: Joi.string(),
                paragraph: Joi.string(),
            })
             )
    }),
    // files: Joi.object().pattern(
    //     Joi.string(),
    //     Joi.array().items(
    //       Joi.object({
    //         fieldname: Joi.string().required(),
    //         originalname: Joi.string().required(),
    //         mimetype: Joi.string()
    //           .valid('image/jpeg', 'image/png', 'image/webp', 'image/jpg')
    //           .required(),
    //         size: Joi.number().max(10 * 1024 * 1024).required(),
    //         buffer: Joi.any().required(),
    //       })
    //     )
    //   )
  };


const getBlog = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow('')
    })
}

const updateBlog = {
    body: Joi.object().keys({
        title: Joi.string(),
        introduction: Joi.string(),
               sections:Joi.array().items(
              Joi.object().keys({
                  title: Joi.string(),
                  description: Joi.string(),
                  bullets: Joi.string(),
                  paragraph: Joi.string(),
              })
               )
      }),
      files: Joi.object().keys({
        file: Joi.array().items(
          Joi.object({
            fieldname: Joi.string().pattern(/^mainImage$|^sections\[\d+\]\[image\]$/),
            originalname: Joi.string(),
            mimetype: Joi.string().valid("image/jpeg", "image/png", "image/webp", "image/jpg"),
            size: Joi.number().max(10 * 1024 * 1024),
            buffer: Joi.any(),
          })
        ),
      }),      
//       files: Joi.object().keys({
//           file:Joi.array().items({
//               fieldname: Joi.string()
//               .pattern(/^mainImage$|^sections\[\d+\]\[image\]$/)
//               ,
//             originalname: Joi.string(),
//             mimetype: Joi.string()
//               .valid("image/jpeg", "image/png", "image/webp", "image/jpg")
//               ,
//             size: Joi.number().max(10 * 1024 * 1024), // 10 MB max
//             buffer: Joi.any(),
//           })
//   }),
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