import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ImageBackground,
  Alert,
  TextInput,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AxiosContext} from '../../context/axiosContext';
import {AuthContext} from '../../context/authContext';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';
import * as common from '../../components/common';

interface changeNameScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ChangeNameScreen'>;
}

const ChangeNameScreen: React.FC<changeNameScreenProps> = ({navigation}) => {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  const [changeName, setChangeName] = useState<string>('');

  const checkChangeName = async () => {
    // 檢查暱稱格式
    if (changeName.length <= 0) {
      Alert.alert('請輸入想更改暱稱');
      return;
    }
    if (changeName.length > 8) {
      Alert.alert('暱稱過長');
      setChangeName('');
      return;
    }
    if (changeName.includes(' ')) {
      setChangeName('');
      Alert.alert('禁止使用空白');
      return;
    }
    const chineseCasePattern = /[\u4e00-\u9fa5]/;
    if (chineseCasePattern.test(changeName)) {
      Alert.alert('禁止使用中文');
      return;
    }

    // Set last_name API
    try {
      await axiosContext.authCq9Axios.put('/api/v1/users/me', {
        last_name: changeName,
      });
      let updateAuthInfo = authContext.authInfo;
      updateAuthInfo.lastName = changeName;
      authContext.storeAuthInfo(updateAuthInfo);
      console.log('Update user last_name success');
      setChangeName('');
      Alert.alert('設定成功！');
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Update user info failed', alertMsg);
      return;
    }
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
              變更暱稱
            </Text>
          </View>
          <View>
            <Text style={{color: '#FFCB64', fontSize: 11}}>
              *限8碼(英文數字符號組合)*
            </Text>
          </View>
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInputBox}
              autoCapitalize="none"
              maxLength={8}
              onChangeText={text => setChangeName(text)}
              value={changeName}
            />
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
              console.log(changeName);
              checkChangeName();
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
    margin: 10,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#242740',
    borderColor: '#ACB2FF',
    borderWidth: 1,
    width: '85%',
  },
  textInputBox: {
    fontSize: 20,
    color: '#FFFFFF',
    width: '90%',
  },
});

export default ChangeNameScreen;
