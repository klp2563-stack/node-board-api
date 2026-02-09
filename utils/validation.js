
function parsePositiveInt(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

function validateUserBody(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      body.name.trim().length < 2 ||
      body.name.trim().length > 20
    ) {
      errors.push({ field: "name", reason: "2~20자 문자열" });
    }
  }

  if (!partial || body.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof body.email !== "string" || !emailRegex.test(body.email)) {
      errors.push({ field: "email", reason: "이메일 형식" });
    }
  }

  if (!partial || body.age !== undefined) {
    if (!Number.isInteger(body.age) || body.age < 0 || body.age > 120) {
      errors.push({ field: "age", reason: "0~120 정수" });
    }
  }

  return errors;
}

function validatePostBody(body, { partial = false } = {}) {
  const errors = [];

if(!partial || body.title !== undefined){
  if (typeof body.title !=="string" || body.title.trim().length === 0) {
    errors.push({ field:"title", reason: "비어있지 않은 문자열" });
  } else if (body.title.length>100) {
    errors.push({ field: "title", reason: "100자 이하" });
  }
}
if (!partial || body.content !== undefined){
  if (body.content !== undefined && typeof body.content !== "string"){
    errors.push({ field: "content", reason: "문자열"});
  }else if (typeof body.content === "string" && body.content.length > 5000){
    errors.push({ field: "content", reason: "5000자 이하"});
  }
}
  return errors;
}

function validateSignupBody(body) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (typeof body.email !== "string" || !emailRegex.test(body.email)) {
    errors.push({field:"email", reason:"이메일 형식"});
  }
  
  if (typeof body.password !== "string" || body.password.length < 8 ){
    errors.push({ field:"password", reason:"최소 8자 이상"});
  }

  return errors;
}


function validateLoginBody(body) {
  const errors = [];
  const { email, password } = body || {};

  if(typeof email !== "string" || email.trim().length === 0){
    errors.push({field: "email" , reason: "필수입니다"});
  }
  if(typeof password !=="string" || password.trim().length=== 0){
    errors.push({field: "password", reason:"필수입니다"});
  }
    return errors; 
  
}


module.exports = {
  parsePositiveInt,
  validateUserBody,
  validateSignupBody,
  validatePostBody,
  validateLoginBody,
};
