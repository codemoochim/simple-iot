import express, { Router } from "express";

const router = express.Router();

const init = (db, mqttClient) => {
  router.get("/data/realtime", async (req, res) => {
    // 실시간 데이터 조회
    try {
      res.send(await db.getLatestData());
    } catch (error) {}
  });
  router.get("/devices", async (req, res) => {
    try {
      res.send(await db.getDevices());
    } catch (error) {}
  });
  router.get("/data/devices/:device_id", async (req, res) => {
    try {
      const { device_id } = req.params;
      const { start, end } = req.query;

      if (!device_id || device_id === "") {
        res.status(400).send({ error: "device_id error" });
      }
      res.send(await db.getData(device_id, start, end));
    } catch (error) {}
  });

  router.post("/cmd/devices/:device_id", async (req, res) => {
    try {
      const { device_id } = req.params;
      const { command } = req.body;
      if (!device_id || device_id === "") {
        res.status(400).send({ error: "device_id error" });
      }
      if (!command || command !== run || command !== "stop") {
        res.status(400).send({ error: "command error" });
      }
      const device = await db.getOneDevice(device_id);

      await mqttClient.sendCommand(`cmd/${device[0].serial_num}/pump`, {
        serial_num: device[0].serial_num,
        command,
      });
    } catch (error) {}
  });
};

const getRouter = () => {
  return router;
};

export default {
  init,
  getRouter,
};
