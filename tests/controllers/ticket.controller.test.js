const { mockRequest, mockResponse } = require("../interceptor")
const { createTicket, getAllTickets, getOneTicket, updateTicket } = require('../../controllers/ticket.controller')
const User = require("../../models/user.model");
const Ticket = require("../../models/ticket.model");
const client = require("../../utils/NotificationClient").client;
const db = require('../db')

beforeAll(async () => await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())

const ticketCreateTestPayload = {
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status: "OPEN",
    reporter: 1,
    assignee: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
}


xdescribe('ticketController', () => {
    it("should pass", async () => {
        // Arrange
        const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(userTestPayload));
        const clientSpy = jest.spyOn(client, 'post').mockImplementation((url, args, cb) => cb("Test", null));
        const req = mockRequest();
        const res = mockResponse();
        req.body = ticketCreateTestPayload;
        req.userId = 1;

        // Act
        await createTicket(req, res);

        // Assert
        expect(userSpy).toHaveBeenCalled();
        expect(clientSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                assignee: 1,
                description: "Test",
                reporter: 1,
                status: "OPEN",
                ticketPriority: 4,
                title: "Test",
            })
        );
    })

})