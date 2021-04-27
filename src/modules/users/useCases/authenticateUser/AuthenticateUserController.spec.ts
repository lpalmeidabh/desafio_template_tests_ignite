import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../../../../app';
import createConnection from '../../../../database';
let connection: Connection;

describe('Authenticate User', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuidV4();
    const password = await hash('usr123', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at) VALUES ('${id}', 'Usuario', 'usuario@teste.com.br', '${password}', 'now()')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate an existent user', async () => {


    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'usuario@teste.com.br',
        password: 'usr123',
      });

    expect(response.status).toBe(200);
  });

  it('should not be able to authenticate a non existent user or with wrong password', async () => {


    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'usuario@teste.com.br',
        password: 'usr1233',
      });

    expect(response.status).toBe(401);
  });
});
