/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "dotenv/config";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { VehicleService } from "./vehicle/vehicle.service";
import { CreateVehicleDto } from "./vehicle/dto/create-vehicle.dto";
import configuration from "./config/configuration";

const config = configuration();
const port = config.port || 3000;

async function seedVehicles(app) {
  const svc = app.get(VehicleService);

  try {
    const existing = await svc.findAll();
    if (existing.length === 0) {
      console.log("Auto-seeding sample vehicles...");
      const samples: CreateVehicleDto[] = [
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
      for (const v of samples) {
        await svc.create(v);
      }
      console.log("✅ Vehicle seeding complete");
    }
  } catch (err: any) {
    console.error("Vehicle seeding failed:", err.message || err.toString());
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Autochek Backend Test API")
    .setDescription("Vehicle valuation and loan processing endpoints")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await seedVehicles(app);
  await app.listen(port);
  Logger.log(`Server running at http://localhost:${port}`);
  Logger.log(`Swagger Docs at http://localhost:${port}/docs`);
}

bootstrap();
