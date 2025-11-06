import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vehicle } from "./entities/vehicle.entity";
import { VehicleService } from "./vehicle.service";
import { VehicleController } from "./vehicle.controller";
import { ValuationModule } from "../valuation/valuation.module"; // 👈 import the module

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), ValuationModule],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
