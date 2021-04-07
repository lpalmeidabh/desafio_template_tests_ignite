import {InMemoryStatementsRepository} from '../../repositories/in-memory/InMemoryStatementsRepository'
import {InMemoryUsersRepository} from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import {GetStatementOperationUseCase} from './GetStatementOperationUseCase';

import { AppError } from '../../../../shared/errors/AppError'


let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  });

  it('should be able to get an users statement', async () => {
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

    const operation = await getStatementOperationUseCase.execute({user_id: user.id, statement_id: statement.id});
    expect(operation).toHaveProperty('id');

  });

});
