
## Description
This repository contains the source code for a currency exchange system based on REST API services. It utilizes Node.js with Express to create the REST API services and Sequelize to interact with a PostgreSQL database.
## Environment Variables

To run this project in development, you will need to add the following environment variables to your nodemon.json file. This file must be on the root folder

```json
{
    "env": {
        "NODE_ENV": "development",
        "DB_NAME": "dbName",
        "DB_USERNAME": "dbUsername",
        "DB_PASSWORD": "dbPassword",
        "DB_HOST": "hostUrl",
        "COINMARKETCAP_API_KEY": "YourCoinMarketCapApiKey"
    }
}
```
To run this project in production, declare those environment variables in your deployment site.
## API Reference

#### Retrieves all active currencies
```
  GET /currencies/
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

___
#### Updates the price of a currency
```
  PATCH  /currencies/:id
```
| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `id`      | `string` | **Required**. Id of the currency to update. Is a query param|
| `price`   | `string` | **Required**. Has the price to update. Is a body param. _application/json_|

___
#### Updates the status of a currency
```
  PATCH  /currencies/:id/status
```
| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `id`      | `string` | **Required**. Id of the currency to update. Is a query param |
| `isActive`| `boolean`| **Required**. Has the status to update. Is a body param. _application/json_|

___
#### Retrieves the converted amount of a currecy to all the other ones
```
  GET  /exchange/convert
```
| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `amount`  | `float`  | **Required**. Amount of the currency to convert. is a body param. application/json   |
| `from`    | `string` | **Required**. Has the symbol of the currecy. Must be one of this "BNB", "BS", "BTC", "ETH", "EUR", "USDT". Is a body  param. _application/json_ 

## Tech Stack

**Server:** Node, Express, Sequelize, PostgreSQL.

