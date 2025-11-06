import "dotenv/config";
export default () => ({
  port: parseInt(process.env.PORT || "3000", 10),
  rapidapi: {
    key: process.env.RAPIDAPI_KEY || "",
    host: process.env.API_HOST || "vin-lookup.p.rapidapi.com",
  },
});
