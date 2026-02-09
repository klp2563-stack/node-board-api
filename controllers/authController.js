const AppError = require("../utils/AppError");
const { validateSignupBody, validateLoginBody } = require("../utils/validation");
const authService = require("../services/authService")

exports.signup = async (req, res) => {
   const errors = validateSignupBody(req.body);
   if (errors.length > 0){
      throw new AppError ("VALIDATION_ERROR", 400, "요청한 값이 올바르지 않습니다.", errors);
   }

   const result = await authService.signup(req.body);
   return res.status(201).json(result);
};

exports.login = async (req, res) => {
   const errors = validateLoginBody(req.body);
   if(errors.length > 0) {
      throw new AppError("VALIDATION_ERROR", 400, "요청한 값이 올바르지 않습니다.", errors);
   }

   const result = await authService.login(req.body);
   return res.json(result);
};