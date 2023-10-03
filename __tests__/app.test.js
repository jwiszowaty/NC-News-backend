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