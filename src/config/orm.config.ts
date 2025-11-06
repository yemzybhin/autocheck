import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Vehicle } from "../vehicle/entities/vehicle.entity";
import { Loan } from "../loan/entities/loan.entity";
import { Valuation } from "../valuation/entities/valuation.entity";
import { Offer } from "../offer/entities/offer.entity";
import { User } from "../user/entities/user.entity";

export const ormConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database: ":memory:",
  entities: [Vehicle, Loan, Valuation, Offer, User],
  synchronize: true,
};
