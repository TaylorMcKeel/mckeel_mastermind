import  request from 'supertest';
import app from '../server.js';

describe('Test GET, POST, and DELETE requests', () => {
  test('GET /api/games should return 200', async () => {
    const response = await request(app).get('/api/games');
    expect(response.status).toBe(200);
  });

  test('POST /api/resource should return 201', async () => {
    const response = await request(app)
      .post('/api/games')
      .send({
        numbers: ['1', '2', '3', '4'],
        plays: 0,
        prevPlays: [],
      });
    expect(response.status).toBe(201);
  });

  test('DELETE /api/resource/:id should return 204', async () => {
    const response = await request(app).delete(`/api/games`);
    expect(response.status).toBe(204);
  });
});