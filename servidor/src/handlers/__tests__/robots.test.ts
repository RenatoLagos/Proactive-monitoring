import request from "supertest"
import server from "../../server"


describe('POST /api/robots', () => {
    it('should display validation errors', async () => {
        const response = await request(server)
            .post('/api/robots')
            .send({})

        expect(response.status).toBe(400)
        expect(response.type).toBe('application/json')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors.length).toBe(2)
    })

    it('should create a new robot', async () => {
        const response = await request(server)
            .post('/api/robots')
            .send({
                name: "R2D2",
                status: true
            })

        expect(response.status).toBe(201)
        expect(response.type).toBe('application/json')
        expect(response.body.data.name).toBe('R2D2')
        expect(response.body.data.status).toBe(true)
    })
})

describe('GET /api/robots', () => {
    it('should check if api/robots is working', async () => {
        const response = await request(server)
            .get('/api/robots')
        expect(response.status).not.toBe(404)
    })

    it('should return all robots', async () => {
        const response = await request(server)
            .get('/api/robots')

        expect(response.status).toBe(200)
        expect(response.type).toBe('application/json')
        expect(response.body.data.length).toBe(1)
        expect(response.type).not.toBe('errors')
    })

    it('should catch an error', async () => {
        const path_error = '/api/Robotes'
        const response = await request(server)
            .get(path_error)

        expect(response.status).toBe(404)
    })
})

describe('GET /api/robots/:id', () => {
    it('should return a single robot', async () => {
        const response = await request(server)
            .get('/api/robots/1')

        expect(response.status).toBe(200)
        expect(response.type).toBe('application/json')
        expect(response.body.data.name).toBe('R2D2')
        expect(response.body.data.status).toBe(true)
    })

    it('should return a 404 error if robot is not found', async () => {
        const robotId = 2000
        const response = await request(server)
            .get(`/api/robots/${robotId}`)

        expect(response.status).toBe(404)
        expect(response.type).toBe('application/json')
        expect(response.body.message).toBe('Robot not found')
    })

    it('should check a valid id in the URL', async () => {
        const robotId = 'not-valid-id'
        const response = await request(server)
            .get(`/api/robots/${robotId}`)

        expect(response.status).toBe(400)
        expect(response.type).toBe('application/json')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id not valid')
    })
})

describe('PUT /api/robots/:id', () => {
    it('should update a robot', async () => {
        const response = await request(server)
            .put('/api/robots/1')
            .send({
                name: "C3PO",
                status: false
            })

        expect(response.status).toBe(200)
        expect(response.type).toBe('application/json')
        expect(response.body.data.name).toBe('C3PO')
        expect(response.body.data.status).toBe(false)
    })

    it('should return a 404 error if robot is not found', async () => {
        const robotId = 2000
        const response = await request(server)
            .put(`/api/robots/${robotId}`)
            .send({
                name: "C3PO",
                status: false
            })

        expect(response.status).toBe(404)
        expect(response.type).toBe('application/json')
        expect(response.body.message).toBe('Robot not found')
    })

    it('should check a valid id in the URL', async () => {
        const robotId = 'not-valid-id'
        const response = await request(server)
            .put(`/api/robots/${robotId}`)
            .send({
                name: "C3PO",
                status: false
            })

        expect(response.status).toBe(400)
        expect(response.type).toBe('application/json')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id not valid')
    })
})

describe('PATCH /api/robots/:id', () => {
    it('should update a robot status', async () => {
        const response = await request(server)
            .patch('/api/robots/1')

        expect(response.status).toBe(200)
        expect(response.type).toBe('application/json')
        expect(response.body.data.status).toBe(true)
    })

    it('should return a 404 error if robot is not found', async () => {
        const robotId = 2000
        const response = await request(server)
            .patch(`/api/robots/${robotId}`)

        expect(response.status).toBe(404)
        expect(response.type).toBe('application/json')
        expect(response.body.message).toBe('Robot not found')
    })

    it('should check a valid id in the URL', async () => {
        const robotId = 'not-valid-id'
        const response = await request(server)
            .patch(`/api/robots/${robotId}`)

        expect(response.status).toBe(400)
        expect(response.type).toBe('application/json')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id not valid')
    })
})

describe('DELETE /api/robots/:id', () => {
    it('should delete a robot', async () => {
        const response = await request(server)
            .delete('/api/robots/1')

        expect(response.status).toBe(200)
        expect(response.type).toBe('application/json')
        expect(response.body.message).toBe('Robot deleted')
    })

    it('should return a 404 error if robot is not found', async () => {
        const robotId = 2000
        const response = await request(server)
            .delete(`/api/robots/${robotId}`)

        expect(response.status).toBe(404)
        expect(response.type).toBe('application/json')
        expect(response.body.message).toBe('Robot not found')
    })

    it('should check a valid id in the URL', async () => {
        const robotId = 'not-valid-id'
        const response = await request(server)
            .delete(`/api/robots/${robotId}`)

        expect(response.status).toBe(400)
        expect(response.type).toBe('application/json')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id not valid')
    })
})

