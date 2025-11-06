import { ApiProperty } from "@nestjs/swagger";
import {
  IsUUID,
  IsString,
  IsEmail,
  IsNumber,
  Min,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateLoanDto {
  @ApiProperty({ example: "a6c4a2e8....", description: "Vehicle id (UUID)" })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ example: "Jane Doe" })
  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @ApiProperty({ example: "jane@example.com" })
  @IsEmail()
  applicantEmail: string;

  @ApiProperty({ example: 10000 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  requestedAmount: number;
}
