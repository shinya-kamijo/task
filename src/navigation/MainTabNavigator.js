import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import AddScr     from '../screens/Add'
import HomeScr    from '../screens/Home';
import NoticeScr  from '../screens/Notice'
import RankScr    from '../screens/Ranking';
import ReportScr  from '../screens/Report';

const HomeStack = createStackNavigator({
  HomeScreen : HomeScr,
});
HomeStack.navigationOptions = {
  tabBarLabel : 'ホーム',
  tabBarIcon  : ({ focused }) => (
    <Icon name='home' size={26} />
  ),
  style: {
    backgroundColor: 'blue',
  },
};

const AddStack = createStackNavigator({
  AddScreen : AddScr,
});
AddStack.navigationOptions = {
  tabBarLabel : '登録',
  tabBarIcon  : ({ focused }) => (
    <Icon name='pencil' size={26} />
  ),
};

const ReportStack = createStackNavigator({
  ReportScreen : ReportScr,
});
ReportStack.navigationOptions = {
  tabBarLabel : 'レポート',
  tabBarIcon  : ({ focused }) => (
    <Icon name='signal' size={26} />
  ),
};

const RankStack = createStackNavigator({
  RankScreen : RankScr,
});
RankStack.navigationOptions = {
  tabBarLabel : 'ランキング',
  tabBarIcon  : ({ focused }) => (
    <Icon name='trophy' size={26} />
  ),
};

const NoticeStack = createStackNavigator({
  NoticeScreen : NoticeScr,
});
NoticeStack.navigationOptions = {
  tabBarLabel : '通知',
  tabBarIcon  : ({ focused }) => (
    <Icon name='bell' size={26} />
  ),
};

export default createBottomTabNavigator(
  {
    HomeStack,
    AddStack,
    ReportStack,
    RankStack,
    NoticeStack,
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#FFFFCC',
      },
    }
  }
);