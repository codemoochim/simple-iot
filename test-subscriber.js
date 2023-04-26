import mqtt from "mqtt";
import dotenv from "dotenv";
dotenv.config();

const mqttOptions = {
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

const client = mqtt.connect(mqttOptions);

// 발행하는 코드가 아니라 구독을해서 출력을 하는 코드
client.on("connect", (connack) => {
  console.log("## test publisher connected");

  client.subscribe("cmd/test-01/pump");
});

client.on("message", (topic, message) => {
  console.log(topic, JSON.parse(message.toString("utf-8")));
});
