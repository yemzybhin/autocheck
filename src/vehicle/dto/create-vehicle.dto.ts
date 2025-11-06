import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateVehicleDto {
  @ApiProperty({
    example: "1HGCM82633A004352",
    description: "Vehicle VIN (11-17 chars)",
  })
  @IsString()
  @IsNotEmpty()
  vin: string;

  @ApiProperty({ example: "Honda" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  make: string;

  @ApiProperty({ example: "Accord" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  model: string;

  @ApiProperty({ example: 2018 })
  @Type(() => Number)
  @IsNumber()
  @Min(1886)
  year: number;

  @ApiProperty({ example: 54000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  mileage: number;
}
