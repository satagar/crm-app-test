const request = require('supertest');
const app = require("../../server");
const db = require('../db')

beforeAll(async () => await db.clearDatabase())
afterAll(async () => {
    await db.closeDatabase();
    app.close();
})

const api_endpoint = "/crm/api/v1/";

const testPayload = {
    userType: "CUSTOMER",
    password: "12345678",
    name: "Test",
    userId: 2,
    email: "test@relevel.com",
    ticketsCreated: [],
    ticketsAssigned: []
}

describe('Post Signup Endpoints', () => {
    it('should signUp', async () => {
        const res = await request(app)
            .post(api_endpoint + 'auth/signup')
            .send(testPayload);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                "email": "test@relevel.com",
                "name": "Test",
                "userId": "2",
                "userStatus": "APPROVED",
                "userType": "CUSTOMER"
            })
        );
    })
})

describe('Post Signin Endpoints', () => {
    it('should signin', async () => {
        const res = await request(app)
            .post(api_endpoint + 'auth/signin')
            .send(testPayload);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                "email": "test@relevel.com",
                "name": "Test",
                "userId": "2",
                "userStatus": "APPROVED",
                "userType": "CUSTOMER"
            })
        );
    })
})