/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { errorResponse, successResponse } from "src/common/utils/response.util";

@ApiTags("Users")
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new user",
    description:
      "Creates a new user with name, email, and optional phone number. Returns the created user.",
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: "Example user creation",
        value: {
          name: "Jane Doe",
          email: "jane@example.com",
          phone: "08123456789",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    schema: {
      example: {
        status: "success",
        message: "User created successfully",
        data: {
          id: "uuid",
          name: "Jane Doe",
          email: "jane@example.com",
          phone: "08123456789",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data or duplicate email",
    schema: {
      example: {
        status: "error",
        message: "Email already exists",
      },
    },
  })
  async create(@Body() body: CreateUserDto) {
    try {
      const user = await this.userService.create(body);
      return successResponse("User created successfully", user);
    } catch (error: Error | any) {
      return errorResponse(
        "Unable to create user" + (error.message ? `: ${error.message}` : ""),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(":id")
  @ApiOperation({
    summary: "Fetch a user by ID",
    description:
      "Retrieves a single user record using its unique ID. Returns detailed user information.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Unique identifier of the user",
    example: "8e3a98ef-b7e1-45f0-95a8-c1a26f4c5121",
  })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: User,
    schema: {
      example: {
        status: "success",
        message: "User fetched successfully",
        data: {
          id: "uuid",
          name: "Jane Doe",
          email: "jane@example.com",
          phone: "08123456789",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
    schema: {
      example: {
        status: "error",
        message: "User with ID 8e3a98ef-b7e1-45f0-95a8-c1a26f4c5121 not found",
      },
    },
  })
  async get(@Param("id") id: string) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return errorResponse(
          `User with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return successResponse("User fetched successfully", user);
    } catch (error) {
      this.logger.error(`Error fetching user with id ${id}`, error.stack);
      if (error instanceof HttpException) throw error;
      return errorResponse(
        "Unable to fetch user" + (error.message ? `: ${error.message}` : ""),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update an existing user",
    description:
      "Updates user details (name, email, or phone). Returns the updated user record.",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Unique identifier of the user",
    example: "8e3a98ef-b7e1-45f0-95a8-c1a26f4c5121",
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      updateExample: {
        summary: "Partial user update",
        value: {
          name: "Jane D.",
          phone: "08100002222",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    schema: {
      example: {
        status: "success",
        message: "User updated successfully",
        data: {
          id: "uuid",
          name: "Jane D.",
          email: "jane@example.com",
          phone: "08100002222",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
    schema: {
      example: {
        status: "error",
        message: "User with ID 8e3a98ef-b7e1-45f0-95a8-c1a26f4c5121 not found",
      },
    },
  })
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    try {
      const updated = await this.userService.update(id, body);
      if (!updated) {
        return errorResponse(
          `User with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return successResponse("User updated successfully", updated);
    } catch (error) {
      this.logger.error(`Error updating user with id ${id}`, error.stack);
      if (error instanceof HttpException) throw error;
      return errorResponse(
        "Unable to update user" + (error.message ? `: ${error.message}` : ""),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
