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
            expect(body.message).toHaveLength(3)
        })
    })
})
describe('GET /api', () => {
    it('return status 200 and the list of endpoints available', () => {
        request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(Object.keys(body.endpoints)).toHaveLength(3)
            expect(Object.keys(body.endpoints).includes('GET /api')).toBe(true)
            expect(Object.keys(body.endpoints).includes('GET /api/topics')).toBe(true)
            expect(Object.keys(body.endpoints).includes('GET /api/articles')).toBe(true)
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    it('returns status 200 and the article requested', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article_request).toHaveLength(1)
            expect(Object.keys(body.article_request[0]).includes('author')).toBe(true)
            expect(Object.keys(body.article_request[0]).includes('title')).toBe(true)
            expect(Object.keys(body.article_request[0]).includes('article_id')).toBe(true)
            expect(Object.keys(body.article_request[0]).includes('body')).toBe(true)
            expect(Object.keys(body.article_request[0]).includes('topic')).toBe(true)
            expect(Object.keys(body.article_request[0]).includes('created_at')).toBe(true)
            expect(Object.keys(body.article_request[0]).includes('votes')).toBe(true)
            expect(Object.keys(body.article_request[0]).includes('article_img_url')).toBe(true)
        })
    })
    it('returns status 404 when id does not correspond to an existing article_id', () => {
        return request(app)
        .get('/api/articles/17')
        .expect(404)
        .then((result) => {
            const {msg} = JSON.parse(result.error.text)
            expect(msg).toBe('No articles found')
        })
    })
    it('returns status 400 when article_id is not an integer', () => {
        return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then((result) => {
            const {msg} = JSON.parse(result.error.text)
            expect(msg).toBe('Invalid input')
        })
    })
})