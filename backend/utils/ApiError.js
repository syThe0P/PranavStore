// Define a custom error class named ApiError which extends the built-in Error class
class ApiError extends Error {
    // Constructor function for initializing instances of ApiError
    constructor(
      statusCode, // HTTP status code for the error response
      message = "Something went wrong", // Error message (default: "Something went wrong")
      errors = [], // Array of error details or validation errors (default: [])
      stack = "" // Error stack trace (default: empty string)
    ) {
      // Call the constructor of the parent class (Error)
      super(message);
  
      // Set custom properties specific to ApiError instances
      this.statusCode = statusCode; // HTTP status code
      this.data = null; // Additional data (default: null)
      this.message = message; // Error message
      this.success = false; // Flag indicating operation success (default: false)
      this.errors = errors; // Array of error details or validation errors
    }
  }
  
  // Export the ApiError class to make it available for use in other parts of the application
  export { ApiError };
  
  //Notes
  
  /*
  Class Inheritance: The ApiError class extends the built-in Error class, allowing it to inherit its properties and methods. This makes ApiError a subclass of Error, enabling it to be treated as a specialized type of error.
  Constructor: The constructor function of ApiError initializes instances of the class with various properties. These properties include the HTTP status code (statusCode), error message (message), array of error details (errors), and error stack trace (stack). Default values are provided for message, errors, and stack.
  Super Keyword: The super() function is called inside the constructor to invoke the constructor of the parent class (Error). This ensures that the error message is properly initialized using the provided message.
  Custom Properties: Additional custom properties specific to ApiError instances are set inside the constructor. These properties include statusCode, data, message, success, and errors, which provide information about the error context, success status, and error details.
  */

