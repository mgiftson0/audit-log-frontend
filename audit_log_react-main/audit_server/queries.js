// queries.js
const queries = {
  auditTrail: `
    SELECT *
    FROM (
      SELECT a.*, ROWNUM rnum
      FROM (SELECT username,  userhost, obj_name, action, action_name, priv_used, extended_timestamp, entryid
        FROM DBA_AUDIT_TRAIL) a
      WHERE ROWNUM <= :maxRows
    )
    WHERE rnum >= :offset`,

  auditUnified: `
    SELECT *
    FROM (
      SELECT a.*, ROWNUM rnum
      FROM (SELECT AUDIT_TYPE, OS_USERNAME, EVENT_TIMESTAMP, USERHOST, DBUSERNAME, ACTION_NAME
        FROM AUDSYS.AUD$UNIFIED) a
      WHERE ROWNUM <= :maxRows
    )
    WHERE rnum >= :offset
    `,
  auditUnifiedTrail: `
    SELECT *
    FROM (
      SELECT a.*, ROWNUM rnum
      FROM (SELECT AUDIT_TYPE, OS_USERNAME, SESSIONID, USERHOST, event_timestamp, action_name 
        FROM UNIFIED_AUDIT_TRAIL ORDER BY event_timestamp DESC) a
      WHERE ROWNUM <= :maxRows
    )
    WHERE rnum >= :offset
    `,

  x2: `
    SELECT *
    FROM (
      SELECT a.*, ROWNUM rnum
      FROM (SELECT AUDIT_TYPE,
    SESSIONID,
    OS_USERNAME,
    USERHOST,
    TERMINAL,
    INSTANCE_ID,
    DBID,
    AUTHENTICATION_TYPE,
    DBUSERNAME,
    CLIENT_PROGRAM_NAME,
    ENTRY_ID,
    STATEMENT_ID,
    EVENT_TIMESTAMP,
    EVENT_TIMESTAMP_UTC,
    ACTION_NAME,
    RETURN_CODE,
    OS_PROCESS,
    TRANSACTION_ID,
    SCN,
    OBJECT_SCHEMA
        FROM UNIFIED_AUDIT_TRAIL ORDER BY event_timestamp DESC) a
      WHERE ROWNUM <= :maxRows
    )
    WHERE rnum >= :offset
    `,

  x3: `
    SELECT *
FROM (
    SELECT a.*, ROWNUM rnum
    FROM (
        SELECT 
            AUDIT_TYPE,
            SESSIONID,
            OS_USERNAME,
            USERHOST,
            TERMINAL,
            INSTANCE_ID,
            DBID,
            AUTHENTICATION_TYPE,
            DBUSERNAME,
            CLIENT_PROGRAM_NAME,
            ENTRY_ID,
            STATEMENT_ID,
            EVENT_TIMESTAMP,
            EVENT_TIMESTAMP_UTC,
            ACTION_NAME,
            RETURN_CODE,
            OS_PROCESS,
            TRANSACTION_ID,
            SCN,
            OBJECT_SCHEMA,
            ROW_NUMBER() OVER (ORDER BY EVENT_TIMESTAMP DESC) AS rn
        FROM UNIFIED_AUDIT_TRAIL
       -- WHERE TRUNC(EVENT_TIMESTAMP) = TRUNC(SYSDATE) -- Filter for the current day
    ) a
    WHERE ROWNUM <= :maxRows AND rn >= :offset
)
`,
  createTable: `
    CREATE TABLE \${tableName} (
      AUDIT_TYPE VARCHAR(50),
      SESSIONID VARCHAR(50),
      OS_USERNAME VARCHAR(50),
      USERHOST VARCHAR(50),
      TERMINAL VARCHAR(50),
      INSTANCE_ID VARCHAR(50),
      DBID VARCHAR(50),
      AUTHENTICATION_TYPE VARCHAR(50),
      DBUSERNAME VARCHAR(50),
      CLIENT_PROGRAM_NAME VARCHAR(255),
      ENTRY_ID VARCHAR(50),
      STATEMENT_ID VARCHAR(50),
      EVENT_TIMESTAMP DATETIME,
      EVENT_TIMESTAMP_UTC DATETIME,
      ACTION_NAME VARCHAR(50),
      RETURN_CODE INT,
      OS_PROCESS VARCHAR(50),
      TRANSACTION_ID VARCHAR(50),
      SCN VARCHAR(50),
      OBJECT_SCHEMA VARCHAR(50),
      rnum INT
    )
  `,
};

module.exports = queries;
