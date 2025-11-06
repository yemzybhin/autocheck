export default () => ({
  port: parseInt(process.env.PORT || "3000", 10),
  rapidapi: {
    key: process.env.RAPIDAPI_KEY || "",
    url: process.env.RAPIDAPI_URL || "",
  },
});
