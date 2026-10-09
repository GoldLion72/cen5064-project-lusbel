function errorHandler(err, req, res, next) {
    console.log("Error:",err);
    console.log(`URL: ${req.originalUrl}`);
    console.log(`Method: ${req.method}`);
    res.status(500).json({success: false, message: "Something went wrong.", error: err.message});
}

export default errorHandler;