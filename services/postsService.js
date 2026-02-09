const db = require("../model/db");
const AppError = require("../utils/AppError");

async function  assertOwner(postId, loginUserId) {
    const [rows] = await db
        .promise()
        .query("SELECT userId FROM posts WHERE id = ? AND deletedAt IS NULL",
        [postId]);

    if (rows.length === 0) throw new AppError("POST_NOT_FOUND", 404, "해당 글이 없습니다.");

    const ownerId = rows[0].userId;
    if(String(ownerId)!== String(loginUserId)) {
        throw new AppError("FORBIDDEN", 403, "권한이 없습니다.");
    } 
}
 
async function createPost({title, content, userId}) {
    const [result] = await db
        .promise()
        .query("INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)", 
        [title, content, userId]);

    return {
        message: "게시글 생성 완료",
        id: result.insertId,
        userId,
    };
}

async function updatePost({ postId, loginUserId, keys, values}) {
    await assertOwner(postId, loginUserId);

    const setClause = keys.map((k)=> `${k} = ?`).join(", ");
    await db
        .promise()
        .query(`UPDATE posts SET ${setClause} WHERE id = ? AND deletedAt IS NULL` , [...values, postId]);

        return { message: "수정 완료", updatedFields: keys };

}

async function deletePost({ postId, loginUserId }) {
    await assertOwner(postId, loginUserId);

    const [result] = await db
        .promise()
        .query("UPDATE posts SET deletedAt = NOW() WHERE id = ? AND deletedAt IS NULL",
            [postId]
        );

        if (result.affectedRows === 0) {
            throw new AppError("POST_NOT_FOUND", 404, "해당 글이 없습니다.");
        }

        return {message:"삭제 완료"};
    }

async function listPosts({ limit, offset, search, order}) {
    const where = search ? "WHERE deletedAt IS NULL AND title LIKE ?" 
    : "WHERE deletedAt IS NULL";

    const whereParams = search ? [`%${search}%`] : [];

    const [countRows] = await db
        .promise()
        .query(`SELECT COUNT(*) AS total FROM posts ${where}`, whereParams);

    const total = countRows[0]?.total ?? 0;

    const [rows] = await db
        .promise()
        .query(
            `SELECT id, title, content, createdAt, updatedAt, views 
            FROM posts ${where} ORDER BY createdAt ${order} LIMIT ? OFFSET ?`,
            [...whereParams, limit, offset]
        );
        
        const posts = rows || [];
        const hasNext = offset + posts.length < total;

        return {
            meta: {total, limit, offset, hasNext },
            posts,
        };  
}

async function getPostById(id) {
    const [upResult] = await db
        .promise()
        .query(
        `UPDATE posts SET views = views + 1 WHERE id = ? AND deletedAt IS NULL`, 
        [id]
       );

    if (upResult.affectedRows === 0 ){
        throw new AppError("POST_NOT_FOUND", 404, "해당 글이 없습니다.");}

    const [ rows ] = await db.promise().query(
        `SELECT id, title, content, views, createdAt, updatedAt FROM posts
        WHERE id = ? AND deletedAt IS NULL`,
        [id]
    );
    if (rows.length === 0) {
        throw new AppError("POST_NOT_FOUND", 404, "해당 글이 없습니다.");
    }   

    return rows[0];
}

async function toggleLike (postId, userId) {
    if(!Number.isInteger(postId) || postId <= 0) {
        throw new AppError("BAD_REQUEST", 400, "postId가 올바르지 않습니다.");
    }

    const [postRows] = await db
    .promise()
    .query("SELECT id FROM posts WHERE id = ? AND deletedAt IS NULL", [postId]);

    if(postRows.length === 0) {
        throw new AppError("POST_NOT_FOUND", 404, "해당 글이 없습니다");
    }

    const [likeRows] = await db
    .promise()
    .query("SELECT id FROM post_likes WHERE postId = ? AND userId = ?", 
        [postId, userId,]);

    let liked;

    if(likeRows.length > 0) {
        await db
            .promise()
            .query("DELETE FROM post_likes WHERE postId = ? AND userId = ?", 
                [postId, userId,]);
        liked = false;
    } else { 
        try{ await db
                    .promise()
                    .query("INSERT INTO post_likes (postId, userId) VALUES (?, ?)",
                        [postId, userId,]);
        liked = true;
    } catch(err){
        if (err && err.code === "ER_DUP_ENTRY") {
            liked = true;
        } else {
            throw err;
        }
    }
}
    const [countRows] = await db
        .promise()
        .query("SELECT COUNT(*) AS likeCount FROM post_likes WHERE postId = ?", 
            [postId]);
    
    const likeCount = countRows[0]?.likeCount ?? 0;

    return { postId, liked, likeCount };
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    listPosts,
    getPostById,
    toggleLike,
};