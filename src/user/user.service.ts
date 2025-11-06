import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async findOne(id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;
    Object.assign(user, data);
    return await this.repo.save(user);
  }
}
