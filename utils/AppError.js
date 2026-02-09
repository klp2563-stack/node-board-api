
class AppError extends Error {
    constructor(nameOrMessage, statusCode = 500, message, errors){
        const isEXtended = typeof message === "string";
        const finalMessage = isEXtended ? message : nameOrMessage;
        super(finalMessage);

        this.name = isEXtended ? nameOrMessage : "ERROR";
        this.statusCode = statusCode;
        this.isOperational = true;

        if (Array.isArray(errors) && errors.length > 0){
            this.errors = errors;
        }
    }
}
module.exports = AppError;