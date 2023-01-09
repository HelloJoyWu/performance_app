import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Image,
  AppState,
  Alert,
  Pressable,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as StorageHelper from '../helpers/storageHelper';

interface callScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'CallScreen'>;
}

const CallScreen: React.FC<callScreenProps> = ({navigation}) => {
  const [passWordStr, setPassWordStr] = useState<string>('');
  const [passWordValue, setPassWordValue] = useState<string>('');
  // phone-unlock 電話解鎖
  const [correctPassword, setCorrectPassword] = useState<string>('051798');

  const appState = useRef('active');

  const onAppStateChangeToRuler = useCallback(
    (nextAppState: any) => {
      const goToRulerScreen = () => {
        navigation.navigate('RulerScreen');
      };
      console.log(
        'main-menu APP state from',
        appState.current,
        'to',
        nextAppState,
      );
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        goToRulerScreen();
      } else if (
        appState.current.match('active') &&
        nextAppState.match(/inactive|background/)
      ) {
        goToRulerScreen();
      }
      appState.current = nextAppState;
      console.log('Phone update app state');
    },
    [navigation],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      onAppStateChangeToRuler,
    );
    return () => {
      subscription.remove();
    };
  }, [onAppStateChangeToRuler]);

  useEffect(() => {
    getStoragePassword();
  }, []);

  const getStoragePassword = async () => {
    const storagePassword = await StorageHelper.getRulerPassword('password');
    if (storagePassword) {
      setCorrectPassword(storagePassword);
    }
  };

  const difImgUrl = (name: string) => {
    if (name === '0') {
      return (
        <Image
          source={require('../../res/call/num0.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '1') {
      return (
        <Image
          source={require('../../res/call/num1.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '2') {
      return (
        <Image
          source={require('../../res/call/num2.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '3') {
      return (
        <Image
          source={require('../../res/call/num3.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '4') {
      return (
        <Image
          source={require('../../res/call/num4.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '5') {
      return (
        <Image
          source={require('../../res/call/num5.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '6') {
      return (
        <Image
          source={require('../../res/call/num6.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '7') {
      return (
        <Image
          source={require('../../res/call/num7.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '8') {
      return (
        <Image
          source={require('../../res/call/num8.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '9') {
      return (
        <Image
          source={require('../../res/call/num9.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '0') {
      return (
        <Image
          source={require('../../res/call/num0.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '*') {
      return (
        <Image
          source={require('../../res/call/meter.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === '#') {
      return (
        <Image
          source={require('../../res/call/well.png')}
          style={styles.imageSize}
        />
      );
    }
  };

  const createNumButton = (name: string) => {
    return (
      <Pressable
        onPress={() => {
          setPassWordValue(passWordValue + name);
          setPassWordStr(passWordStr + '*');
        }}>
        {difImgUrl(name)}
      </Pressable>
    );
  };

  const sendPassword = () => {
    if (correctPassword === '') {
      if (passWordValue.length >= 6) {
        setCorrectPassword(passWordValue);
        StorageHelper.storeRulerPassword({
          key: 'password',
          passwordStr: passWordValue,
        });
        Alert.alert('密碼設定成功,請重新輸入');
      } else {
        Alert.alert('密碼不得小於6碼');
      }
      setPassWordValue('');
      setPassWordStr('');
      return;
    }

    if (passWordValue === correctPassword) {
      setPassWordValue('');
      setPassWordStr('');
      navigation.navigate('LoginScreen');
    } else if (passWordValue === '***') {
      setCorrectPassword('');
      setPassWordValue('');
      setPassWordStr('');
      Alert.alert('請重設密碼');
    } else {
      setPassWordValue('');
      setPassWordStr('');
      Alert.alert('錯誤');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: '100%', height: '100%'}}>
        <View
          style={{
            width: '100%',
            height: '15%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 40, marginTop: 10, color: '#FFFFFF'}}>
            {passWordStr}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: '75%',
            // backgroundColor: '#00EEFF',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            {createNumButton('1')}
            {createNumButton('2')}
            {createNumButton('3')}
          </View>
          <View style={{flexDirection: 'row'}}>
            {createNumButton('4')}
            {createNumButton('5')}
            {createNumButton('6')}
          </View>
          <View style={{flexDirection: 'row'}}>
            {createNumButton('7')}
            {createNumButton('8')}
            {createNumButton('9')}
          </View>
          <View style={{flexDirection: 'row'}}>
            {createNumButton('*')}
            {createNumButton('0')}
            {createNumButton('#')}
          </View>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Image
                source={require('../../res/call/telephone.png')}
                style={[styles.imageSize, {opacity: 0}]}
              />
            </View>
            <Pressable
              onPress={() => {
                sendPassword();
              }}>
              <Image
                source={require('../../res/call/telephone.png')}
                style={styles.imageSize}
              />
            </Pressable>
            <Pressable
              style={[
                styles.imageSize,
                {justifyContent: 'center', alignItems: 'center'},
              ]}
              onPress={() => {
                const str = passWordValue.substring(
                  0,
                  passWordValue.length - 1,
                );
                const meterStr = passWordStr.substring(
                  0,
                  passWordStr.length - 1,
                );
                setPassWordValue(str);
                setPassWordStr(meterStr);
              }}>
              <Image
                source={require('../../res/call/del.png')}
                style={{width: 30, height: 30}}
                resizeMode={'contain'}
              />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: '10%',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
          }}>
          <Image
            source={require('../../res/call/image1.png')}
            style={styles.imageFixedSize}
            resizeMode={'contain'}
          />
          <Image
            source={require('../../res/call/image2.png')}
            style={styles.imageFixedSize}
            resizeMode={'contain'}
          />
          <Image
            source={require('../../res/call/image3.png')}
            style={styles.imageFixedSize}
            resizeMode={'contain'}
          />
          <Image
            source={require('../../res/call/image4.png')}
            style={styles.imageFixedSize}
            resizeMode={'contain'}
          />
          <Image
            source={require('../../res/call/image5.png')}
            style={styles.imageFixedSize}
            resizeMode={'contain'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backGroundSet: {
    flex: 1,
  },
  imageSize: {
    width: 80,
    height: 80,
    margin: 15,
  },
  imageFixedSize: {
    width: '15%',
    height: 50,
  },
});

export default CallScreen;
