import dotenv from "dotenv";
import express from "express";
import MqttClient from "./mqtt/mqtt-client.js";

dotenv.config();
const app = express();
const PORT = 3000;
// const SUB_TOPIC_INDEX = 2;

const mqttOptions = {
  // 프로젝트 폴더에 .env 파일을 만들고 MQTT_BROKER_HOST, MQTT_BROKER_PORT 값을 추가해 주세요.
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

// const mqttClient = new MqttClient(mqttOptions, ['토픽이름' ]); // 구독할 토픽 추가
const mqttClient = new MqttClient(mqttOptions, ["dt/test-01"]); // 구독할 토픽 추가
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
  // 메시지 이벤트 콜백 설정
  console.log(topic, message.toString());
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
