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

describe('GET /api/topics', () => {
    it('return status 200', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
    })

    it('response has the correct number of topic objects i.e. contains all the topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.message).toHaveLength(3)
        })
    })

    it('404 Not Found when route does not exist', () => {
        return request(app)
        .get('/api/topic')
        .expect(404)
    })
})