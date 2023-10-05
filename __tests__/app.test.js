const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const request = require('supertest')
const app = require('../db/app')
const db = require("../db/connection")

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
describe('GET /api', () => {
    it('return status 200 and the list of endpoints available', () => {
        request(app)
        .get('/api')
        .expect(200)
            .then(({ body }) => {
            expect(Object.keys(body.endpoints)).toHaveLength(4)
            expect(Object.keys(body.endpoints)).toEqual([ 'GET /api', 'GET /api/topics', 'GET /api/articles/:article_id', 'GET /api/articles/:article_id/comments' ])
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
        expect(body.article).toStrictEqual(article_1)
    
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
    it('return status 404 when article_id does not exist', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("No comments found for this article")
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
    it('returns status 400, when either body or author is missing', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({author: 'butter_bridge'})
        .expect(400)
        .then(({body}) => {
           expect(body.msg).toBe('Failing row contains')
        })
    })
})