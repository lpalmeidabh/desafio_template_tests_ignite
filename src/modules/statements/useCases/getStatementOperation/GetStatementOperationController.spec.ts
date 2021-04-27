import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Get Statement Operation', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuidV4();
    const password = await hash('usr123', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at) VALUES ('${id}', 'User', 'user@test.com.br', '${password}', 'now()')`,
    );

  });



  it('should be able to get a statement operation by id', async () => {

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'user@test.com.br',
      password: 'usr123',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        description: "Deposito",
        amount: 200.00
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      const statementResponse = await request(app)
      .get(`/api/v1/statements/${response.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });


    expect(statementResponse.status).toBe(200);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });


});
