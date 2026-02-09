const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const db = require("../model/db");
const jwt = require("jsonwebtoken");

async function signup({email, password}) {
    const[rows] = await db.promise().query(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );
    
    if (rows.length > 0 ){
        throw new AppError("DUPLICATE_EMAIL", 409, "이미 가입된 이메일입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
    );

    return { success: true, message: "회원가입 완료"};
}

async function login({ email, password}) {
    const [rows] = await db.promise().query(
        "SELECT id, email, password FROM users WHERE email = ?",
        [email]
    );

    if (rows.length === 0) {
        throw new AppError(
            "INVALID_CREDENTIALS", 401, "이메일 또는 비밀번호가 올바르지 않습니다."
        );
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if(!ok) {
        throw new AppError(
            "INVALID_CREDENTIALS", 401, "이메일 또는 비밀번호가 올바르지 않습니다."
        );
    }

    const accessToken = jwt.sign(
        { userId:user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h'}
    );

    return { success: true, message:"로그인 성공", token: accessToken };
}

module.exports = {signup, login};