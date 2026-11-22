import request from 'supertest';

// Registers a fresh user and returns a supertest agent that carries the auth cookie on later requests.
export async function loggedInAgent(app, email = `user-${crypto.randomUUID()}@test.com`, password = "password123") {
    const agent = request.agent(app);
    const response = await agent.post('/api/auth/register').send({email, password});
    if(response.status !== 201) {
        throw new Error(`Test registration failed: ${response.status} ${JSON.stringify(response.body)}`);
    }
    return {agent, user: response.body.data};
}
