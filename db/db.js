import mysql from "mysql2";

class DB {
  constructor({ host, user, password, database }) {
    this.pool = mysql.createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
    });
    this.promisePool = this.pool.promise();
  }

  async insertData({ device_id, temperature, humidity, created_at }) {
    const sql = `INSERT INTO device_data (device_id, temperature, humidity, created_at) value (?,?,?,?)`;
    const [rows] = await this.promisePool.query(sql, [
      device_id,
      temperature,
      humidity,
      created_at,
    ]);
    return rows;
  }
}

export default DB;
