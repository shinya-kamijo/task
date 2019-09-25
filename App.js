import React from 'react';
import { Platform, StyleSheet, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator'
import HomeScreen from './src/screens/Home'

const STATUS_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;

export default class App extends React.Component {

  //コンストラクタ----
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      loggedIn: null,
    }
  };

  // 初期化処理(初回の一度だけ)
  componentWillMount() {
    console.debug("call App::componentWillMount");
  }

  render() {
    return (
      <AppNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUS_HEIGHT,
  },
});
