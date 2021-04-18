import { Statement } from "@modules/statements/entities/Statement";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";




@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({user_id, sender_id, amount, description, type}: ICreateTransferDTO) {
    const sender = await this.usersRepository.findById(sender_id);
    const receiver = await this.usersRepository.findById(user_id);

    console.log(`Sender ${sender.id}`);
    console.log(`Receiver ${receiver.id}`);
    if(!sender || !receiver) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

      if (balance < amount) {
        throw new CreateTransferError.InsufficientFunds()
      }

    const statementOperation = await this.statementsRepository.createTransfer({
      user_id: receiver.id,
      sender_id: sender.id,
      amount,
      description,
      type
    });

    return statementOperation;

  }
}

export {CreateTransferUseCase}
