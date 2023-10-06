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

describe('errors - 404', () => {
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
            created_at: '2020-07-09T20:11:00.000Z',
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
            expect(body.msg).toBe("No articles found")
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
                const articleExample = {
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String)
                }
                expect(body.articles).toHaveLength(13)
                expect(body.articles).toBeSortedBy('created_at', { descending: true })
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
            expect(body.msg).toBe("No articles found")
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
                    "DELETE /api/comments/:comment_id": expect.any(Object)
                }
            expect(body.endpoints).toEqual(expect.objectContaining(endpoints))
        })
    })
})