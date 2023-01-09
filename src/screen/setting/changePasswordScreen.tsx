import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ImageBackground,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {AxiosContext} from '../../context/axiosContext';
import {AuthContext} from '../../context/authContext';
import * as Keychain from 'react-native-keychain';
import {objToQueryString} from '../../core/util';
import {cq9BackendURL} from '../../context/axiosContext';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';
import * as common from '../../components/common';

interface changePasswordScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ChangePasswordScreen'>;
}

const ChangePasswordScreen: React.FC<changePasswordScreenProps> = ({
  navigation,
}) => {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [againNewPassword, setAgainNewPassword] = useState<string>('');

  const [oldPasswordShow, setOldPasswordShow] = useState<boolean>(true);
  const [newPasswordShow, setNewPasswordShow] = useState<boolean>(true);
  const [againNewPasswordShow, setAgainNewPasswordShow] =
    useState<boolean>(true);

  const closeEyes = '../../../res/eyesClose.png';
  const openEyes = '../../../res/eyesOpen.png';

  const checkPassword = async () => {
    if (newPassword !== againNewPassword) {
      Alert.alert('新密碼不一致');
      setNewPassword('');
      setAgainNewPassword('');
      return;
    }
    if (newPassword.length < 8) {
      setNewPassword('');
      setAgainNewPassword('');
      Alert.alert('密碼長度不足');
      return;
    }

    const upperCasePattern = /[A-Z]/; //大寫模式
    const symbolsPattern = /\W/; //符號模式

    var upperCaseNum = 0;
    var symbolsNum = 0;

    for (var i = 0; i < 8; i++) {
      if (againNewPassword[i] === ' ') {
        Alert.alert('禁止使用空白');
        setNewPassword('');
        setAgainNewPassword('');
        return;
      }
      if (upperCasePattern.test(againNewPassword[i])) {
        upperCaseNum++;
      }
      if (symbolsPattern.test(againNewPassword[i])) {
        symbolsNum++;
      }
    }

    if (upperCaseNum !== 1 || symbolsNum !== 1) {
      setNewPassword('');
      setAgainNewPassword('');
      Alert.alert('密碼不符合規則');
      return;
    }

    console.log(oldPassword);
    console.log(againNewPassword);
    // Verify old password
    try {
      let login_data = {
        username: authContext.authInfo.username,
        password: oldPassword,
      };

      const response = await axios.post(
        `${cq9BackendURL}/api/v1/auth/verify`,
        objToQueryString(login_data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        },
      );
      console.log('Verify user password success', response);
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Verify failed', alertMsg);
      Alert.alert('原密碼認證失敗！');
      return;
    }

    // Set password API
    try {
      await axiosContext.authCq9Axios.put('/api/v1/users/me', {
        password: newPassword,
      });
      console.log('Update user password success');
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Update user info failed', alertMsg);
      return;
    }

    await Keychain.resetGenericPassword();
    authContext.logout();
    Alert.alert('密碼已修改，請重新登入');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bgImage/loginBG.png')}
        style={styles.backGroundSet}>
        <View style={{position: 'absolute', top: 10, left: 0}}>
          <Pressable
            onPress={() => navigation.pop()}
            style={styles.backButtonSet}>
            {common.backButton()}
          </Pressable>
        </View>

        <View style={styles.contentSet}>
          <View>
            <Text style={{color: '#FFFFFF', fontSize: 30}}>
              HI ! {authContext.authInfo.lastName}
            </Text>
          </View>
          {LogoutTimer()}
          <View style={{marginVertical: 5}}>
            <Text style={{color: '#FFFFFF', fontSize: 26, fontWeight: '600'}}>
              變更密碼
            </Text>
          </View>
          <View>
            <Text style={{color: '#FFCB64', fontSize: 11}}>
              *限8碼(6碼+特殊符號1＋英文大寫1)*
            </Text>
          </View>
          <View style={{width: '85%'}}>
            <Text style={{color: '#FFFFFF', fontSize: 12}}>目前密碼</Text>
            <View style={styles.textInputView}>
              <TextInput
                style={styles.textInputBox}
                autoCapitalize="none"
                maxLength={8}
                onChangeText={text => setOldPassword(text)}
                value={oldPassword}
                secureTextEntry={oldPasswordShow}
              />
              <Pressable
                onPress={() => {
                  setOldPasswordShow(!oldPasswordShow);
                }}>
                {oldPasswordShow ? (
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

            <Text style={{color: '#FFFFFF', fontSize: 12}}>新密碼</Text>
            <View style={styles.textInputView}>
              <TextInput
                style={styles.textInputBox}
                autoCapitalize="none"
                maxLength={8}
                onChangeText={text => setNewPassword(text)}
                value={newPassword}
                secureTextEntry={newPasswordShow}
              />
              <Pressable
                onPress={() => {
                  setNewPasswordShow(!newPasswordShow);
                }}>
                {newPasswordShow ? (
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

            <Text style={{color: '#FFFFFF', fontSize: 12}}>再次輸入新密碼</Text>
            <View style={styles.textInputView}>
              <TextInput
                style={styles.textInputBox}
                autoCapitalize="none"
                maxLength={8}
                onChangeText={text => setAgainNewPassword(text)}
                value={againNewPassword}
                secureTextEntry={againNewPasswordShow}
              />
              <Pressable
                onPress={() => {
                  setAgainNewPasswordShow(!againNewPasswordShow);
                }}>
                {againNewPasswordShow ? (
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
          </View>
          <Pressable
            style={{
              borderRadius: 10,
              margin: 10,
              paddingVertical: 7,
              alignItems: 'center',
              backgroundColor: '#636DEA',
              width: '85%',
            }}
            onPress={() => {
              checkPassword();
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: '600'}}>
              確認送出
            </Text>
          </Pressable>
        </View>
        {ExtensionTime()}
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
  contentSet: {
    marginTop: '15%',
    alignItems: 'center',
  },
  backButtonSet: {
    alignItems: 'center',
    backgroundColor: '#666DC1',
    padding: 7,
    paddingLeft: 20,
    paddingRight: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  textInputView: {
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#242740',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputBox: {
    fontSize: 20,
    color: '#FFFFFF',
    width: '90%',
  },
});

export default ChangePasswordScreen;
