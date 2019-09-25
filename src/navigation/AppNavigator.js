import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';

const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      MainTab : { screen: MainTabNavigator },
    },
    {
      initialRouteName: 'MainTab'
    }
  );
}

export default class AppNavigator extends React.Component {
  render() {
    const Navigator = createAppContainer(createRootNavigator(false));
    return(
      <Navigator />
    )
  };
};