# 🚗 Autochek Backend Technical Test

A backend API built with **NestJS**, **TypeORM**, and **SQLite**, implementing **vehicle valuation** and **loan processing** for Autochek’s automotive and financial services.

This project demonstrates:
- Vehicle data management (CRUD)
- Real-time vehicle valuation via RapidAPI (with offline mock fallback)
- Loan application processing and eligibility calculation
- Data validation, error handling, and clean API documentation

---

## ⚙️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** SQLite (in-memory or persistent)
- **Language:** TypeScript
- **Documentation:** Swagger (auto-generated)
- **Security:** Helmet, Rate limiting, Validation pipes
- **Testing:** Jest (unit tests)

---

## 🚀 Getting Started

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
```
# Optional — use mock mode if not provided
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_URL=https://vin-lookup-by-jack-roe.p.rapidapi.com/vehicle
```

If no key is set, the app automatically switches to **mock valuation mode**.

---

## ▶️ Run the App

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

---

## 🌱 Seed the Database

You can seed demo vehicles in two ways:

### Option 1 — Auto-seed on startup
Runs automatically when the app boots if the DB is empty.

### Option 2 — Manual seed
```bash
npm run seed
```

This inserts sample vehicles like:
```json
[
  { "vin": "1HGCM82633A004352", "make": "Honda", "model": "Accord" },
  { "vin": "3N1AB7AP6HY256789", "make": "Nissan", "model": "Sentra" },
  { "vin": "WBA3A5G57FNS12345", "make": "BMW", "model": "3 Series" }
]
```

---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/vehicles` | Add a new vehicle |
| **GET** | `/vehicles` | List all vehicles |
| **GET** | `/vehicles/:idOrVin` | Get a vehicle by ID or VIN |
| **PUT** | `/vehicles/:idOrVin` | Update a vehicle |
| **DELETE** | `/vehicles/:idOrVin` | Delete a vehicle |
| **POST** | `/valuation` | Estimate vehicle value (via VIN) |
| **POST** | `/loans` | Submit a loan application |
| **GET** | `/loans` | Get all loan applications |
| **GET** | `/loans/:id` | Get a specific loan |
| **PATCH** | `/loans/:id/status` | Update loan status (approve/reject) |

---

## 💰 Loan Eligibility Rules

- Maximum loan = **70% of the vehicle value**
- If `requestedAmount` > `maxLoan`, status = **offered**
- Otherwise, status = **approved**

Example:
```json
{
  "requestedAmount": 10000,
  "vehicleValue": 12000,
  "approvedAmount": 8400,
  "status": "offered"
}
```

---

## 📘 API Documentation (Swagger)

After starting the app, open:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

You’ll see all endpoints under:
- Vehicles
- Valuation
- Loans

Each endpoint includes:
- Input schema (DTO)
- Example requests
- Example responses

---

## 🧪 Running Tests

```bash
npm run test
```

Output example:
```
 PASS  src/vehicle/vehicle.service.spec.ts
 Test Suites: 1 passed, 1 total
 Tests:       1 passed, 1 total
```

---

## 🧱 Project Structure

```
src/
 ├── main.ts
 ├── app.module.ts
 ├── config/
 ├── common/
 │    ├── filters/
 │    ├── interceptors/
 │    └── dto/
 ├── vehicle/
 │    ├── vehicle.controller.ts
 │    ├── vehicle.service.ts
 │    ├── vehicle.module.ts
 │    └── entities/
 ├── valuation/
 │    ├── valuation.controller.ts
 │    ├── valuation.service.ts
 │    ├── integrations/
 │    └── dto/
 ├── loan/
 │    ├── loan.controller.ts
 │    ├── loan.service.ts
 │    ├── loan.module.ts
 │    ├── entities/
 │    └── rules/
 └── database/
      ├── seed.ts
      └── index.ts
```

---

## 🔒 Security Measures
- **Helmet** for HTTP header security  
- **Rate limiting**: max 100 requests/min  
- **Global validation**: whitelist, DTO-based  
- **Centralized error handling** with `AllExceptionsFilter`

---

## Notes for Reviewers

- The app runs “as-is” with `npm install && npm run start:dev`
- No external dependencies required besides NestJS stack
- Supports both **mock** and **live API** valuation modes
- Fully modular, easy to extend with authentication or external storage

---

## License
MIT © Adeyemi Oduyungbo
# autocheck
