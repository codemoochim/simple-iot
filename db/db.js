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

  async getLatestData() {
    // 데이터 조회
    const sql =
      "select * from device_data where idx IN(select MAX(idx) idx from `simple-iot`.device_data group by device_id)";
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }

  async getDevices() {
    // 디바이스 조회
    const sql = "select * from device;";
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }
  async getOneDevice(device_id) {
    // 디바이스 조회
    const sql = "select * from device where device_id=?;";
    const [rows] = await this.promisePool.query(sql, [device_id]);
    return rows;
  }

  async getData(device_id, start, end) {
    const sql =
      "select * from device_data where device_id=? and (created_at BETWEEN ? AND ? );";
    const [rows] = await this.promisePool.query(sql, [device_id, start, end]);
    return rows;
  }
}

export default DB;
