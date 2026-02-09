function parsePagination(query, { defaultLimit = 10, maxLimit = 50, defaultOffset = 0 }={}){
    let limit = query.limit === undefined ? defaultLimit : Number(query.limit);
    let offset = query.offset === undefined ? defaultOffset : Number(query.offset);

    if(!Number.isInteger(limit)|| !Number.isInteger(offset)) {
        return{ ok: false, message: "limit/offset은 정수여야 합니다"};
    }
    if (offset < 0 )return {ok:false, message:"offset은 0 이상이여야 합니다"};
    if (limit < 1 )return { ok:false, message:"limit은 1 이상이여야 합니다"};
    if(limit > maxLimit) limit = maxLimit;
    return {ok: true, limit, offset};
}

module.exports = { parsePagination };