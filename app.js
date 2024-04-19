const express = require('express');
const app = express();
const sequelize = require('./config/database'); // Import Sequelize instance
const currencyRoutes = require('./routes/currencyRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes'); // Import exchangeRoutes
const { populateCurrencies } = require('./services/currencyService'); // Import populateCurrencies function

// Add middleware, routes, etc.
app.use(express.json());

// Connect to the database and start the server
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Synchronize models with the database
    return sequelize.sync({ alter: true }); // If set to true, it will drop existing tables and recreate them
  })
  .then(() => {
    console.log('Database synchronization successful.');
    // Call populateCurrencies function to populate currencies during the startup
    return populateCurrencies();
  })
  .then(() => {
    console.log('Currencies populated successfully');
    // Add currency routes
    app.use('/currencies', currencyRoutes);
    // Add exchange routes
    app.use('/exchange', exchangeRoutes);
    // Start the server
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });