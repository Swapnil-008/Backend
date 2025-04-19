//Using promise
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}

//Using Try-Catch
// const asyncHandler = (requestHandler) => {
//     return async (req, res, next) => {
//         try {
//             await requestHandler(req, res, next);
//         } catch (error) {
//             console.error(error);
//             res.status(error.code || 500).json({
//                 success: false,
//                 message: error.message
//             })
//         }
//     }
// }

export {asyncHandler}

//Link of grok chat for proper explanation of this above code
//https://grok.com/share/bGVnYWN5_f3f5360b-8c05-451d-a7f8-fde8ffd2a30e