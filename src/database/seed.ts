import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { User } from "../user/entities/user.entity";
import { Vehicle } from "../vehicle/entities/vehicle.entity";
import { Loan } from "../loan/entities/loan.entity";
import { Offer } from "../offer/entities/offer.entity";
import { Valuation } from "../valuation/entities/valuation.entity";

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const userRepo = (await import("typeorm")).getRepository(User);
  const vehicleRepo = (await import("typeorm")).getRepository(Vehicle);
  const loanRepo = (await import("typeorm")).getRepository(Loan);
  const offerRepo = (await import("typeorm")).getRepository(Offer);
  const valRepo = (await import("typeorm")).getRepository(Valuation);

  const user = userRepo.create({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "08012345678",
  });
  await userRepo.save(user);

  const vehicle = vehicleRepo.create({
    vin: "1HGCM82633A004352",
    make: "Honda",
    model: "Accord",
    year: 2018,
    mileage: 70000,
    owner: user,
  });
  await vehicleRepo.save(vehicle);

  const val = valRepo.create({
    vehicle,
    estimatedValue: 12000,
    source: "simulated",
    details: { note: "seed simulated valuation" },
  });
  await valRepo.save(val);

  const loan = loanRepo.create({
    vehicle,
    vehicleId: vehicle.id,
    user,
    userId: user.id,
    amountRequested: 8000,
    termMonths: 36,
    status: "pending",
  });
  await loanRepo.save(loan);

  const offer = offerRepo.create({
    loan,
    offerAmount: 7500,
    interestRate: 12.5,
    tenureMonths: 36,
    status: "pending",
  });
  await offerRepo.save(offer);

  await app.close();
  console.log("Seeding complete");
}

seed().catch((e) => {
  console.error("Seed failed", e);
  process.exit(1);
});
