import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from '../showUserProfile/ShowUserProfileUseCase'
import { AppError } from '@shared/errors/AppError';


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile', () => {
  beforeEach(async() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)


    const user = await createUserUseCase.execute({
      name: 'User 1',
      email: 'user1@finapi.com.br',
      password: 'user1'
    });
  });

  it('should be able to open user profile', async () => {
    const authResponse = await authenticateUserUseCase.execute({
      email: 'user1@finapi.com.br',
      password: 'user1',
    });
    const {id} = authResponse.user;
    const profile = await showUserProfileUseCase.execute(id);
  });

  it('should not be able to open user invalid profile', async () => {
    expect(async () => {

      const profile = await showUserProfileUseCase.execute('123345');
    }).rejects.toBeInstanceOf(AppError);
  });


});
