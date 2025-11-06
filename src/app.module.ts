/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConfigModule } from "@nestjs/config";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./config/orm.config";
import { VehicleModule } from "./vehicle/vehicle.module";
import { LoanModule } from "./loan/loan.module";
import { ValuationModule } from "./valuation/valuation.module";
import { UserModule } from "./user/user.module";
import { OfferModule } from "./offer/offer.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RequestLoggerMiddleware } from "./middleware/request-logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormConfig),
    VehicleModule,
    LoanModule,
    ValuationModule,
    UserModule,
    OfferModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
