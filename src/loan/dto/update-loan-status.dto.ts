import { IsString, IsIn } from "class-validator";
import type { LoanStatus } from "../entities/loan.entity";

export class UpdateLoanStatusDto {
  @IsString()
  @IsIn([
    "pending",
    "approved",
    "rejected",
    "offered",
    "disbursed",
    "cancelled",
  ])
  status: LoanStatus;
}
