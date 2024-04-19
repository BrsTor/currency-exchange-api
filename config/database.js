const { Sequelize } = require("sequelize");

// Initialize Sequelize with environment variables for database credentials
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: "postgres",
});

// Test the database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

module.exports = sequelize;

// Test the database connection on application startup
testConnection();
