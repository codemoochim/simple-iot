import mqtt from "mqtt";
import dotenv from "dotenv";
dotenv.config();

/*
이렇게 test-publisher 라는 파일을 만들어서 이곳에다가 동일한 mqtt 브로커를 바라보게 하고
*/
const mqttOptions = {
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

/*
그다음에 connect를 해서
*/
const client = mqtt.connect(mqttOptions);

/*
1초의 주기로 publishing을 하는 코드를 추가했어요. 이 상태에서 한 번 node test-publisher.js 로 실행해보겠습니다.
*/
client.on("connect", (connack) => {
  console.log("## test publisher connected");

  setInterval(() => {
    console.log("## published");
    client.publish(
      "dt/test-01",
      JSON.stringify({
        device_id: 1,
        temperature: 20,
        humidity: 30,
        timestamp: Date.now(),
      })
    );
  }, 1000);
});
