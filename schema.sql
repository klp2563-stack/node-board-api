CREATE DATABASE IF NOT EXISTS board_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE class101;

-- users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- posts (views, deletedAt 추가)
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT,
  views INT NOT NULL DEFAULT 0,
  deletedAt DATETIME NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_posts_user
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_posts_userId (userId),
  INDEX idx_posts_deletedAt_createdAt (deletedAt, createdAt)
) ENGINE=InnoDB;

-- post_likes (toggleLike 용)
CREATE TABLE IF NOT EXISTS post_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postId INT NOT NULL,
  userId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_post_likes_post
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_likes_user
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE KEY uq_post_user (postId, userId),
  INDEX idx_post_likes_postId (postId),
  INDEX idx_post_likes_userId (userId)
) ENGINE=InnoDB;
