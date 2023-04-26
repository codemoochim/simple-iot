import dotenv from "dotenv";
import express from "express";
import MqttClient from "./mqtt/mqtt-client.js";
import DB from "./db/db.js";
import api from "./routes.js";

dotenv.config();
const app = express();
const PORT = 8080;
const TOPIC_TYPE_INDEX = 0;
const db = new DB({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const mqttOptions = {
  // 프로젝트 폴더에 .env 파일을 만들고 MQTT_BROKER_HOST, MQTT_BROKER_PORT 값을 추가해 주세요.
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

// const mqttClient = new MqttClient(mqttOptions, ['토픽이름' ]); // 구독할 토픽 추가
// const mqttClient = new MqttClient(mqttOptions, ["dt/test-01"]); // 구독할 토픽 추가
const mqttClient = new MqttClient(mqttOptions, ["dt/#"]); // dt 로 들어오는 모든 토픽을 구독을 해서 메시지가 들어올 떄 이벤트콜백
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
  // 메시지 이벤트 콜백 설정
  console.log(topic, message.toString());
  const topicType = topic.split("/")[TOPIC_TYPE_INDEX];
  const messageJson = JSON.parse(message);

  try {
    // message event 콜백 로직 추가
    switch (topicType) {
      case "dt":
        db.insertData({
          device_id: messageJson.device_id,
          temperature: messageJson.temperature,
          humidity: messageJson.humidity,
          created_at: new Date(messageJson.timestamp),
        });
        break;
      default:
        console.log("모르는 토픽");
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

api.init(db, mqttClient);
app.use(express.json());
app.use("/api", api.getRouter());
app.get("*", (req, res) => {
  res.send("모든 요청에 대해");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
