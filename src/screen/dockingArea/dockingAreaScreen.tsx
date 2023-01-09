import React, {useContext, useEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import MenuOptionButton from '../../components/menuOptionButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {AxiosContext} from '../../context/axiosContext';
import {AuthContext} from '../../context/authContext';
import {getUTCLatestDateRange} from '../../core/util';
import * as common from '../../components/common';
import {format} from 'date-fns';
import levelList from '../../components/hierarchy.json';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';

interface dockingAreaScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'DockingAreaScreen'>;
}

const level: any = levelList;

const DockingAreaScreen: React.FC<dockingAreaScreenProps> = ({navigation}) => {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  const [legoDisplay, setLegoDisplay] = useState<boolean>(false);

  const [eyesStatus, setEyesStatus] = useState<boolean>(false);
  const closeEyes = '../../../res/eyesClose.png';
  const openEyes = '../../../res/eyesOpen.png';

  const {utcNowDateStr, utcPreDateStr} = getUTCLatestDateRange(1);

  const [legoDatabase, setLegoDatabase] = useState<any>({
    bet: 0,
    player: 0,
    brand: 'champland',
    date: utcPreDateStr,
    reception: false,
  });

  const [showLegoDatabase] = useState<any>({
    date: utcPreDateStr,
    bet: '*****',
    player: '*****',
    brand: 'lego',
  });

  const [legoButton, setLegoButton] = useState<boolean>(true);
  const [showReorganizeDisplay, setShowReorganizeDisplay] =
    useState<boolean>(false);
  const [showReorganizeText, setShowReorganizeText] =
    useState<String>('已更新為最新資訊！');

  const setDisPley = (name: string, levelStringList: string[]) => {
    if (levelStringList.indexOf(name) >= 0) {
      return true;
    } else {
      return false;
    }
  };

  const fetchLatest = useCallback(
    async (cq9Data: any) => {
      try {
        const [latestLegoNumResp] = await Promise.all([
          axiosContext.authCq9Axios.get(
            '/api/v1/inquiry/sales/specify/project/date',
            {
              params: {
                from_date: utcPreDateStr,
                to_date: utcNowDateStr,
                by_brand: 'lego',
                by_project: 'qt',
              },
            },
          ),
        ]);
        console.log('Loading latest performane success');
        setNowDataTime(getNowTime);
        var updateDate: boolean = false;
        setLegoButton(false);

        if (latestLegoNumResp.data[0]) {
          latestLegoNumResp.data[0].reception = true;
          setLegoDatabase(latestLegoNumResp.data[0]);
          showNumberGroup(
            latestLegoNumResp.data[0].brand,
            latestLegoNumResp.data[0].bet,
            latestLegoNumResp.data[0].player,
          );
          if (!updateDate) {
            if (
              cq9Data.bet !== latestLegoNumResp.data[0].bet &&
              cq9Data.player !== latestLegoNumResp.data[0].player
            ) {
              updateDate = true;
            }
          }
        }

        showReorganize(updateDate);
      } catch (error: any) {
        const alertMsg = error.response.config.url
          ? `[${error.response.status}] ${error.response.data.message}`
          : `${error}`;
        console.error('Fetch latest failed', alertMsg);
      }
    },
    [axiosContext],
  );

  const getUserDisplay = useCallback(() => {
    const levelStringList = level[authContext.authInfo.groups[0]];
    setLegoDisplay(setDisPley('lego', levelStringList));
  }, []);

  useEffect(() => {
    console.log('Loading latest performane');
    getUserDisplay();
    fetchLatest(legoDatabase);
  }, [fetchLatest]);

  const getNowTime = () => {
    const date = format(new Date(), ' yyyy-MM-dd H:mm:ss');
    return date;
  };
  const [nowDataTiem, setNowDataTime] = useState(getNowTime);

  const createOptionButton = (
    showdatabase: any,
    setDisplayShow: boolean,
    disabled: boolean,
    database: any,
  ) => {
    if (!setDisplayShow) {
      return null;
    }
    var info = showdatabase;
    var data = database.brand ? database : info;
    data.userName = authContext.authInfo.lastName;
    return (
      <MenuOptionButton
        date={common.fullDateFormat(info.date)}
        totBet={info.bet}
        buttonDisabled={disabled}
        totPlayer={info.player}
        imgUrl={info.brand}
        key={info.brand}
        displayShow={setDisplayShow}
        onPress={() => {
          console.log(data);

          if (!data.reception) {
            Alert.alert('資料不完全');
            return;
          }
          if (legoButton) {
            return;
          }
          setLegoButton(true);
          setTimeout(() => {
            setLegoButton(false);
          }, 2000);
          nextPageNavigation(info.brand, data);
        }}
      />
    );
  };

  const nextPageNavigation = (name: string, data: any) => {
    if (name === 'lego') {
      navigation.push('LegoScreen', {keyProps: data});
    }
  };

  const showReorganize = (update: boolean) => {
    if (update) {
      setShowReorganizeText('已更新為最新資訊！');
    } else {
      setShowReorganizeText('目前已是最新資訊！');
    }

    setShowReorganizeDisplay(true);
    setTimeout(() => {
      setShowReorganizeDisplay(false);
    }, 5000);
  };

  const showNumberGroup = (group: string, bet: number, player: number) => {
    //(if show) update number
    if (group === 'lego') {
      if (typeof showLegoDatabase.bet === 'number') {
        showLegoDatabase.bet = bet;
        showLegoDatabase.player = player;
      }
    }
  };

  const showOrHideNumber = (boolean: boolean) => {
    if (boolean) {
      showLegoDatabase.bet = '*****';
      showLegoDatabase.player = '*****';
    } else {
      showLegoDatabase.bet = legoDatabase.bet;
      showLegoDatabase.player = legoDatabase.player;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.playerSet}>
          <Text style={styles.showPlayerText}>對接專區</Text>
        </View>
        <View style={{position: 'absolute', top: 10, left: 0}}>
          <Pressable
            onPress={() => navigation.pop()}
            style={styles.backButtonSet}>
            {common.backButton()}
          </Pressable>
        </View>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <Text style={styles.promptText}>更新時間:{nowDataTiem}</Text>
          {LogoutTimer()}
          <View
            style={{width: '100%', alignItems: 'flex-end', paddingRight: 30}}>
            <Pressable
              onPress={() => {
                setEyesStatus(!eyesStatus);
                showOrHideNumber(eyesStatus);
              }}
              style={{top: -25, width: 35}}>
              {eyesStatus ? (
                <Image
                  source={require(openEyes)}
                  style={{width: 40, height: 40, resizeMode: 'contain'}}
                />
              ) : (
                <Image
                  source={require(closeEyes)}
                  style={{width: 40, height: 40, resizeMode: 'contain'}}
                />
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.contentSet}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
            {createOptionButton(
              showLegoDatabase,
              legoDisplay,
              legoButton,
              legoDatabase,
            )}
          </ScrollView>
        </View>

        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Text style={{color: '#FFFFFF', margin: 1}}>顯示幣別:CNY</Text>
          <Text style={{color: '#FFFFFF', margin: 1}}>
            每日更新時間為08:00(UTC+8)
          </Text>
        </View>
        <View style={{position: 'absolute', bottom: 15, right: 15}}>
          <Pressable
            onPress={async () => {
              console.log('重新整理');
              await fetchLatest(legoDatabase);
              Alert.alert('重新整理完成');
            }}
            style={styles.restartButton}>
            <Text style={{fontSize: 12, color: '#FFFFFF'}}>重新</Text>
            <Text style={{fontSize: 12, color: '#FFFFFF'}}>整理</Text>
          </Pressable>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 10,
            alignSelf: 'center',
            backgroundColor: '#FFC764',
            padding: 15,
            borderRadius: 10,
            display: showReorganizeDisplay ? 'flex' : 'none',
          }}>
          <Text>{showReorganizeText}</Text>
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
  },
  playerSet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showPlayerText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '500',
  },
  contentSet: {
    flex: 9,
    top: -20,
  },
  restartButton: {
    backgroundColor: '#666DC1',
    borderRadius: 13,
    padding: 7,
  },
  promptText: {
    color: '#FFFFFF',
    fontWeight: '600',
    margin: 1,
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
});

export default DockingAreaScreen;
