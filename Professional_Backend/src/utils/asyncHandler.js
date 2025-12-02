//Using promise

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise
      .resolve(requestHandler(req, res, next))  //if the response is valid, it will execute the requestHandler function.
      .catch((err) => next(err));     
  };
};

//Using Try-Catch

//This requestHandler is just a function caught or pass as a parameter and as we are using the '{}' in arrow function hence we required to return that
// const asyncHandler = (requestHandler) => {
//   return async (req, res, next) => {
//     try{
//       await requestHandler(req, res, next);    //Just executes the fucntion which has caught as a parameter
//     }
//     catch (error)
//     {
//       console.error(error);
//       res.status(error.code || 500).json({     //This code denotes that there is something error
//         success: false,        //flag denotes there is a error
//         message: error.message
//       })
//     }
//   }
// }

// cosnt asyncHandler = () => {}
// cosnt asyncHandler = (func) => () => {}
// cosnt asyncHandler = (func) => async () => {}

export { asyncHandler };

//Link of grok chat for proper explanation of this above code
//https://grok.com/share/bGVnYWN5_f3f5360b-8c05-451d-a7f8-fde8ffd2a30e