import mqtt from "mqtt";

class MqttClient {
  #options;
  #client;
  #topics;

  // constructor에서는 옵션과 토픽 정보를 가져와 클래스 멤버로 만들어 주세요
  constructor(options, topics) {
    this.#options = options;
    this.#topics = topics;
  }

  // connect() 메서드를 만들어 mqtt에 연결을 하고 구독하는 코드를 작성해 주세요.
  connect() {
    const self = this;
    self.#client = mqtt.connect(self.#options);

    self.#client.on("connect", () => {
      console.log("## connected");

      // 토픽을 구독하는 코드를 작성해주세요
      self.#client.subscribe(self.#topics, (error) => {
        if (!error) {
          console.log("구독 성공");
        } else {
          console.log("구독 실패");
        }
      });
    });

    // error 이벤트 콜백 구현해 주세요.
    self.#client.on("error", (error) => {
      console.log(error);
    });
  }

  sendCommand(topic, message) {
    this.#client.publish(topic, JSON.stringify(message));
  }

  //  messsage 이벤트 콜백은 클래스 외부에서 작성하여 설정할 수 있도록 setMessageCallback 함수를 만들어 주세요.
  setMessageCallback(cb) {
    // 메시지 이벤트 콜백을 등록하는 코드를 작성해 주세요.
    this.#client.on("message", cb);
  }
}

/*
구독이 성공되었습니다. 동일하게 구독 토픽으로 publishing 을 해봄으로써 실질적으로 정상적으로 동작하는지 확인해볼 수 있겠죠?
이 test 코드를 따로 test-publisher라는 코드를 만들어서 한 번 발행해보도록 하겠습니다.
*/
export default MqttClient;
