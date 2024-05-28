const express = require("express");
const oracledb = require("oracledb");
const dotenv = require("dotenv");
const mysql = require("mysql");
const queries = require("./queries");
const cors = require("cors");
const axios = require("axios"); // Make sure to install axios: npm install axios

const intervalInSeconds = 10 * 50000; // 5 minutes

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3010;
app.use(cors());

// MySQL Database Configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const dbConfig = {
  privilege: oracledb.SYSDBA,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

// Middleware to validate API key
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).send("Invalid API Key");
  }
  next();
};

app.use(apiKeyMiddleware);

// Function to create the table dynamically
async function createTable(connection, tableName) {
  const createTableQuery = queries.createTable.replace(
    "${tableName}",
    tableName
  );

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table, already exists");
    } else {
      console.log("Table created successfully:", result);
    }
  });
}

// Function to store data in MySQL
async function storeDataInMySQL(data) {
  const connection = mysql.createConnection(mysqlConfig);

  try {
    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Set autocommit
    connection.query("SET autocommit = 1");

    // Check if the data already exists based on a unique identifier (e.g., id)
    const tableName = "audit";
    const uniqueIdentifier = "rnum"; // replace with your actual unique identifier column
    const existingDataQuery = `SELECT 1 FROM ${tableName} WHERE ${uniqueIdentifier} = ? LIMIT 1`;

    const result = await new Promise((resolve, reject) => {
      connection.query(
        existingDataQuery,
        [data[uniqueIdentifier]],
        (err, result) => {
          if (err) {
            console.error("Error checking existing data:", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (result.length === 0) {
      // Data does not exist, proceed with insertion
      const insertQuery = `INSERT INTO ${tableName} SET ?`;

      // Exclude the 'rn' column from the data before insertion
      delete data.rn;

      await new Promise((resolve, reject) => {
        connection.query(insertQuery, data, (err, result) => {
          if (err) {
            console.error("Error inserting data into MySQL:", err);
            reject(err);
          } else {
            console.log("Data inserted into MySQL successfully:", result);
            resolve(result);
          }
        });
      });
    } else {
      // Data already exists, do not insert
      console.log("Data already exists in MySQL, skipping insertion.");
    }
  } finally {
    // Always close the connection, whether there's an error or not
    connection.end();
  }
}

app.get("/api/viewData", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    // Call createTable function to ensure the table exists
    await createTable(mysql.createConnection(mysqlConfig), "audit");

    const page = req.query.page || 1;
    const pageSize = 100;
    const offset = (page - 1) * pageSize;

    const query = queries.x3; // Use the stored query

    const binds = { maxRows: offset + pageSize, offset: offset + 1 };
    const result = await connection.execute(query, binds);

    if (result.rows) {
      const response = [];
      for (let i = 0; i < result.rows.length; i++) {
        const rowData = {};

        for (let x = 0; x < result.metaData.length; x++) {
          const columnName = result.metaData[x].name.toLowerCase();
          const columnValue = result.rows[i][x];
          rowData[columnName] = columnValue;
        }

        // Insert data into MySQL (checking for existence first)
        await storeDataInMySQL(rowData);

        response.push(rowData);
      }

      return res.status(200).send(response);
    }

    await connection.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/getMySQLData", async (req, res) => {
  try {
    const connection = mysql.createConnection(mysqlConfig);

    connection.connect(async (err) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        return res.status(500).send("Internal Server Error");
      }

      const tableName = "audit"; // Replace with your actual table name
      const query = `SELECT * FROM ${tableName}`;

      connection.query(query, (err, result) => {
        connection.end(); // Close the connection

        if (err) {
          console.error("Error retrieving MySQL data:", err);
          return res.status(500).send("Internal Server Error");
        }

        return res.status(200).json(result);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

function fetchData() {
  axios
    .get("http://localhost:3010/api/viewData", {
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    })
    .then((response) => {
      console.log("Data fetched successfully");
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
    });
}

// Call fetchData every 10 seconds
setInterval(fetchData, intervalInSeconds);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
