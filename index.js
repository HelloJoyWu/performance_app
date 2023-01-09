/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AuthProvider} from './src/context/authContext';
import {AxiosProvider} from './src/context/axiosContext';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import * as notifyStorage from './src/core/notify';
import 'react-native-gesture-handler';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  let msgData = remoteMessage.data;
  if (msgData) {
    let action = msgData.action;
    if (action === 'TestSalesAlarm') {
      console.log('Receieve seles-alarm, background store!');
      notifyStorage.store(remoteMessage.messageId, msgData);
    }
  }
  return Promise.resolve();
});

const AppRoot = () => {
  async function requestUserPermission() {
    const authorizationStatus = await messaging()
      .requestPermission({alert: true, badge: true, provisional: true})
      .then(setAuthorizationStatus => {
        return setAuthorizationStatus;
      })
      .catch(error => {
        console.log('RequestUserPermission', error);
      });

    const permissionStatus = {
      '-1': 'not determined',
      0: 'denied',
      1: 'authorized',
      2: 'provisional',
    };

    if (authorizationStatus) {
      console.log(
        'Firebase messaging permission',
        permissionStatus[authorizationStatus.toString()],
      );
    }
    const enabled =
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const topics = ['performance', 'security', 'test-alarm'];
      for (const topic of topics) {
        messaging()
          .subscribeToTopic(topic)
          .then(() => console.log('Success subscribe to topic:', topic))
          .catch(err => console.log('Faild on subscribing topic:', topic, err));
      }
    }
  }

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <AuthProvider>
      <AxiosProvider>
        <App />
      </AxiosProvider>
    </AuthProvider>
  );
};

function HeadlessCheck({isHeadless}) {
  if (Platform.OS === 'ios') {
    // Use this property to conditionally render null ("nothing")
    // if your app is launched in the background!
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }
  }
  // On Android, the isHeadless prop will not exist.
  // Please use https://reactnative.dev/docs/headless-js-android

  return <AppRoot />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
