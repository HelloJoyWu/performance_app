import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ImageBackground,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthContext} from '../../context/authContext';
import version from '../../version.json';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';
import * as common from '../../components/common';

interface settingScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'SettingScreen'>;
}

const SettingScreen: React.FC<settingScreenProps> = ({navigation}) => {
  const authContext = useContext(AuthContext);

  const versionText: any = version.version;

  const arrowSet = () => {
    return (
      <View style={styles.buttonBoxRight}>
        <Image
          source={require('../../../res/arrow.png')}
          style={{
            transform: [{rotate: '-90deg'}],
            width: 15,
            alignSelf: 'flex-end',
          }}
        />
      </View>
    );
  };

  const littleImg = (name: string) => {
    if (name === 'changeName') {
      return (
        <Image
          source={require('../../../res/picture/changeName.png')}
          style={{width: 14, height: 11, marginRight: 10}}
          resizeMode="contain"
        />
      );
    } else if (name === 'appInfo') {
      return (
        <Image
          source={require('../../../res/picture/appInfo.png')}
          style={{width: 14, height: 11, marginRight: 10}}
          resizeMode="contain"
        />
      );
    } else if (name === 'changePassword') {
      return (
        <Image
          source={require('../../../res/picture/changePassword.png')}
          style={{width: 14, height: 11, marginRight: 10}}
          resizeMode="contain"
        />
      );
    }
  };

  const onButton = (name: string, imgName: string, screen: any) => {
    return (
      <View>
        <Pressable
          style={styles.buttonBox}
          onPress={() => {
            navigation.push(screen);
          }}>
          <View
            style={{width: '90%', flexDirection: 'row', alignItems: 'center'}}>
            {littleImg(imgName)}
            <Text style={{color: '#FFFFFF', fontSize: 16}}>{name}</Text>
          </View>
          {arrowSet()}
        </Pressable>
      </View>
    );
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
              HI!{authContext.authInfo.lastName}
            </Text>
          </View>
          {LogoutTimer()}
          <View style={{marginVertical: 5}}>
            <Text style={{color: '#FFFFFF', fontSize: 26, fontWeight: '600'}}>
              設定
            </Text>
          </View>
          <View style={{width: '100%'}}>
            <Text style={styles.contentLittle}>個人資訊</Text>
            {onButton('變更暱稱', 'changeName', 'ChangeNameScreen')}
            {onButton('變更密碼', 'changePassword', 'ChangePasswordScreen')}
          </View>
          <View style={{width: '100%'}}>
            <Text style={styles.contentLittle}>應用程式資訊</Text>
            <View style={styles.buttonBox}>
              <View
                style={{
                  width: '80%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {littleImg('appInfo')}
                <Text style={{color: '#FFFFFF', fontSize: 16}}>關於D2U</Text>
              </View>
              <View>
                <Text style={{color: '#FFFFFF83', fontSize: 14}}>
                  版本：{versionText}
                </Text>
              </View>
            </View>
          </View>
          <View style={{width: '100%'}}>
            <Pressable
              style={[styles.buttonBox, {backgroundColor: '#636DEA'}]}
              onPress={() => {
                authContext.logout();
              }}>
              <View style={{width: '100%', alignItems: 'center'}}>
                <Text
                  style={{color: '#FFFFFF', fontSize: 18, fontWeight: '600'}}>
                  登出
                </Text>
              </View>
            </Pressable>
          </View>
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
  buttonBox: {
    width: '85%',
    backgroundColor: '#242740',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  buttonBoxLeft: {
    width: '90%',
  },
  buttonBoxRight: {
    width: '10%',
  },
  contentLittle: {
    marginVertical: 10,
    marginLeft: '8%',
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default SettingScreen;
