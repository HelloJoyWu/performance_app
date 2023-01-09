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
import MenuOptionButton from '../components/menuOptionButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {AxiosContext} from '../context/axiosContext';
import {AuthContext} from '../context/authContext';
import {getUTCLatestDateRange} from '../core/util';
import * as common from '../components/common';
import {format} from 'date-fns';
import levelList from '../components/hierarchy.json';
import {LogoutTimer, ExtensionTime} from '../components/logoutTimer';

interface menuScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'MenuScreen'>;
}

const level: any = levelList;

const MenuScreen: React.FC<menuScreenProps> = ({navigation}) => {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  const [cq9Display, setCq9Display] = useState<boolean>(false);
  const [champlandDisplay, setChamplandDisplay] = useState<boolean>(false);
  const [motivationDisplay, setMotivationDisplay] = useState<boolean>(false);
  const [gensportsDisplay, setGensportsDisplay] = useState<boolean>(false);

  const [eyesStatus, setEyesStatus] = useState<boolean>(false);
  const closeEyes = '../../res/eyesClose.png';
  const openEyes = '../../res/eyesOpen.png';

  const {utcNowDateStr, utcPreDateStr} = getUTCLatestDateRange(1);
  const [cq9Database, setCq9Database] = useState<any>({
    bet: 0,
    player: 0,
    brand: 'cq9',
    date: utcPreDateStr,
    reception: false,
  });

  const [champlandDatabase, setChamplandDatabase] = useState<any>({
    bet: 0,
    player: 0,
    brand: 'champland',
    date: utcPreDateStr,
    reception: false,
  });
  const [motivationDatabase, setMotivationDatabase] = useState<any>({
    bet: 0,
    player: 0,
    brand: 'champland',
    date: utcPreDateStr,
    reception: false,
  });
  const [gensportsDatabase, setGensportsDatabase] = useState<any>({
    bet: 0,
    player: 0,
    brand: 'champland',
    date: utcPreDateStr,
    reception: false,
  });

  const [showCq9Database] = useState<any>({
    date: utcPreDateStr,
    bet: '*****',
    player: '*****',
    brand: 'cq9',
  });
  const [showChamplandDatabase] = useState<any>({
    date: utcPreDateStr,
    bet: '*****',
    player: '*****',
    brand: 'champland',
  });
  const [showMotivationDatabase] = useState<any>({
    date: utcPreDateStr,
    bet: '*****',
    player: '*****',
    brand: 'motivation',
  });
  const [showGensportsDatabase] = useState<any>({
    date: utcPreDateStr,
    bet: '*****',
    player: '*****',
    brand: 'gensports',
  });

  // ture is forbidden
  const [cq9Button, setCq9Button] = useState<boolean>(true);
  const [champlandButton, setChamplandButton] = useState<boolean>(true);
  const [motivationButton, setMotivationButton] = useState<boolean>(true);
  const [gensportsButton, setGensportsButton] = useState<boolean>(true);

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

  const fetchLatest = useCallback(async (cq9Data: any, champlandData: any) => {
    try {
      const [latestCq9NumResp, latestChamplandNumResp] = await Promise.all([
        axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/sales/performance/date',
          {
            params: {from_date: utcPreDateStr, to_date: utcNowDateStr},
          },
        ),
        axiosContext.authChamplandAxios.get(
          '/api/v1/inquiry/sales/performance/date',
          {
            params: {from_date: utcPreDateStr, to_date: utcNowDateStr},
          },
        ),
      ]);
      console.log('Loading latest performane success');
      setNowDataTime(getNowTime);
      var updateDate: boolean = false;
      if (latestCq9NumResp.data[0]) {
        console.log(latestCq9NumResp.data[0]);
        latestCq9NumResp.data[0].reception = true;
        setCq9Database(latestCq9NumResp.data[0]);
        setCq9Button(false);
        showNumberGroup(
          latestCq9NumResp.data[0].brand,
          latestCq9NumResp.data[0].bet,
          latestCq9NumResp.data[0].player,
        );
        if (!updateDate) {
          if (
            cq9Data.bet !== latestCq9NumResp.data[0].bet &&
            cq9Data.player !== latestCq9NumResp.data[0].player
          ) {
            updateDate = true;
          }
        }
      }
      if (latestChamplandNumResp.data[0]) {
        latestChamplandNumResp.data[0].reception = true;
        setChamplandDatabase(latestChamplandNumResp.data[0]);
        setChamplandButton(false);
        showNumberGroup(
          latestChamplandNumResp.data[0].brand,
          latestChamplandNumResp.data[0].bet,
          latestChamplandNumResp.data[0].player,
        );
        if (!updateDate) {
          if (
            champlandData.bet !== latestChamplandNumResp.data[0].bet &&
            champlandData.player !== latestChamplandNumResp.data[0].player
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
  }, []);

  const fetchMotivationLatest = useCallback(async () => {
    try {
      const [resp1, resp2, resp3] = await Promise.all([
        await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/sales/specify/project/latest',
          {
            params: {
              by_brand: 'cq9',
              by_project: 'Motivation',
            },
          },
        ),
        await axiosContext.authKimbabaAxios.get(
          '/api/v1/inquiry/sales/specify/project/latest',
          {
            params: {
              by_brand: 'kimbaba',
              by_project: 'Motivation',
            },
          },
        ),
        await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/sales/specify/project/latest',
          {
            params: {
              by_brand: 'cl',
              by_project: 'Motivation',
            },
          },
        ),
      ]);
      if (
        typeof resp1.data !== 'object' &&
        typeof resp2.data !== 'object' &&
        typeof resp3.data !== 'object'
      ) {
        console.error('Fetch currency nothing');
      }
      console.log('Loading latest currency performane success');

      if (resp1.data[0]) {
        const tot_bet =
          resp1.data[0].bet + resp2.data[0].bet + resp3.data[0].bet;
        const tot_player =
          resp1.data[0].player + resp2.data[0].player + resp3.data[0].player;
        setMotivationDatabase({
          bet: tot_bet,
          player: tot_player,
          brand: 'Motivation',
          date: resp1.data[0].date,
          reception: true,
        });
        setMotivationButton(false);
        showNumberGroup('Motivation', tot_bet, tot_player);
        // if (!updateDate) {
        //   if (
        //     cq9Data.bet !== latestCq9NumResp.data[0].bet &&
        //     cq9Data.player !== latestCq9NumResp.data[0].player
        //   ) {
        //     updateDate = true;
        //   }
        // }
      }
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, []);

  const fetchGenSportsLatest = useCallback(async () => {
    try {
      const [resp1, resp2, resp3] = await Promise.all([
        await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/sales/specify/project/latest',
          {
            params: {
              by_brand: 'cq9',
              by_project: 'GenSports',
            },
          },
        ),
        await axiosContext.authChamplandAxios.get(
          '/api/v1/inquiry/sales/specify/project/latest',
          {
            params: {
              by_brand: 'champland',
              by_project: 'GenSports',
            },
          },
        ),
        await axiosContext.authKimbabaAxios.get(
          '/api/v1/inquiry/sales/specify/project/latest',
          {
            params: {
              by_brand: 'kimbaba',
              by_project: 'GenSports',
            },
          },
        ),
      ]);
      if (typeof resp1.data !== 'object' && typeof resp2.data !== 'object') {
        console.error('Fetch currency nothing');
      }
      console.log('Loading latest currency performane success');
      if (resp1.data[0]) {
        const tot_bet =
          resp1.data[0].bet + resp2.data[0].bet + resp3.data[0].bet;
        const tot_player =
          resp1.data[0].player + resp2.data[0].player + resp3.data[0].player;
        setGensportsDatabase({
          bet: tot_bet,
          player: tot_player,
          brand: 'GenSports',
          date: resp1.data[0].date,
          reception: true,
        });
        setGensportsButton(false);
        showNumberGroup('GenSports', tot_bet, tot_player);
        // if (!updateDate) {
        //   if (
        //     cq9Data.bet !== latestCq9NumResp.data[0].bet &&
        //     cq9Data.player !== latestCq9NumResp.data[0].player
        //   ) {
        //     updateDate = true;
        //   }
        // }
      }
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, []);

  const getUserDisplay = useCallback(() => {
    const levelStringList = level[authContext.authInfo.groups[0]];
    setCq9Display(setDisPley('cq9', levelStringList));
    setChamplandDisplay(setDisPley('champland', levelStringList));
    setMotivationDisplay(setDisPley('motivation', levelStringList));
    setGensportsDisplay(setDisPley('gensports', levelStringList));
  }, []);

  useEffect(() => {
    console.log('Loading latest performane');
    getUserDisplay();
    fetchLatest(cq9Database, champlandDatabase);
    fetchMotivationLatest();
    fetchGenSportsLatest();
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
          console.log(info.brand);
          console.log(data);
          console.log(data.reception);

          if (!data.reception) {
            Alert.alert('資料不完全');
            return;
          }

          if (info.brand === 'cq9') {
            if (cq9Button) {
              return;
            }
          } else if (info.brand === 'champland') {
            if (champlandButton) {
              return;
            }
          } else if (info.brand === 'motivation') {
            if (motivationButton) {
              return;
            }
          } else if (info.brand === 'gensports') {
            if (gensportsButton) {
              return;
            }
          }
          const cq9Store = cq9Button;
          const champlandStore = champlandButton;
          const motivationStore = motivationButton;
          const gensportsStore = gensportsButton;

          setCq9Button(true);
          setChamplandButton(true);
          setMotivationButton(true);
          setGensportsButton(true);
          setTimeout(() => {
            setCq9Button(cq9Store);
            setChamplandButton(champlandStore);
            setMotivationButton(motivationStore);
            setGensportsButton(gensportsStore);
            // setCq9Button(false);
            // setChamplandButton(false);
            // setMotivationButton(false);
            // setGensportsButton(false);
          }, 2000);
          nextPageNavigation(info.brand, data);
        }}
      />
    );
  };

  const nextPageNavigation = (name: string, data: any) => {
    if (name === 'cq9') {
      navigation.push('Cq9Screen', {keyProps: data});
    } else if (name === 'champland') {
      navigation.push('ChamplandScreen', {keyProps: data});
    } else if (name === 'motivation') {
      navigation.push('MotivationScreen', {keyProps: data});
    } else if (name === 'gensports') {
      navigation.push('GensportsScreen', {keyProps: data});
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
    if (group === 'cq9') {
      if (typeof showCq9Database.bet === 'number') {
        showCq9Database.bet = bet;
        showCq9Database.player = player;
      }
    } else if (group === 'champland') {
      if (typeof showChamplandDatabase.bet === 'number') {
        showChamplandDatabase.bet = bet;
        showChamplandDatabase.player = player;
      }
    } else if (group === 'motivation') {
      if (typeof showMotivationDatabase.bet === 'number') {
        showMotivationDatabase.bet = bet;
        showMotivationDatabase.player = player;
      }
    } else if (group === 'gensports') {
      if (typeof showGensportsDatabase.bet === 'number') {
        showGensportsDatabase.bet = bet;
        showGensportsDatabase.player = player;
      }
    }
  };

  const showOrHideNumber = (boolean: boolean) => {
    if (boolean) {
      showCq9Database.bet = '*****';
      showCq9Database.player = '*****';
      showChamplandDatabase.bet = '*****';
      showChamplandDatabase.player = '*****';
      showMotivationDatabase.bet = '*****';
      showMotivationDatabase.player = '*****';
      showGensportsDatabase.bet = '*****';
      showGensportsDatabase.player = '*****';
    } else {
      showCq9Database.bet = cq9Database.bet;
      showCq9Database.player = cq9Database.player;
      showChamplandDatabase.bet = champlandDatabase.bet;
      showChamplandDatabase.player = champlandDatabase.player;
      showMotivationDatabase.bet = motivationDatabase.bet;
      showMotivationDatabase.player = motivationDatabase.player;
      showGensportsDatabase.bet = gensportsDatabase.bet;
      showGensportsDatabase.player = gensportsDatabase.player;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.playerSet}>
          <Text style={styles.showPlayerText}>今日業績</Text>
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
              showCq9Database,
              cq9Display,
              cq9Button,
              cq9Database,
            )}
            {createOptionButton(
              showChamplandDatabase,
              champlandDisplay,
              champlandButton,
              champlandDatabase,
            )}
            {createOptionButton(
              showMotivationDatabase,
              motivationDisplay,
              motivationButton,
              motivationDatabase,
            )}
            {createOptionButton(
              showGensportsDatabase,
              gensportsDisplay,
              gensportsButton,
              gensportsDatabase,
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
              await fetchLatest(cq9Database, champlandDatabase);
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

export default MenuScreen;
