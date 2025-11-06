# Autochek Backend Technical Test

A backend API built with **NestJS**, **TypeORM**, and **SQLite**, implementing **vehicle valuation**, **loan processing**, **user management**, and **offers** for Autochek’s automotive and financial services.

This project demonstrates:
- Modular backend architecture with clear domain separation
- Real-time **VIN-based vehicle valuation** via **RapidAPI (Jack Roe)**
- Secure and well-documented **loan processing** workflow
- **User** and **offer** management endpoints
- Robust error handling, validation, and Swagger documentation



## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Framework** | [NestJS](https://nestjs.com/) |
| **ORM** | [TypeORM](https://typeorm.io/) |
| **Database** | SQLite (in-memory for testing or persistent) |
| **Language** | TypeScript |
| **API Docs** | Swagger |
| **Security** | Helmet, Rate Limiting, Validation Pipes |
| **Testing** | Jest |



## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/autochek-backend.git
cd autochek-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the project root:
```bash
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=vin-lookup-by-jack-roe.p.rapidapi.com
RAPIDAPI_URL=https://vin-lookup-by-jack-roe.p.rapidapi.com/vehicle
```

If no key is set, the app automatically switches to **mock valuation mode**.



## Run the App

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```



## Seed the Database

You can seed demo users, vehicles, and valuations:

```bash
npm run seed
```

This inserts sample data such as:
```json
{
  "users": [{ "name": "John Doe", "email": "john@demo.com" }],
  "vehicles": [
    { "vin": "1HGCM82633A004352", "make": "Honda", "model": "Accord" },
    { "vin": "WBA3A5G57FNS12345", "make": "BMW", "model": "3 Series" }
  ]
}
```



## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/users` | Create a new user |
| **GET** | `/users/:id` | Get a specific user |
| **PATCH** | `/users/:id` | Update user information |
| **POST** | `/vehicles` | Add a new vehicle |
| **GET** | `/vehicles` | Get all vehicles |
| **GET** | `/vehicles/:idOrVin` | Retrieve vehicle by ID or VIN |
| **POST** | `/valuation` | Get vehicle valuation via VIN |
| **POST** | `/loans` | Create a loan application |
| **GET** | `/loans/:id` | Retrieve specific loan |
| **PATCH** | `/loans/:id/status` | Update loan status |
| **POST** | `/offers` | Create a loan offer |
| **GET** | `/offers` | Get all loan offers |



## Loan & Offer Logic

- **Max Loan Amount:** 70% of vehicle valuation  
- If `requestedAmount > maxLoan` → `status = offered`  
- If `requestedAmount <= maxLoan` → `status = approved`

**Example:**
```json
{
  "requestedAmount": 10000,
  "vehicleValue": 12000,
  "approvedAmount": 8400,
  "status": "offered"
}
```

Offers generated will be tied to the user and vehicle entities.



## VIN Lookup Integration (RapidAPI)

VIN lookup is powered by [Jack Roe’s VIN Lookup API](https://rapidapi.com/), providing make, model, year, and estimated market value.

The integration:
- Uses **Axios** under the hood
- Falls back to mock data if API fails or no key is set
- Automatically enriches valuation data for related vehicles

Example Response:
```json
{
  "vin": "1HGCM82633A004352",
  "make": "Honda",
  "model": "Accord",
  "year": 2019,
  "estimatedValue": 10500
}
```



## API Documentation (Swagger)

After running the app, open:

**[http://localhost:3000/docs](http://localhost:3000/docs)**

Each module (Users, Vehicles, Valuations, Loans, Offers) includes:
- Example requests and responses  
- DTO validation  
- Status codes  
- Error schema  
- Descriptive endpoint summaries  



## Project Structure

```
src/
 ├── app.module.ts
 ├── main.ts
 ├── common/
 │    ├── filters/
 │    ├── interceptors/
 │    └── dto/
 ├── user/
 │    ├── dto/
 │    ├── entities/
 │    ├── user.controller.ts
 │    ├── user.service.ts
 │    └── user.module.ts
 ├── vehicle/
 │    ├── dto/
 │    ├── entities/
 │    ├── vehicle.controller.ts
 │    ├── vehicle.service.ts
 │    └── vehicle.module.ts
 ├── valuation/
 │    ├── dto/
 │    ├── integrations/
 │    ├── entities/
 │    ├── valuation.controller.ts
 │    ├── valuation.service.ts
 │    └── valuation.module.ts
 ├── loan/
 │    ├── dto/
 │    ├── entities/
 │    ├── rules/
 │    ├── loan.controller.ts
 │    ├── loan.service.ts
 │    └── loan.module.ts
 ├── offer/
 │    ├── dto/
 │    ├── entities/
 │    ├── offer.controller.ts
 │    ├── offer.service.ts
 │    └── offer.module.ts
 ├── database/
 │    ├── seed.ts
 │    └── index.ts
 └── config/
```



## Security Features

- **Helmet:** Secures HTTP headers  
- **Rate limiting:** Max 100 requests/min per IP  
- **Validation:** DTO-based, strict whitelisting  
- **Error handling:** Global `AllExceptionsFilter`  
- **Logging:** Integrated with NestJS Logger  



## Testing

```bash
npm run test
```

Example output:
```
 PASS  src/user/user.service.spec.ts
 PASS  src/vehicle/vehicle.service.spec.ts
 Test Suites: 2 passed, 2 total
 Tests:       5 passed, 5 total
```


## Notes for Reviewers

- Runs “as-is” using:  
  ```bash
  npm install && npm run start:dev
  ```
- No external DB setup required (SQLite in-memory)
- VIN lookup live via RapidAPI or mock fallback
- Modular design: can easily extend with Auth or Payments


## License

MIT © Adeyemi Oduyungbo  
**Autochek Backend Test**
