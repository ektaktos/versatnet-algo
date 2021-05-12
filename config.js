require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  ip_address: process.env.IPADDRESS,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USERNAME,
  dbPass: process.env.DB_PASSWORD,
  dbPort: process.env.DB_PORT,
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
}