const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const request = require('supertest')
const app = require('../app')
const db = require("../connection")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe('WRONG ROUTE - 404', () => {
    it('404 when route does not exist', () => {
        return request(app)
        .get('/api/notAValidPath')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('No such path...\n...yet');
        })
    })
})
describe('GET /api/topics', () => {
    it('returns status 200 and the correct number of topic objects i.e. contains all the topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body.topics).toHaveLength(3)
        })
    })
})
describe('GET /api/articles/:article_id', () => {
    it('returns status 200 and the article requested', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            const article_1 = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 100,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
            expect(body.article).toMatchObject(article_1)
        })
    })
    it("returns status 404 when id does not correspond to an existing article_id", () => {
        return request(app)
        .get('/api/articles/17')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Article not found")
        })
    })
    it('returns status 400 when article_id is not an integer', () => {
        return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid input")
        })
    })
})
describe('GET /api/articles', () => {
    it('returns status 200 and list of all articles in test DB in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
            .then(({ body }) => {
            const testBody = []
            const articleExample = {
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            }
            expect(body.articles).toHaveLength(13)
            expect(body.articles).toBeSortedBy('created_at', { descending: true })
            expect(body.articles).not.toHaveLength(0)
            body.articles.forEach((article) => {
                expect(article).not.toHaveProperty('body')
                expect(article).toMatchObject(articleExample)
            })
        })
    })
})
describe('GET /api/articles/:article_id/comments', () => {
    it('return status 200 and an array of comments for the given article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const expectedKeys = ["comment_id", "votes", "created_at", "author", "body", "article_id"]
            expect(body.comments).toBeSortedBy("created_at", { descending: true })
            expect(body.comments).not.toHaveLength(0)
            body.comments.forEach((comment) => {
                expect(Object.keys(comment)).toEqual(expect.arrayContaining(expectedKeys))
            })
        })
    })
    it('return status 200 even when there are no comments for an existing article', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toEqual([]);
        })
    })
    it('return status 404 when article_id does not exist', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Article not found")
        })
    })
    it('return status 400 when passed article_id is not integer', () => {
        return request(app)
        .get('/api/articles/not-an-id/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid input")
        })
    })
})
describe('POST /api/articles/:article_id/comments', () => {
    it('returns status 201, added comment and adds comment object to table comments', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({body:'NEW COMMENT', author: 'butter_bridge'})
        .expect(201)
        .then(({ body }) => {
            const newCommentObject = {
                comment_id: 19,
                body: 'NEW COMMENT',
                article_id: 1,
                author: 'butter_bridge',
                votes: 0,
                created_at: expect.any(String)
            }
            expect(body.comment).toMatchObject(newCommentObject)
        })
    })
    it('returns status 400 when either body or author is missing', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({author: 'butter_bridge'})
        .expect(400)
        .then(({body}) => {
           expect(body.msg).toBe('Failing row contains')
        })
    })
    it('returns status 404 when author does not exist', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({body:'NEW COMMENT', author: 'brigitte'})
        .expect(404)
        .then(({body}) => {
           expect(body.msg).toBe('User not found')
        })
    })
    it('returns status 404 when article does not exist', () => {
        return request(app)
        .post('/api/articles/9999/comments')
        .send({body:'NEW COMMENT', author: 'butter_bridge'})
        .expect(404)
        .then(({body}) => {
           expect(body.msg).toBe('Article not found')
        })
    })
    it('return status 400 when passed article_id is not integer', () => {
        return request(app)
        .post('/api/articles/not-an-id/comments')
        .send({body:'NEW COMMENT', author: 'butter_bridge'})
        .expect(400)
        .then(({body}) => {
           expect(body.msg).toBe('Invalid input')
        })
    })
    it('return status 201 when body contains extra/unnecessary keys', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({body:'NEW COMMENT', extra:"extra", author: 'butter_bridge'})
        .expect(201)
        .then(({ body }) => {
            const newCommentObject = {
                comment_id: 19,
                body: 'NEW COMMENT',
                article_id: 1,
                author: 'butter_bridge',
                votes: 0,
                created_at: expect.any(String)
            }
            expect(body.comment).toMatchObject(newCommentObject)
        })
    })
})
describe('PATCH /api/articles/:article_id', () => {
    it('returns status 200 and the article and updates the votes number', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_vote: 1 })
        .expect(200)
            .then(({ body }) => {
            expect(body.updatedArticle.votes).toBe(101)
        })
    })
    it('returns status 200 and body contain extra/unnecessary keys', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_vote: 1, extra: "extra" })
        .expect(200)
            .then(({ body }) => {
            expect(body.updatedArticle.votes).toBe(101)
        })
    })
    it("returns status 404 when id does not correspond to an existing article_id", () => {
        return request(app)
        .get('/api/articles/9999')
        .send({ inc_vote: 1 })
        .expect(404)
            .then(({ body }) => {
            expect(body.msg).toBe("Article not found")
        })
    })
    it("returns status 404 when article_id is not an integer", () => {
        return request(app)
        .get('/api/articles/not-an-id')
        .send({ inc_vote: 1 })
        .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe("Invalid input")
        })
    })
    it('returns status 400 when the body has missing incomplete/missing data', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Failing row contains')
        })
    })
    it('returns status 400 when inc_vote is not an integer', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_vote: 'not-a-number' })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input')
        })
    })
})
describe('DELETE /api/comments/:comment_id', () => {
    it('returns status 204, deletes a specific comment by its id and returns no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({body}) => {
           expect(body).toEqual({})
        })
    })
    it('returns status 404 when comment does not exist', () => {
        return request(app)
        .delete('/api/comments/99999')
        .expect(404)
        .then(({body}) => {
           expect(body.msg).toEqual('Comment not found')
        })
    })
    it('returns status 400 when comment_id is not an integer', () => {
        return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)
        .then(({body}) => {
           expect(body.msg).toEqual('Invalid input')
        })
    })
})
describe('GET /api/users', () => {
    it('returns status 200 and array of user objects with the follwoing keys: username, name, avatar_url', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const userExample = {
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
            }
            expect(body.users).not.toHaveLength(0)
            body.users.forEach((user) => {
                expect((user)).toEqual(expect.objectContaining(userExample))
            })
        })
    })
})
describe('QUERY = topic GET /api/articles', () => {
    it('returns 200 and returns articles of specific topic', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
        expect(body.articles).not.toHaveLength(0)
        body.articles.forEach((article) => {
            expect(article).toEqual(expect.objectContaining({topic: "mitch"}))
        })
        })
    })
    it('returns 404 when there are no articles associated with a topic not in DB', () => {
        return request(app)
        .get('/api/articles?topic=climate')
        .expect(404)
            .then(({body}) => {
            expect(body.msg).toEqual('No articles found on this topic')
        })
    })
    it('returns 404 when there are no articles associated with a topic exisiting in DB', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(404)
            .then(({ body }) => {
            expect(body.msg).toEqual('No articles found on this topic')
        })
    })
})
describe('comment_count GET /api/articles/:article_id', () => {
    it('returns 200 and article object with comment_count for the article', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
            .then(({ body }) => {
            expect(body.article).toEqual(expect.objectContaining({ comment_count: expect.any(Number) }))
            expect(body.article.comment_count).toBe(11)
        })
    })    
    it('returns 200 and article object with comment_count for article with no comments', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual(expect.objectContaining({ comment_count: expect.any(Number) }))
            expect(body.article.comment_count).toBe(0)
        })
    })
}) 
describe('SORTING QUERY by any real column,  GET /api/articles', () => {
    it('returns 200 and returns articles ordered by created_at in desc order by default', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
        expect(body.articles).not.toHaveLength(0)
        expect(body.articles).toBeSortedBy('created_at', { descending: true })
        })
    })
    it('returns 200 and returns articles ordered by created_at  in asc', () => {
        return request(app)
        .get('/api/articles?order=ASC')
        .expect(200)
        .then(({ body }) => {
        expect(body.articles).not.toHaveLength(0)
        expect(body.articles).toBeSortedBy('created_at', { descending: false })
        })
    })
    it('returns 200 and returns articles ordered by comment_count  in desc order', () => {
        return request(app)
        .get('/api/articles?sort_by=comment_count')
        .expect(200)
        .then(({ body }) => {
        expect(body.articles).not.toHaveLength(0)
        expect(body.articles).toBeSortedBy('comment_count', { descending: true })
        })
    })
    it('returns 200 and returns articles ordered by comment_count  in asc order', () => {
        return request(app)
        .get('/api/articles?sort_by=comment_count&order=ASC')
        .expect(200)
        .then(({ body }) => {
        expect(body.articles).not.toHaveLength(0)
        expect(body.articles).toBeSortedBy('comment_count', { descending: false })
        })
    })
    it('returns 400 when sort-by query does not correspond to any exsiting catgeory of the table', () => {
        return request(app)
        .get('/api/articles?sort_by=animals')
        .expect(400)
            .then(({body}) => {
            expect(body.msg).toEqual('Invalid category')
        })
    })
})
describe('GET /api', () => {
    it('return status 200 and the list of endpoints available', () => {
        request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            const endpoints = {
                "GET /api": expect.any(Object),
                "GET /api/topics": expect.any(Object),
                "GET /api/articles/:article_id" : expect.any(Object),
                "GET /api/articles" : expect.any(Object),
                "GET /api/articles/:article_id/comments" : expect.any(Object),
                "POST /api/articles/:article_id/comments": expect.any(Object),
                'GET /api/users': expect.any(Object)
            }
            expect(body.endpoints).toEqual(expect.objectContaining(endpoints))
        })
    })
})
