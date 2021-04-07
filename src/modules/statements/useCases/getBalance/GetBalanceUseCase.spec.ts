import {InMemoryStatementsRepository} from '../../repositories/in-memory/InMemoryStatementsRepository'
import {InMemoryUsersRepository} from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import {GetBalanceUseCase} from './GetBalanceUseCase';

import { AppError } from '../../../../shared/errors/AppError'


let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
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
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  });

  it('should be able to get an users balance', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User 1',
      email: 'user1@finapi.com.br',
      password: 'user1'
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 123.00,
      description: "Description",
      type: OperationType.DEPOSIT,
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 23.00,
      description: "Description",
      type: OperationType.WITHDRAW,
    });
    const balance = await getBalanceUseCase.execute({user_id: user.id})

    expect(balance).toHaveProperty('balance');

  });

});
