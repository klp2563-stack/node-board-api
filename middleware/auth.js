const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");



module.exports = (req, res ,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return next(new AppError("UNAUTHORIZED", 401, "인증 토큰이 없습니다."));
    }

    const [type, token] = authHeader.split(" ");

    if(type !=="Bearer" || !token) {
        return next(new AppError("INVALID_TOKEN", 401, "토큰 형식이 올바르지 않습니다."));
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { userId: decoded.userId };
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new AppError("TOKEN_EXPIRED", 401, "토큰이 만료되었습니다."));
        }
        if (err.name === "JsonWebTokenError") {
            return next(new AppError("INVALID_TOKEN", 401, "토큰이 유효하지 않습니다."));
        }
        return next(new AppError("INVALID_TOKEN", 401, "토큰 검증 중 오류가 발생했습니다."));
    }
};
