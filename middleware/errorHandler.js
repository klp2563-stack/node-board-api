
module.exports = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    if (err.isOperational){
        return res.status(statusCode).json({
            name:err.name,
            message: err.message,
            ...(err.errors ? { errors : err.errors }: {}),
        });
    }

    console.error("UNEXPECTED ERROR", err);
    return res.status(500).json({
        message:"서버 에러",
    });
};
