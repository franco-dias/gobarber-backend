import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('E-mail address already used.');
    }

    const passwordHash = await hash(password, 8);

    const user = userRepository.create({
      email,
      password: passwordHash,
      name,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
