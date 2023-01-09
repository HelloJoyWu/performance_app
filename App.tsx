import React, {useContext, useEffect} from 'react';
import {Image, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import MenuScreen from './src/screen/menuScreen';
import DockingAreaScreen from './src/screen/dockingArea/dockingAreaScreen';
import MarketMenuScreen from './src/screen/market/marketMenuScreen';
import MainMenuScreen from './src/screen/mainMenuScreen';
import SettingScreen from './src/screen/setting/settingScreen';
import LoginScreen from './src/screen/loginScreen';
import RulerScreen from './src/screen/rulerScreen';
import CallScreen from './src/screen/callScreen';
import Cq9Screen from './src/screen/cq9Screen';
import ChamplandScreen from './src/screen/champlandScreen';
import KimbabaScreen from './src/screen/kimbabaScreen';
import LegoScreen from './src/screen/dockingArea/legoScreen';
import MotivationScreen from './src/screen/performance/motivationScreen';
import GensportsScreen from './src/screen/performance/gensportsScreen';
import ChangeNameScreen from './src/screen/setting/changeNameScreen';
import ChangePasswordScreen from './src/screen/setting/changePasswordScreen';
import AverageDailyBetScreen from './src/screen/market/averageDailyBet';
import AverageDailyPlayerScreen from './src/screen/market/averageDailyPlayer';
import OverviewGameTypesScreen from './src/screen/market/overviewGameTypes';
import CQ9AllAccBetScreenScreen from './src/screen/market/cq9AllAccBetScreen';
import GroupComparisonScreen from './src/screen/market/groupComparisonScreen';
import MessagePushScreen from './src/screen/messagePushScreen';
import QuickSearchScreen from './src/screen/quickSearchScreen';
import {AuthContext} from './src/context/authContext';
import SpinnerScreen from './src/screen/spinnerScreen';
import messaging from '@react-native-firebase/messaging';
import * as notifyStorage from './src/core/notify';

// https://stackoverflow.com/questions/69538962/new-nativeeventemitter-was-called-with-a-non-null-argument-without-the-requir
LogBox.ignoreLogs(['new NativeEventEmitter']);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

type MainScreenSetProps = {
  route: any;
  children: React.ReactNode;
};

const MainScreenSet: React.FC<MainScreenSetProps> = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainMenuScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainMenuScreen" component={MainMenuScreen} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="DockingAreaScreen" component={DockingAreaScreen} />
      <Stack.Screen name="MarketMenuScreen" component={MarketMenuScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="Cq9Screen" component={Cq9Screen} />
      <Stack.Screen name="LegoScreen" component={LegoScreen} />
      <Stack.Screen name="MotivationScreen" component={MotivationScreen} />
      <Stack.Screen name="GensportsScreen" component={GensportsScreen} />
      <Stack.Screen name="ChamplandScreen" component={ChamplandScreen} />
      <Stack.Screen name="KimbabaScreen" component={KimbabaScreen} />
      <Stack.Screen name="ChangeNameScreen" component={ChangeNameScreen} />
      <Stack.Screen name="MessagePushScreen" component={MessagePushScreen} />
      <Stack.Screen name="QuickSearchScreen" component={QuickSearchScreen} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="AverageDailyBetScreen"
        component={AverageDailyBetScreen}
      />
      <Stack.Screen
        name="AverageDailyPlayerScreen"
        component={AverageDailyPlayerScreen}
      />
      <Stack.Screen
        name="OverviewGameTypesScreen"
        component={OverviewGameTypesScreen}
      />
      <Stack.Screen
        name="GroupComparisonScreen"
        component={GroupComparisonScreen}
      />
      <Stack.Screen
        name="CQ9AllAccBetScreenScreen"
        component={CQ9AllAccBetScreenScreen}
      />
      <Stack.Screen name="SpinnerScreen" component={SpinnerScreen} />
    </Stack.Navigator>
  );
};

export default function App({}) {
  const authContext = useContext(AuthContext);

  //// For Firebase messaging
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      let msgData = remoteMessage.data;
      if (msgData) {
        let action = msgData.action;
        let deactivateUser = msgData.user;
        if (
          action === 'deactive' &&
          deactivateUser === authContext.authInfo.username
        ) {
          if (authContext.authState) {
            authContext.logout();
          }
        }
        if (action === 'TestSalesAlarm') {
          if (remoteMessage.messageId) {
            console.log('Receieve seles-alarm, foreground store!');
            msgData.msgid = remoteMessage.messageId;
            await notifyStorage.store(remoteMessage.messageId, msgData);
          }
        }
      }
    });

    return unsubscribe;
  }, [authContext]);

  return (
    <NavigationContainer>
      {authContext.isLoading ? (
        SpinnerScreen({
          doSpin: true,
          children: undefined,
        })
      ) : authContext.authState ? (
        <Tab.Navigator
          initialRouteName="MainScreen"
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarLabel: ' ',
            tabBarIcon: ({}) => {
              if (route.name === 'MainScreen') {
                return (
                  <Image
                    source={require('./res/btn_home.png')}
                    style={{width: 35, height: 35}}
                    resizeMode="contain"
                  />
                );
              }
            },
            tabBarLabelStyle: {
              fontSize: 1,
            },
            tabBarStyle: {
              backgroundColor: '#000000',
            },
          })}>
          <Tab.Screen name="MainScreen" component={MainScreenSet} />
        </Tab.Navigator>
      ) : (
        <Tab.Navigator
          initialRouteName="RulerScreen"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {display: 'none'},
          }}>
          <Tab.Screen name="RulerScreen" component={RulerScreen} />
          <Tab.Screen name="CallScreen" component={CallScreen} />
          <Tab.Screen name="LoginScreen" component={LoginScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
