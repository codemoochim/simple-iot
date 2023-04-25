import mqtt from 'mqtt'
import dotenv from 'dotenv';
dotenv.config()

const mqttOptions = {
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

const client = mqtt.connect(mqttOptions);

client.on('connect', (connack) => {
  console.log('## test publisher connected')

  setInterval(()=>{
    console.log("## published")
    client.publish('dt/test-01', JSON.stringify({
      device_id: 1,
      temperature: 20, 
      humidity: 30,
      timestamp: Date.now(),
    }));
  }, 1000)
});

