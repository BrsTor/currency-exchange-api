// Function to handle success response
function handleSuccess(res, data) {
    res.status(200).json({
        success: true,
        data: data,
    });
}

// Function to handle error response
function handleError(res, error) {
    console.error(error);
    res.status(500).json({
        success: false,
        error: "An error occurred. Please try again later.",
    });
}

module.exports = {
    handleSuccess,
    handleError,
};
