import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

describe("UserService", () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: "1",
    fullName: "yemi sam",
    email: "adeyemi@samuel.com",
    phoneNumber: "1234567890",
    loans: [],
    vehicles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            findOneBy: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a user", async () => {
    const dto: CreateUserDto = { name: "John", email: "john@example.com" };
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it("should find a user by ID", async () => {
    const result = await service.findOne("1");
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(result).toEqual(mockUser);
  });

  it("should update a user successfully", async () => {
    const dto: UpdateUserDto = { name: "Jane" };
    repo.findOne.mockResolvedValueOnce(mockUser);
    const result = await service.update("1", dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    repo.findOne.mockResolvedValueOnce(null);
    const result = await service.findOne("nonexistent");
    expect(result).toBeNull();
  });
});
