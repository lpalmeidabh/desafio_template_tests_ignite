import {Request, Response} from 'express';
import { container } from 'tsyringe';
import {CreateTransferUseCase} from './CreateTransferUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const {user_id} = request.params;
    const { amount, description } = request.body;

    const createTransfer = container.resolve(CreateTransferUseCase);
    const transfer = await createTransfer.execute({
      user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER
    });
    return response.status(201).json(transfer);
  }
}


