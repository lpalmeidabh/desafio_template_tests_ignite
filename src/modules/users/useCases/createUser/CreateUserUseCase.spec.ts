import {InMemoryUsersRepository} from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { AppError } from '@shared/errors/AppError';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
    );
  });

  it('should be able to create a new user', async () => {

    const user = await createUserUseCase.execute({
      name: 'User 1',
      email: 'user1@finapi.com.br',
      password: 'user1'
    });


    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a duplicate user', async () => {
    expect(async() => {
       await createUserUseCase.execute({
        name: 'User 1',
        email: 'user1@finapi.com.br',
        password: 'user1'
      });
      await createUserUseCase.execute({
        name: 'User 1',
        email: 'user1@finapi.com.br',
        password: 'user1'
      });
    }).rejects.toBeInstanceOf(AppError)
  });
});
