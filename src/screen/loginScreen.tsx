import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  TextInput,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {AuthContext} from '../context/authContext';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import {objToQueryString} from '../core/util';
import {cq9BackendURL} from '../context/axiosContext';
import BiometryID from '../core/biometryID';
import AsyncStorage from '@react-native-async-storage/async-storage';
import version from '../version.json';

const LoginScreen: React.FC<{}> = ({}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const [disabledBiometrySwitch, setDisabledBiometrySwitch] = useState(false);
  const [resetButtonDis, setResetButtonDis] = useState<boolean>(false);
  const versionText: any = version.version;
  const [passwordDisplay, setPasswordDisplay] = useState<boolean>(true);

  const closeEyes = '../../res/eyesCloseBlack.png';
  const openEyes = '../../res/eyesOpenBlack.png';

  useEffect(() => {
    BiometryID.isSupported()
      .then(async biometryType => {
        console.log('Receieve biometry isSupported', biometryType);
        if (biometryType) {
          setDisabledBiometrySwitch(false);
        } else {
          setDisabledBiometrySwitch(true);
          console.log('biometryType NOT support');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const onBiometryLogin = async () => {
    try {
      authContext.setIsLoading(true);
      let login_data = {
        username: '',
        password: '',
      };
      await Keychain.getGenericPassword()
        .then(async result => {
          console.log('Login by keychain storage');
          if (result) {
            const loginInfo = JSON.parse(result.password);
            if (!loginInfo.password || loginInfo.password === '') {
              Alert.alert(
                'Nothing is stored for biometry. Please setup again!',
              );
              await Keychain.resetGenericPassword();
              authContext.setIsLoading(false);
              return;
            }
            await BiometryID.authenticate('使用生物識別登入')
              .then(() => {
                console.log('get biometry success!');
                login_data.username = loginInfo.username;
                login_data.password = loginInfo.password;
              })
              .catch(async error => {
                console.log('BiometryID get auth', error);
                console.log(error.details);
                if (error.details.name === 'LAErrorAuthenticationFailed') {
                  await axios
                    .get(
                      `${cq9BackendURL}/api/v1/deactive/${login_data.username}`,
                    )
                    .catch(respError => {
                      console.log('Bio-auth error for deactive', respError);
                    });
                }
                authContext.setIsLoading(false);
              });
          } else {
            Alert.alert('請確認', '是否使用當前帳號密碼於生物識別登入!', [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('Set-confirmation canceled');
                  authContext.setIsLoading(false);
                },
              },
              {
                text: 'OK',
                onPress: async () => {
                  login_data.username = username;
                  login_data.password = password;
                  await BiometryID.authenticate('驗證生物識別登入')
                    .then(async () => {
                      console.log('Setup biometry success!');
                      await Keychain.setGenericPassword(
                        'login',
                        JSON.stringify(login_data),
                      );
                      Alert.alert('設定成功！', '請再次點擊生物識別登入');
                    })
                    .catch(error => {
                      console.log('BiometryID set auth', error);
                    });
                },
              },
            ]);
            return;
          }
        })
        .catch(error => {
          Alert.alert('Something went wrong.');
          console.log('Keychain failed', error);
        });

      if (login_data.username === '' || login_data.password === '') {
        authContext.setIsLoading(false);
        return;
      }

      const cq9Response = await axios.post(
        `${cq9BackendURL}/api/v1/auth/token`,
        objToQueryString(login_data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        },
      );

      authContext.setAuthState(cq9Response.data.access_token != null);
      authContext.storeAuthToken({
        [cq9BackendURL]: {
          accessToken: cq9Response.data.access_token,
          refreshToken: cq9Response.data.refresh_token,
        },
      });

      let nowTimestamp = new Date().getTime();
      await AsyncStorage.setItem(
        'bgInactive@performanceAPP',
        nowTimestamp.toString(),
      );
    } catch (error: any) {
      authContext.setAuthState(false);
      console.error('Login Failed', error);
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      Alert.alert('Login Failed', alertMsg);
    } finally {
      authContext.setIsLoading(false);
    }
  };

  const onLogin = async () => {
    try {
      authContext.setIsLoading(true);
      let login_data = {
        username: username,
        password: password,
      };

      const cq9Response = await axios.post(
        `${cq9BackendURL}/api/v1/auth/token`,
        objToQueryString(login_data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        },
      );

      authContext.setAuthState(cq9Response.data.access_token != null);
      authContext.storeAuthToken({
        [cq9BackendURL]: {
          accessToken: cq9Response.data.access_token,
          refreshToken: cq9Response.data.refresh_token,
        },
      });

      let nowTimestamp = new Date().getTime();
      await AsyncStorage.setItem(
        'bgInactive@performanceAPP',
        nowTimestamp.toString(),
      );
    } catch (error: any) {
      authContext.setAuthState(false);
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      Alert.alert('Login Failed', alertMsg);
    } finally {
      authContext.setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bgImage/loginBG.png')}
        style={styles.backGroundSet}>
        <View style={{marginTop: '5%'}}>
          <Image
            source={require('../../res/logo.png')}
            style={{
              width: 63,
              height: 63,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
          <Text style={{alignSelf: 'center', color: '#FFFFFF', fontSize: 18}}>
            welcome!
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              color: '#FFFFFF',
              fontSize: 36,
              fontWeight: '800',
            }}>
            Login!
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <ScrollView
            style={{height: '70%'}}
            contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
            keyboardDismissMode={'on-drag'}
            bounces={false}
            overScrollMode="never">
            <View style={styles.textInputView}>
              <TextInput
                placeholder="username"
                placeholderTextColor="#3E126C4B"
                style={styles.textInputBox}
                autoCapitalize="none"
                onChangeText={text => setUsername(text)}
                value={username}
              />
            </View>
            <View
              style={[
                styles.textInputView,
                {flexDirection: 'row', paddingLeft: 35, paddingRight: 10},
              ]}>
              <TextInput
                placeholder="password"
                placeholderTextColor="#3E126C4B"
                style={styles.textInputBox}
                secureTextEntry={passwordDisplay}
                onChangeText={text => setPassword(text)}
                value={password}
              />
              <Pressable
                onPress={() => {
                  setPasswordDisplay(!passwordDisplay);
                }}>
                {passwordDisplay ? (
                  <Image
                    source={require(closeEyes)}
                    style={{width: 25, height: 25, resizeMode: 'contain'}}
                  />
                ) : (
                  <Image
                    source={require(openEyes)}
                    style={{width: 25, height: 25, resizeMode: 'contain'}}
                  />
                )}
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                onLogin();
              }}
              style={[styles.loginButton, {backgroundColor: '#A6ACFF'}]}>
              <View>
                <Text style={styles.loginText}>Sign in</Text>
              </View>
            </Pressable>

            <View style={styles.textBox}>
              <View style={styles.lineBox} />
              <Text style={{fontSize: 16, color: '#FFFFFF'}}>
                {' '}
                或用以下方式{' '}
              </Text>
              <View style={styles.lineBox} />
            </View>

            <Pressable
              onPress={() => {
                if (disabledBiometrySwitch) {
                  Alert.alert('Biometry not support!');
                } else {
                  onBiometryLogin();
                }
              }}
              style={[styles.loginButton, {backgroundColor: '#FFFFFF'}]}>
              <Image
                source={require('../../res/Biometrics.png')}
                style={{height: 30.9, resizeMode: 'contain'}}
              />
            </Pressable>

            {/* <Pressable
              style={[styles.loginButton, {backgroundColor: '#FFFFFF'}]}
              onPress={() => {
                onGoogleLogin();
              }}>
              <Image source={require('../../res/btn_google.png')} />
            </Pressable> */}

            <Pressable
              style={styles.textBox}
              onLongPress={() => {
                setResetButtonDis(!resetButtonDis);
              }}>
              <View style={styles.lineBox} />
              <Text style={{fontSize: 16, color: '#FFFFFF'}}>
                {' '}
                重新設定生物識別{' '}
              </Text>
              <View style={styles.lineBox} />
            </Pressable>

            <Pressable
              style={[
                styles.resetButton,
                {
                  display: resetButtonDis ? 'flex' : 'none',
                },
              ]}
              onPress={() => {
                console.log('重新設定指紋');
                Alert.alert('重新帳號密碼', '請確認使否重設儲存的帳號密碼', [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      return;
                    },
                  },
                  {
                    text: 'OK',
                    onPress: async () => {
                      await Keychain.resetGenericPassword();
                    },
                  },
                ]);
              }}>
              <Image
                source={require('../../res/resetbiometrics.png')}
                style={{width: 50, height: 50, resizeMode: 'contain'}}
              />
            </Pressable>
          </ScrollView>
        </View>
        <View style={{position: 'absolute', bottom: 10, right: 10}}>
          <Text style={{color: '#FFFFFF83', fontSize: 14}}>
            版本：{versionText}
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#71408e',
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
  },
  textInputView: {
    borderRadius: 40,
    margin: 10,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#00000029',
    shadowOffset: {width: -1.5, height: -1.5},
    shadowOpacity: 1,
    shadowRadius: 0.5,
    elevation: 1.5,
    width: '88%',
  },
  textInputBox: {
    fontSize: 25,
    color: '#3E126C',
    width: '90%',
    textAlign: 'center',
  },
  textBox: {
    alignItems: 'center',
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  lineBox: {
    height: 1,
    width: 70,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    marginHorizontal: 15,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    width: '100%',
  },
  loginButton: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '88%',
    height: 45,
    borderRadius: 40,
    shadowColor: '#00000029',
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 1,
    shadowRadius: 1.5,
    elevation: 1.5,
  },
  resetButton: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    borderRadius: 25,
    padding: 7,
    shadowColor: '#00000029',
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 1,
    shadowRadius: 1.5,
    elevation: 1.5,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
  },
});

export default LoginScreen;
