//Node.js provides a class having a name Error and we are going to inherit it in another class
class ApiError extends Error
{
  constructor(
    message= "Something went wrong!",
    statusCode,
    errors = [],
    stack = ""
  )
  {
    super(message);          //when we override something we use super
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.message = message;
    this.success = false;
    if (stack)
    {
      this.stack = stack;    //It is used to track the errors
    }
    else {
      Error.captureStackTrace(this, this.constructor);   //We have passed the instance, so it will come to know about which context we are talking 
    }
  }
}

export { ApiError };