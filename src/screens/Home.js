import React from 'react';
import { Platform, StyleSheet, Alert, NativeEventEmitter, NativeModules, } from 'react-native';
import { Container, Content, Body, ListItem, CheckBox, Text, Button, } from 'native-base';
import BleManager from 'react-native-ble-manager';
import { stringToBytes, bytesToString } from 'convert-string';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class Home extends React.Component {
  static navigationOptions = {

    title: '持ち物リスト',
    headerStyle: { backgroundColor: '#FFFFCC' },
  };

  //コンストラクタ
  constructor(props) {
    console.log('constructor start');
    super(props);
    this.state = {
      scanning: false,
      bltState: false,
      baggage1: false,
      baggage2: false,
      baggage3: false,
      baggage4: false,
      baggage5: false,
      peripherals: "18:93:D7:00:B5:B4",
      uuid: "18:93:D7:00:B5:B4",
      chara: "0000ffe1-0000-1000-8000-00805f9b34fb",
      service: "0000ffe0-0000-1000-8000-00805f9b34fb",
    }

    BleManager.enableBluetooth().then(() => {
      // Success code
      console.log('The bluetooth is already enabled or the user confirm');
      BleManager.start({ forceLegacy: false }).then(() => {
        // Success code
        console.log('Module initialized');
        if (!this.state.scanning) {
          console.log('Scanning...');
          BleManager.scan([], 3000).then((results) => {
            this.setState({ scanning: true });
            console.log("scan results:" + JSON.stringify(results));
          });
        }
      });
    })
      .catch((error) => {
        // Failure code
        console.log('The user refuse to enable bluetooth');
      });
  };

  // 初期化処理(初回の一度だけ)
  componentWillMount() {
    console.debug("call Home::componentWillMount");
  };

  /**
   * Bluetoothとペアリングする
   */
  _onPressConectButton() {
    console.log('_onPressConectButton start');
    console.log('UUID:' + this.state.uuid);
    let uuid = this.state.uuid;

    BleManager.enableBluetooth().then(() => {
      BleManager.getConnectedPeripherals([uuid]).then((results) => {
        console.log("getUUID:" + JSON.stringify(results));
        var peripherals = this.state.peripherals;
        for (var i = 0; i < results.length; i++) {
          var peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          console.log(peripheral)
          this.setState({ peripherals });
        }
      });

      BleManager.connect(this.state.uuid).then(() => {
        console.log('Connected');
        Alert.alert('接続しました')
      }).catch((error) => {
        // Failure code
        console.log("ERR:" + error);
        Alert.alert('失敗しました')
      });
    })
      .catch((error) => {
        // Failure code
        console.log('The user refuse to enable bluetooth');
      });
  };

  /**
   * Bluetoothとの接続を切る
   */
  _onPressDiscinnectButton() {
    console.log('_onPressDiscinnectButton start');

    BleManager.stopNotification(this.state.uuid, "ffe0", "ffe1").then(() => {
      // Success code
      console.log('Notification stoped');
    })
      .catch((error) => {
        // Failure code
        console.log(error);
      });

    BleManager.disconnect(this.state.uuid).then(() => {
      console.log('Disconnected');
      Alert.alert('通信を終了しました')
    }).catch((error) => {
      // Failure code
      console.log("ERR:" + error);
      Alert.alert('通信の終了に失敗しました')
    })
  };

  /**
   * Bluetoothからデータを受信状態にする
   */
  async _onPressButton() {
    console.log('_onPressButton start');
    if (this.state.bltState == false) {
      BleManager.retrieveServices(this.state.uuid).then((peripheralInfo) => {
        // Success code
        this.setState({
          peripherals: peripheralInfo,
          bltState: true,
        })
        BleManager.startNotification(this.state.uuid, this.state.service, this.state.chara).then(() => {
          // Success code
          console.log('Notification started');
          // Add event listener
          bleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", ({ value, peripheral, characteristic, service }) => {
            // Convert bytes array to string
            const data = bytesToString(value);
            //console.log('Recieved:' + value + ' peripheral:' + peripheral + ' characteristic:' + characteristic + ' service:' + service);
            console.log('Recieved:' + data);

            // ON/OFFの状態を下１桁から判定する(0:OFF / 1:ON)
            var baggegaFlag = false;
            if ("1" == data.slice(-1)) {
              baggegaFlag = true;
            }

            // タグIDから変更する項目を探して、特定の持ち物をON/OFFする
            switch (data.slice(0, data.length - 1)) {
              case "706787a7":
                this.setState({ baggage1: baggegaFlag });
                break;
              case "04779762e25d81":
                this.setState({ baggage2: baggegaFlag });
                break;
              case "04739762e25d81":
                this.setState({ baggage3: baggegaFlag });
                break;
              case "046b9762e25d81":
                this.setState({ baggage4: baggegaFlag });
                break;
              case "046f9762e25d81":
                this.setState({ baggage5: baggegaFlag });
                break;
              default:
                break;
            }
          });
        })
          .catch((error) => {
            // Failure code
            console.log(error);
          });
      });
    }
  };

  /**
   * Bluetoothにデータを書き込む
   */
  _onPressWriteButton() {
    console.log('_onPressWriteButton start');

    BleManager.retrieveServices(this.state.uuid).then((peripheralInfo) => {
      // Success code
      this.setState({
        peripherals: peripheralInfo,
      })
      const data = stringToBytes("AT+VERSION");
      BleManager.write(this.state.uuid, "ffe0", "ffe1", data).then(() => {
        // Success code
        console.log('Write: ' + bytesToString(data));
        Alert.alert('書き込みボタンを押しました');
      });
    });
  };

  /**
   * Bluetoothでデータを読み込む
   */
  _onPressReadButton() {
    console.log('_onPressReadButton start');

    BleManager.retrieveServices(this.state.uuid).then((peripheralInfo) => {
      // Success code
      this.setState({
        peripherals: peripheralInfo,
      });
      BleManager.read(this.state.uuid, "ffe0", "ffe1").then((readData) => {
        // Success code
        console.log('Read : ' + bytesToString(readData));
        Alert.alert('取得データ：' + bytesToString(readData));
      });
    });
  };

  render() {
    if (true == this.state.bltState) {
      return (
        <Container>
          <Content>
            <ListItem>
              <CheckBox checked={this.state.baggage1} />
              <Body>
                <Text>国語の教科書</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.baggage2} />
              <Body>
                <Text>算数の教科書</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.baggage3} />
              <Body>
                <Text>理科の教科書</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.baggage4} />
              <Body>
                <Text>体操服</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.baggage5} />
              <Body>
                <Text>社会の教科書</Text>
              </Body>
            </ListItem>
          </Content>
        </Container>
      );
    } else {
      return (
        <Container style={styles.container}>
          <Content>
            <Button info
              onPress={this._onPressConectButton.bind(this)}
              style={styles.buttonContainer}
            >
              <Text>接続開始</Text>
            </Button>
            <Button info
              onPress={this._onPressButton.bind(this)}
              style={styles.buttonContainer}
            >
              <Text>受信開始</Text>
            </Button>
            <Button info
              onPress={this._onPressDiscinnectButton.bind(this)}
              style={styles.buttonContainer}
            >
              <Text>接続終了</Text>
            </Button>
          </Content>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 30,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});