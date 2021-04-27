import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Create Statement Operation', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuidV4();
    const password = await hash('usr123', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at) VALUES ('${id}', 'User', 'user@test.com.br', '${password}', 'now()')`,
    );

  });

  it('should be able to create a statement deposit', async () => {

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'user@test.com.br',
      password: 'usr123',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        description: "Deposito",
        amount: 300.00
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should be able to create a statement withdraw', async () => {

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'user@test.com.br',
      password: 'usr123',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        description: "Saque",
        amount: 200.00
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a statement withdraw if has no funds', async () => {

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'user@test.com.br',
      password: 'usr123',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        description: "Saque",
        amount: 200.00
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });



  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });


});
