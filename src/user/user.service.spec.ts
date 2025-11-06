/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

const mockUser: User = {
  id: "1",
  fullName: "John Doe",
  email: "john@example.com",
  phoneNumber: "1234567890",
  loans: [],
  vehicles: [],
};

describe("UserService", () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

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
    const result = await service.create({
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
    });
    expect(result).toEqual(mockUser);
    expect(repo.create).toHaveBeenCalledWith({
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
    });
    expect(repo.save).toHaveBeenCalled();
  });

  it("should find a user by ID", async () => {
    const result = await service.findOne("1");
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(result).toEqual(mockUser);
  });

  it("should update a user successfully", async () => {
    const result = await service.update("1", {
      fullName: "Updated Name",
      email: "adeyemioduyunrbi@gmail.com",
    });
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(null);
    const result = await service.update("999", {
      fullName: "New",
      email: "",
    });
    expect(result).toBeNull();
  });
});
