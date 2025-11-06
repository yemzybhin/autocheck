import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Loan } from "./entities/loan.entity";
import { Vehicle } from "../vehicle/entities/vehicle.entity";
import { LoanService } from "./loan.service";
import { LoanController } from "./loan.controller";
import { ValuationModule } from "../valuation/valuation.module";

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Vehicle]), ValuationModule],
  controllers: [LoanController],
  providers: [LoanService],
  exports: [LoanService],
})
export class LoanModule {}
