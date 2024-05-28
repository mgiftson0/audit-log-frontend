const express = require("express");
const oracledb = require("oracledb");

const app = express();
const port = 3000;

// Oracle DB Connection Pool Configuration
const dbConfig = {
  privilege: oracledb.SYSDBA, // Specify SYSDBA privilege
  user: "SYS",
  password: "PAss1234",
  connectString: "10.203.14.60:9534/USGL",
  poolMax: 10,
  poolMin: 2,
  poolIncrement: 2,
  poolTimeout: 10,
};

// Create a connection pool
oracledb.createPool(dbConfig, (err, pool) => {
  if (err) {
    console.error("Error creating Oracle DB connection pool: ", err.message);
    return;
  }

  console.log("Oracle DB connection pool created successfully.");

  // API endpoint to fetch data with pagination
  app.get("/api/data", async (req, res) => {
    try {
      const { page } = req.query;
      const offset = (page - 1) * 50 || 0;

      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Execute the query with pagination
      const result = await connection.execute(
        `SELECT * FROM your_table OFFSET ${offset} ROWS FETCH NEXT 50 ROWS ONLY`
      );

      // Release the connection back to the pool
      await connection.close();

      // Send the results as JSON
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching data: ", error.message);
      res.status(500).send("Internal Server Error");
    }
  });

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
