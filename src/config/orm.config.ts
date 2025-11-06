import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Vehicle } from "../vehicle/entities/vehicle.entity";
import { Loan } from "../loan/entities/loan.entity";

export const ormConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database: ":memory:",
  entities: [Vehicle, Loan],
  synchronize: true,
};
