// Define a class named ApiResponse
class ApiResponse {
    // Constructor function for initializing instances of ApiResponse
    constructor(statusCode, data, message = "Success") {
        // Set properties of the ApiResponse instance
        this.statusCode = statusCode; // HTTP status code of the response
        this.data = data; // Data payload of the response
        this.message = message; // Response message (default: "Success")
        this.success = statusCode < 400; // Boolean flag indicating the success of the response
    }
}


export {ApiResponse}