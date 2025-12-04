export const refractHttpError = (error: any): any => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
            message: error.message,
        };
    } else if (error.request) {
        // The request was made but no response was received
        return {
            message: "No response received from server",
            request: error.request,
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        return {
            message: error.message,
        };
    }
};
