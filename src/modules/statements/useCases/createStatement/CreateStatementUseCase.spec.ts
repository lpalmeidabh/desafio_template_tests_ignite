import {InMemoryStatementsRepository} from '../../repositories/in-memory/InMemoryStatementsRepository'
import {InMemoryUsersRepository} from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';

import { AppError } from '../../../../shared/errors/AppError'


let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Show User Profile', () => {
  beforeEach(async() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)



  });

  it('should be able to create user statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User 1',
      email: 'user1@finapi.com.br',
      password: 'user1'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 123.00,
      description: "Description",
      type: OperationType.DEPOSIT,
    });
    expect(statement).toHaveProperty('id');

  });

  it('should not be able to withdraw without funds', async () => {
    expect(async() => {
      const user = await inMemoryUsersRepository.create({
        name: 'User 1',
        email: 'user1@finapi.com.br',
        password: 'user1'
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id,
        amount: 123.00,
        description: "Description",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(AppError);



  });

  // it('should not be able to open user invalid profile', async () => {
  //   expect(async () => {

  //     const profile = await showUserProfileUseCase.execute('123345');
  //   }).rejects.toBeInstanceOf(AppError);
  // });


});
