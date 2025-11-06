import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class ValuationRequestDto {
  @ApiProperty({ example: "1HGCM82633A004352" })
  @IsString()
  vin: string;

  @ApiProperty({ example: "Toyota", required: false })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiProperty({ example: "Corolla", required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: "2018", required: false })
  @IsOptional()
  @IsString()
  year?: string;
}
