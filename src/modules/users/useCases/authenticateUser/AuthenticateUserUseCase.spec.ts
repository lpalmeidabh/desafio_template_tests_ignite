import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AppError } from '@shared/errors/AppError';
import authConfig from '../../../../config/auth';
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(async() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);


    const user = await createUserUseCase.execute({
      name: 'User 1',
      email: 'user1@finapi.com.br',
      password: 'user1'
    });
  });

  it('should be able to authenticate a valid user', async () => {
    const response = await authenticateUserUseCase.execute({
      email: 'user1@finapi.com.br',
      password: 'user1',
    });
    expect(response).toHaveProperty('token');
  });

  it('should be able to authenticate an user with invalid user', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'user2@finapi.com.br',
        password: 'user2',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate an user with invalid password', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'user@finapi.com.br',
        password: 'user2',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
