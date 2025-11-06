import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { VehicleService } from "../vehicle/vehicle.service";

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const vehicleSvc = app.get(VehicleService);

  const sample = [
    {
      vin: "1HGCM82633A004352",
      make: "Honda",
      model: "Accord",
      year: 2018,
      mileage: 54000,
    },
    {
      vin: "3N1AB7AP6HY256789",
      make: "Nissan",
      model: "Sentra",
      year: 2017,
      mileage: 72000,
    },
    {
      vin: "WBA3A5G57FNS12345",
      make: "BMW",
      model: "3 Series",
      year: 2015,
      mileage: 90000,
    },
  ];

  console.log("Seeding vehicles...");
  for (const v of sample) {
    try {
      await vehicleSvc.create(v as any);
      console.log("Inserted", v.vin);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Skip", v.vin, err.message);
      } else {
        console.log("Skip", v.vin, String(err));
      }
    }
  }

  await app.close();
  console.log("Seeding complete");
}

seed().catch((e) => {
  console.error("Seed failed", e);
  process.exit(1);
});
