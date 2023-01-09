import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, View, Image, Alert, Pressable} from 'react-native';
import {AuthContext} from '../context/authContext';
import {cq9BackendURL} from '../context/axiosContext';
import axios from 'axios';
import {objToQueryString} from '../core/util';

export const LogoutTimer = () => {
  const [logoutAfterSecs, setLogoutAfterSecs] = useState<number>(1500);
  const authContext = useContext(AuthContext);
  const logoutTime = authContext.loginTime + 1000 * logoutAfterSecs;
  const [logoutTimer, setLogoutTimer] = useState<number>();
  const timerRedWarn = 100;

  useEffect(() => {
    const timerId = setInterval(async () => {
      const nowTime = new Date().getTime();
      const countdownTime = (logoutTime - nowTime) / 1000;
      if (Math.floor(countdownTime) === 30) {
        authContext.setShowExtensionTime(true);
      }
      if (countdownTime < 0) {
        clearInterval(timerId);
        authContext.logout();
      } else {
        setLogoutTimer(countdownTime);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [authContext, logoutTime]);

  useEffect(() => {
    if (authContext.timeDelayAgain && logoutTimer) {
      setLogoutAfterSecs(1680);
    }
  }, [authContext.timeDelayAgain, logoutTimer]);

  return (
    <View>
      <View
        style={[
          styles.textBox,
          {
            backgroundColor:
              logoutTimer && logoutTimer < timerRedWarn ? 'red' : '#FFE41F',
          },
        ]}>
        <Text
          style={{
            color:
              logoutTimer && logoutTimer < timerRedWarn ? '#FFFFFF' : '#60477B',
            fontWeight: '500',
          }}>
          登出倒數:{logoutTimer ? Math.floor(logoutTimer) : '...'}秒
        </Text>
      </View>
    </View>
  );
};

const refreshTokenOneTime = async (authContext: authContextType) => {
  console.log('Do one-time refresh');
  const refreshData = {
    refresh_token: authContext.authToken[cq9BackendURL].refreshToken,
  };
  axios
    .post(
      `${cq9BackendURL}/api/v1/auth/token/refresh`,
      objToQueryString(refreshData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
      },
    )
    .then(tokenRefreshResponse => {
      const tokenData = tokenRefreshResponse.data;

      if (tokenData.access_token == null) {
        Alert.alert('刷新失敗');
        const err = 'One-time refresh get access_token as null';
        console.log(err);
        authContext.logout();
      } else {
        authContext.storeAuthToken({
          [cq9BackendURL]: {
            accessToken: tokenData.access_token,
            refreshToken: '',
          },
        });
      }
    })
    .catch(error => {
      Alert.alert('刷新失敗');
      console.log(error);
      authContext.logout();
    });
};

export const ExtensionTime = () => {
  const authContext = useContext(AuthContext);
  let showBox = authContext.showExtensionTime;
  const showBoxAgain = authContext.timeDelayAgain;

  const disFn = () => {
    if (showBoxAgain) {
      showBox = false;
    }

    return showBox;
  };

  return (
    <View style={[styles.fiexBox, {display: disFn() ? 'flex' : 'none'}]}>
      <View style={styles.extensionTimeBox}>
        <View style={styles.extensionTimeBox_S}>
          <Image
            source={require('../../res/picture/extensionTime.png')}
            style={styles.image1}
          />
          <Text style={styles.font1}>是否延長時間(180秒)</Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Pressable
            style={styles.confirmBtn}
            onPress={() => {
              authContext.setShowExtensionTime(false);
            }}>
            <Text style={styles.font1}>否</Text>
          </Pressable>
          <Pressable
            style={styles.confirmBtn}
            onPress={async () => {
              await refreshTokenOneTime(authContext);
              authContext.setShowExtensionTime(false);
              authContext.setTimeDelayAgain(true);
            }}>
            <Text style={styles.font1}>是</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textBox: {
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  fiexBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D1D1DB2',
  },
  extensionTimeBox: {
    backgroundColor: '#7B80B2',
    width: '85%',
    height: 262,
    borderRadius: 15,
    position: 'absolute',
    paddingHorizontal: 10,
  },
  extensionTimeBox_S: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtn: {
    borderRadius: 20,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    marginHorizontal: 10,
  },
  closeBtnBox: {position: 'absolute', top: 20, right: 20},
  font1: {color: '#FFFFFF', fontSize: 20, fontWeight: '700'},
  image1: {
    width: 64,
    height: 74,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  image2: {width: 18.5, height: 18.5, resizeMode: 'contain'},
});
