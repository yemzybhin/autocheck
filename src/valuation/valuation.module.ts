import { Module } from "@nestjs/common";
import { ValuationController } from "./valuation.controller";
import { ValuationService } from "./valuation.service";
import { VinLookupProvider } from "./integrations/vin-lookup.provider";

@Module({
  controllers: [ValuationController],
  providers: [ValuationService, VinLookupProvider],
  exports: [ValuationService],
})
export class ValuationModule {}
