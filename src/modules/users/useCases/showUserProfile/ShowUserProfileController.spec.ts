import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('User Profile', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuidV4();
    const password = await hash('usr123', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at) VALUES ('${id}', 'User', 'user@test.com.br', '${password}', 'now()')`,
    );

  });

  it('should be able to show user profile', async () => {

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'user@test.com.br',
      password: 'usr123',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  });



  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });


});
