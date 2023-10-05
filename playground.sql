\c nc_news_test

SELECT * FROM articles;
<<<<<<< HEAD
SELECT * FROM comments
=======

SELECT articles.author, title, articles.article_id, topic, articles.body, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id;
>>>>>>> main
