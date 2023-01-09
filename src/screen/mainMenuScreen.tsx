import React, {
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ImageBackground,
  AppState,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AxiosContext} from '../context/axiosContext';
import * as common from '../components/common';
import {format} from 'date-fns';
import levelList from '../components/hierarchy.json';
import {AuthContext} from '../context/authContext';
import * as StorageHelper from '../helpers/storageHelper';
import {LogoutTimer, ExtensionTime} from '../components/logoutTimer';

interface mainMenuScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'MainMenuScreen'>;
}

const level: any = levelList;

const MainMenuScreen = ({navigation}: mainMenuScreenProps) => {
  const authContext = useContext(AuthContext);
  const axiosContext = useContext(AxiosContext);
  const [noticeNum, setNoticeNum] = useState<Number>(0);
  const appState = useRef('active');

  const goToSpinnerScreen = useCallback(() => {
    navigation.navigate('SpinnerScreen');
  }, [navigation]);

  const onAppStateChangeLogout = useCallback(
    (nextAppState: any) => {
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
        authContext.logout();
      } else if (
        appState.current.match('active') &&
        nextAppState.match(/inactive|background/)
      ) {
        goToSpinnerScreen();
      }
      appState.current = nextAppState;
      console.log('Update app state');
    },
    [authContext, goToSpinnerScreen],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      onAppStateChangeLogout,
    );
    return () => {
      subscription.remove();
    };
  }, [onAppStateChangeLogout]);

  useEffect(() => {
    authContext.setLoginTime(new Date().getTime());
    authContext.setShowExtensionTime(false);
    authContext.setTimeDelayAgain(false);
  }, []);

  const getUserfetch = useCallback(async () => {
    try {
      const user_data = await axiosContext.authCq9Axios.get('/api/v1/users/me');
      console.log('Loading user information success');
      authContext.storeAuthInfo({
        username: user_data.data.username,
        lastName: user_data.data.last_name,
        groups: user_data.data.groups,
        email: user_data.data.email,
      });
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch user info failed', alertMsg);
      Alert.alert('請洽相關人員');
      authContext.logout();
    }
  }, [axiosContext.authCq9Axios]);

  const featchTypeData = useCallback(async () => {
    try {
      const respAgent = await axiosContext.authCq9Axios.get(
        '/api/v1/inquiry/agent/list',
      );

      console.log('Loading champ latest currency performane success');

      agentClassification(respAgent.data);
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, [axiosContext.authCq9Axios]);

  const agentClassification = (data: any) => {
    const owner_list: any[] = [];
    for (var i = 0; i < data.length; i++) {
      const database = data[i];
      if (database.agent_type === 'owner') {
        owner_list.push({label: database.account, value: database.id});
      }
    }
    StorageHelper.storeOwnerList({
      key: 'ownerList',
      list: owner_list,
    });
  };

  useEffect(() => {
    console.log('Loading latest performane');
    getUserfetch();
    featchTypeData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bgImage/menuBg.png')}
        style={styles.backGroundSet}>
        <View>
          <View style={{position: 'absolute'}}>
            <Text style={styles.showPlayerText}>HI！</Text>
            <Text style={styles.showPlayerText}>
              {authContext.authInfo.lastName}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 25, color: '#FFFFFF', fontWeight: '400'}}>
              {format(new Date(), 'yyyy-MM-dd')}
            </Text>
            {LogoutTimer()}
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            width: '100%',
            height: '90%',
          }}>
          <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            <View style={styles.bodyButton}>
              <Pressable
                onPress={() => {
                  navigation.push('MenuScreen');
                }}>
                <Image
                  source={require('./../../res/button/performance.png')}
                  style={styles.imageButton}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
            <View style={styles.bodyButton}>
              <Pressable
                onPress={() => {
                  navigation.push('MarketMenuScreen');
                }}>
                <Image
                  source={require('./../../res/button/market.png')}
                  style={styles.imageButton}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
            <View style={styles.bodyButton}>
              <Pressable
                onPress={() => {
                  // Alert.alert('coming soon');
                  navigation.push('QuickSearchScreen');
                }}>
                <Image
                  source={require('./../../res/button/inquire.png')}
                  style={styles.imageButton}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <View style={styles.bodyButton}>
              <Pressable
                onPress={() => {
                  setNoticeNum(0);
                  navigation.push('MessagePushScreen');
                }}>
                <Image
                  source={require('./../../res/button/notice.png')}
                  style={styles.imageButton}
                  resizeMode="contain"
                />
                <View
                  style={[
                    styles.showRedNum,
                    {display: noticeNum > 0 ? 'flex' : 'none'},
                  ]}>
                  <Text style={{color: '#FFFFFF', fontWeight: '600'}}>
                    {noticeNum}
                  </Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.bodyButton}>
              <Pressable
                onPress={() => {
                  navigation.push('DockingAreaScreen');
                }}>
                <Image
                  source={require('./../../res/button/docking.png')}
                  style={styles.imageButton}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </ScrollView>
        </View>
        {common.burgerMenu(navigation)}
        {ExtensionTime()}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9a92a9',
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
    padding: 20,
  },
  headStickers: {
    marginBottom: 5,
    backgroundColor: '#656CA5',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: 'center',
  },
  headStickersText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'center',
  },
  playerSet: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  showPlayerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '300',
  },
  bodyButton: {
    marginVertical: 5,
    // backgroundColor: 'red',
  },
  imageButton: {
    width: 333,
    height: 121,
  },
  showRedNum: {
    position: 'absolute',
    top: '40%',
    left: '85%',
    backgroundColor: '#FF0000',
    borderRadius: 50,
    padding: 3,
  },
});

export default MainMenuScreen;
