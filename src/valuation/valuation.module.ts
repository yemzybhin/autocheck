import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ValuationController } from "./valuation.controller";
import { ValuationService } from "./valuation.service";
import { VinLookupProvider } from "./integrations/vin-lookup.provider";
import { Valuation } from "./entities/valuation.entity";
import { Vehicle } from "../vehicle/entities/vehicle.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Valuation, Vehicle])],
  controllers: [ValuationController],
  providers: [ValuationService, VinLookupProvider],
  exports: [ValuationService],
})
export class ValuationModule {}
