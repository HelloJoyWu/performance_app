import React, {useState, useContext, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import BackButton from '../components/backButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import * as common from '../components/common';
import {AxiosContext} from '../context/axiosContext';
import {getUTCLatestDateRange} from '../core/util';
import {LogoutTimer, ExtensionTime} from '../components/logoutTimer';

interface champlandScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ChamplandScreen'>;
  route: RouteProp<RootStackParamList, 'ChamplandScreen'>;
}

const ChamplandScreen: React.FC<champlandScreenProps> = ({
  route,
  navigation,
}) => {
  const axiosContext = useContext(AxiosContext);

  const keyProps: any = route.params.keyProps || ' ';

  const [chartsDataBase, setChartsDataBase] = useState<any>([]);
  const [chartsBasketballData, setChartsBasketballData] = useState<any[]>([]);
  const [chartsBaseballData, setChartsBaseballData] = useState<any[]>([]);
  const [chartsEsportData, setChartsEsportData] = useState<any[]>([]);
  const [chartsSoccerData, setChartsSoccerData] = useState<any[]>([]);
  const [chartsElectronicData, setChartsElectronicData] = useState<any[]>([]);
  const [chartsFantasyData, setChartsFantasyData] = useState<any[]>([]);
  const [chartsSuperSportsData, setChartsSuperSportsData] = useState<any[]>([]);

  const [tableDataBase, setTableDataBase] = useState<any[]>([]);
  const [tableDataTopBase, setTableDataTopBase] = useState<any[]>([]);
  const [showAllButton, setShowAllButton] = useState<boolean>(false);
  const [showBasketballButton, setShowBasketballButton] =
    useState<boolean>(false);
  const [showBaseballButton, setShowBaseballButton] = useState<boolean>(false);
  const [showEsportButton, setShowEsportButton] = useState<boolean>(false);
  const [showSoccerButton, setShowSoccerButton] = useState<boolean>(false);
  const [showElectronicButton, setShowElectronicButton] =
    useState<boolean>(false);
  const [showFantasyButton, setShowFantasyButton] = useState<boolean>(false);
  const [showSuperSportsButton, setShowSuperSportsButton] =
    useState<boolean>(false);

  const showBarButtonFN = [
    setShowAllButton,
    setShowBasketballButton,
    setShowBaseballButton,
    setShowEsportButton,
    setShowSoccerButton,
    setShowElectronicButton,
    setShowFantasyButton,
    setShowSuperSportsButton,
  ];
  const showBarButtonArray = [
    showAllButton,
    showBasketballButton,
    showBaseballButton,
    showEsportButton,
    showSoccerButton,
    showElectronicButton,
    showFantasyButton,
    showSuperSportsButton,
  ];

  const colorArray = ['#BFF2FF', '#FFEFBF', '#F1C6C1', '#7D86FF'];
  // const

  const fetchLatest = useCallback(async () => {
    try {
      const {utcNowDateStr, utcPreDateStr} = getUTCLatestDateRange(30);
      const [respChart, respTable, respTop] = await Promise.all([
        await axiosContext.authChamplandAxios.get(
          '/api/v1/inquiry/sales/performance/date',
          {
            params: {
              from_date: utcPreDateStr,
              to_date: utcNowDateStr,
            },
          },
        ),
        await axiosContext.authChamplandAxios.get(
          `/api/v1/inquiry/sales/performance/gametype/latest/${keyProps.brand}`,
        ),
        await axiosContext.authChamplandAxios.get(
          '/api/v1/champ/latest/match/top',
        ),
      ]);
      console.log('Loading champ latest currency performane success');
      // console.log('Champland show', respChart.data);
      setChartsDataarrange(respChart.data);
      setTableDataBase(respTable.data);
      topThreeData(respTop.data);
      // console.log(respTable.data);
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, []);

  const featchTypeData = useCallback(async () => {
    try {
      const {utcNowDateStr, utcPreDateStr} = getUTCLatestDateRange(30);
      const [respChart] = await Promise.all([
        await axiosContext.authChamplandAxios.get(
          '/api/v1/inquiry/sales/performance/gametype/date',
          {
            params: {
              from_date: utcPreDateStr,
              to_date: utcNowDateStr,
            },
          },
        ),
      ]);
      console.log('Loading champ latest currency performane success');
      // console.log(respChart.data);

      gametypeClassify(respChart.data);
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, []);

  useEffect(() => {
    console.log('Loading champ latest currency performane');
    fetchLatest();
    featchTypeData();
  }, [fetchLatest]);

  const setChartsDataarrange = (data: []) => {
    const allDataBase = common.chartsDataarrange(data, 'Champland');
    setChartsDataBase(allDataBase);
  };

  const gametypeClassify = (data: any) => {
    //分類30天日期
    const basketball_data_array: string[] = [];
    const basketball_bet_array: number[] = [];
    const basketball_player_array: number[] = [];
    var basketball_bet_sum: number = 0;
    var basketball_player_sum: number = 0;

    const baseball_data_array: string[] = [];
    const baseball_bet_array: number[] = [];
    const baseball_player_array: number[] = [];
    var baseball_bet_sum: number = 0;
    var baseball_player_sum: number = 0;

    const esport_data_array: string[] = [];
    const esport_bet_array: number[] = [];
    const esport_player_array: number[] = [];
    var esport_bet_sum: number = 0;
    var esport_player_sum: number = 0;

    const soccer_data_array: string[] = [];
    const soccer_bet_array: number[] = [];
    const soccer_player_array: number[] = [];
    var soccer_bet_sum: number = 0;
    var soccer_player_sum: number = 0;

    const electronic_data_array: string[] = [];
    const electronic_bet_array: number[] = [];
    const electronic_player_array: number[] = [];
    var electronic_bet_sum: number = 0;
    var electronic_player_sum: number = 0;

    const fantasy_data_array: string[] = [];
    const fantasy_bet_array: number[] = [];
    const fantasy_player_array: number[] = [];
    var fantasy_bet_sum: number = 0;
    var fantasy_player_sum: number = 0;

    const superSports_data_array: string[] = [];
    const superSports_bet_array: number[] = [];
    const superSports_player_array: number[] = [];
    var superSports_bet_sum: number = 0;
    var superSports_player_sum: number = 0;

    for (var i = 0; i < data.length; i++) {
      const database = data[i];

      if (database.gametype === 'basketball') {
        basketball_data_array.unshift(common.dateFormat(database.date));
        basketball_bet_array.unshift(database.bet);
        basketball_player_array.unshift(database.player);
        basketball_bet_sum += database.bet;
        basketball_player_sum += database.player;
      } else if (database.gametype === 'baseball') {
        baseball_data_array.unshift(common.dateFormat(database.date));
        baseball_bet_array.unshift(database.bet);
        baseball_player_array.unshift(database.player);
        baseball_bet_sum += database.bet;
        baseball_player_sum += database.player;
      } else if (database.gametype === 'esport') {
        esport_data_array.unshift(common.dateFormat(database.date));
        esport_bet_array.unshift(database.bet);
        esport_player_array.unshift(database.player);
        esport_bet_sum += database.bet;
        esport_player_sum += database.player;
      } else if (database.gametype === 'soccer') {
        soccer_data_array.unshift(common.dateFormat(database.date));
        soccer_bet_array.unshift(database.bet);
        soccer_player_array.unshift(database.player);
        soccer_bet_sum += database.bet;
        soccer_player_sum += database.player;
      } else if (database.gametype === '夢幻體育') {
        fantasy_data_array.unshift(common.dateFormat(database.date));
        fantasy_bet_array.unshift(database.bet);
        fantasy_player_array.unshift(database.player);
        fantasy_bet_sum += database.bet;
        fantasy_player_sum += database.player;
      } else if (database.gametype === '電子遊戲') {
        electronic_data_array.unshift(common.dateFormat(database.date));
        electronic_bet_array.unshift(database.bet);
        electronic_player_array.unshift(database.player);
        electronic_bet_sum += database.bet;
        electronic_player_sum += database.player;
      } else if (database.gametype === 'Super體育') {
        superSports_data_array.unshift(common.dateFormat(database.date));
        superSports_bet_array.unshift(database.bet);
        superSports_player_array.unshift(database.player);
        superSports_bet_sum += database.bet;
        superSports_player_sum += database.player;
      }
    }
    const basketball_bet_age: number =
      basketball_bet_sum / basketball_data_array.length;
    const basketball_player_age: number =
      basketball_player_sum / basketball_data_array.length;

    const baseball_bet_age: number =
      baseball_bet_sum / baseball_data_array.length;
    const baseball_player_age: number =
      baseball_player_sum / baseball_data_array.length;

    const esport_bet_age: number = esport_bet_sum / esport_data_array.length;
    const esport_player_age: number =
      esport_player_sum / esport_data_array.length;

    const soccer_bet_age: number = soccer_bet_sum / soccer_data_array.length;
    const soccer_player_age: number =
      soccer_player_sum / soccer_data_array.length;

    const fantasy_bet_age: number = fantasy_bet_sum / fantasy_data_array.length;
    const fantasy_player_age: number =
      fantasy_player_sum / fantasy_data_array.length;

    const electronic_bet_age: number =
      electronic_bet_sum / electronic_data_array.length;
    const electronic_player_age: number =
      electronic_player_sum / electronic_data_array.length;

    const superSports_bet_age: number =
      superSports_bet_sum / electronic_data_array.length;
    const superSports_player_age: number =
      superSports_player_sum / electronic_data_array.length;

    const new_basketball_date_array = common.lastThirtyDays(
      basketball_data_array,
    );
    const new_baseball_date_array = common.lastThirtyDays(baseball_data_array);
    const new_esport_date_array = common.lastThirtyDays(esport_data_array);
    const new_soccer_date_array = common.lastThirtyDays(soccer_data_array);
    const new_fantasy_date_array = common.lastThirtyDays(fantasy_data_array);
    const new_electronic_date_array = common.lastThirtyDays(
      electronic_data_array,
    );
    const new_superSports_date_array = common.lastThirtyDays(
      superSports_data_array,
    );

    for (var a = 0; a < 30; a++) {
      if (basketball_data_array[a] !== new_basketball_date_array[a]) {
        basketball_data_array.splice(a, 0, new_basketball_date_array[a]);
        basketball_bet_array.splice(a, 0, 0);
        basketball_player_array.splice(a, 0, 0);
      }
      if (baseball_data_array[a] !== new_baseball_date_array[a]) {
        baseball_data_array.splice(a, 0, new_baseball_date_array[a]);
        baseball_bet_array.splice(a, 0, 0);
        baseball_player_array.splice(a, 0, 0);
      }
      if (esport_data_array[a] !== new_esport_date_array[a]) {
        esport_data_array.splice(a, 0, new_esport_date_array[a]);
        esport_bet_array.splice(a, 0, 0);
        esport_player_array.splice(a, 0, 0);
      }
      if (soccer_data_array[a] !== new_soccer_date_array[a]) {
        soccer_data_array.splice(a, 0, new_soccer_date_array[a]);
        soccer_bet_array.splice(a, 0, 0);
        soccer_player_array.splice(a, 0, 0);
      }
      if (fantasy_data_array[a] !== new_fantasy_date_array[a]) {
        fantasy_data_array.splice(a, 0, new_fantasy_date_array[a]);
        fantasy_bet_array.splice(a, 0, 0);
        fantasy_player_array.splice(a, 0, 0);
      }
      if (electronic_data_array[a] !== new_electronic_date_array[a]) {
        electronic_data_array.splice(a, 0, new_electronic_date_array[a]);
        electronic_bet_array.splice(a, 0, 0);
        electronic_player_array.splice(a, 0, 0);
      }
      if (superSports_data_array[a] !== new_superSports_date_array[a]) {
        superSports_data_array.splice(a, 0, new_superSports_date_array[a]);
        superSports_bet_array.splice(a, 0, 0);
        superSports_player_array.splice(a, 0, 0);
      }
    }

    const basketball_obj = [
      {
        name: 'bet',
        average: basketball_bet_age,
        data: basketball_bet_array,
        date: basketball_data_array,
      },
      {
        name: 'player',
        average: basketball_player_age,
        data: basketball_player_array,
        date: basketball_data_array,
      },
    ];
    const baseball_obj = [
      {
        name: 'bet',
        average: baseball_bet_age,
        data: baseball_bet_array,
        date: baseball_data_array,
      },
      {
        name: 'player',
        average: baseball_player_age,
        data: baseball_player_array,
        date: baseball_data_array,
      },
    ];
    const esport_obj = [
      {
        name: 'bet',
        average: esport_bet_age,
        data: esport_bet_array,
        date: esport_data_array,
      },
      {
        name: 'player',
        average: esport_player_age,
        data: esport_player_array,
        date: esport_data_array,
      },
    ];
    const soccer_obj = [
      {
        name: 'bet',
        average: soccer_bet_age,
        data: soccer_bet_array,
        date: soccer_data_array,
      },
      {
        name: 'player',
        average: soccer_player_age,
        data: soccer_player_array,
        date: soccer_data_array,
      },
    ];

    const fantasy_obj = [
      {
        name: 'bet',
        average: fantasy_bet_age,
        data: fantasy_bet_array,
        date: fantasy_data_array,
      },
      {
        name: 'player',
        average: fantasy_player_age,
        data: fantasy_player_array,
        date: fantasy_data_array,
      },
    ];
    const electronic_obj = [
      {
        name: 'bet',
        average: electronic_bet_age,
        data: electronic_bet_array,
        date: electronic_data_array,
      },
      {
        name: 'player',
        average: electronic_player_age,
        data: electronic_player_array,
        date: electronic_data_array,
      },
    ];
    const superSports_obj = [
      {
        name: 'bet',
        average: superSports_bet_age,
        data: superSports_bet_array,
        date: superSports_data_array,
      },
      {
        name: 'player',
        average: superSports_player_age,
        data: superSports_player_array,
        date: superSports_data_array,
      },
    ];

    setChartsBasketballData(basketball_obj);
    setChartsBaseballData(baseball_obj);
    setChartsEsportData(esport_obj);
    setChartsSoccerData(soccer_obj);
    setChartsElectronicData(electronic_obj);
    setChartsFantasyData(fantasy_obj);
    setChartsSuperSportsData(superSports_obj);
  };

  const createTypeTable = (data: any) => {
    return data.map((obj: any, index: number) => {
      return (
        <View key={obj.gametype}>
          <View
            style={{
              backgroundColor: '#515369',
              borderRadius: 20,
              padding: 5,
              alignItems: 'center',
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 16}}>
              {common.convertSportsTypeName(obj.gametype)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <View style={styles.tableText}>
              <Text style={{color: '#D4D4D4', fontSize: 13}}>總碼量</Text>
              <Text style={{color: '#BFF2FF', fontSize: 18, fontWeight: '500'}}>
                {common.thousandths(obj.bet)}
              </Text>
            </View>
            <View
              style={[
                styles.tableText,
                {borderLeftColor: '#D5D5D57E', borderLeftWidth: 1},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#D4D4D4', fontSize: 13}}>總人數</Text>
                <Text style={{color: '#D4D4D4', fontSize: 11}}>(不重複)</Text>
              </View>
              <Text style={{color: '#FFEFBF', fontSize: 18, fontWeight: '500'}}>
                {common.thousandths(obj.player)}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const topThreeData = (data: any) => {
    const soccerData: any = [];
    const baseballData: any = [];
    const basketballData: any = [];

    for (var i = 0; i < data.length; i++) {
      const dateType = data[i].genre;
      switch (dateType) {
        case 'soccer': {
          soccerData.push(data[i]);
          break;
        }
        case 'baseball': {
          baseballData.push(data[i]);
          break;
        }
        case 'basketball': {
          basketballData.push(data[i]);
          break;
        }
      }
    }
    const soccerArray = tableDataSore(soccerData);
    const baseballArray = tableDataSore(baseballData);
    const basketballArray = tableDataSore(basketballData);

    const database = [
      {name: 'soccer', data: soccerArray},
      {name: 'baseball', data: baseballArray},
      {name: 'basketball', data: basketballArray},
    ];
    setTableDataTopBase(database);
  };

  const tableDataSore = (data: []) => {
    data = data.sort(function (a: any, b: any) {
      return a.bet < b.bet ? 1 : -1;
    });
    //only top 3
    const threeData = data.splice(0, 3);

    return threeData;
  };

  const createDayTop = (database: any) => {
    if (database.length <= 0) {
      return null;
    }
    return database.map((obj: any, index: number) => {
      return (
        <View key={obj.name + index}>
          <View
            style={{
              alignItems: 'center',
              borderBottomColor: '#FFFFFF6B',
              borderBottomWidth: 3,
              marginVertical: 5,
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 16}}>
              {common.convertSportsTypeName(obj.name)}
            </Text>
            <View style={{marginBottom: 10}}>
              {createDayTopThree(obj.data)}
            </View>
          </View>
        </View>
      );
    });
  };
  const createDayTopThree = (database: any) => {
    const colorTopThree = ['#414AC9', '#636AC9', '#7B80B2'];

    return database.map((obj: any, index: number) => {
      const nameArray = obj.match_name.split(' vs ');

      return (
        <View key={obj.genre + index}>
          <View
            style={{
              alignItems: 'center',
              marginVertical: 3,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colorTopThree[index],
                  alignItems: 'center',
                  // padding: 5,
                  borderRadius: 5,
                  width: '100%',
                }}>
                <View
                  style={{
                    backgroundColor: '#1A1C2E',
                    flexDirection: 'row',
                    borderColor: '#7D86FF',
                    borderWidth: 1,
                    borderBottomWidth: 0,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    width: '100%',
                    padding: 3,
                  }}>
                  <Text
                    style={{
                      color: '#ACB2FF',
                      fontSize: 18,
                      fontWeight: '600',
                      width: '5%',
                      alignSelf: 'center',
                    }}
                    numberOfLines={1}>
                    {index + 1}.
                  </Text>
                  <Text
                    style={{
                      color: '#ACB2FF',
                      fontSize: 18,
                      fontWeight: '600',
                      textAlign: 'center',
                      width: '95%',
                      textAlignVertical: 'center',
                    }}>
                    {obj.league_name}
                  </Text>
                </View>
                <Text
                  style={[styles.font1, {color: '#FFFFFF'}]}
                  numberOfLines={2}>
                  {nameArray[0]}
                </Text>
                <Text style={[styles.font1, {color: '#FFC10B'}]}>vs</Text>
                <Text
                  style={[styles.font1, {color: '#FFFFFF'}]}
                  numberOfLines={2}>
                  {nameArray[1]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    });
  };

  const nullData = () => {
    return (
      <View style={{padding: 10, alignItems: 'center', marginBottom: 10}}>
        <Text style={{color: '#FFFFFF'}}>暫無資料</Text>
      </View>
    );
  };

  const createCharts = (database: any) => {
    if (database.length === 0) {
      return null;
    }

    return database.map((obj: any, index: number) => {
      const showColor: string = colorArray[index];
      const typeName: string = common.convertName(obj.name);

      return (
        <View key={obj.name + index} style={styles.chartBox}>
          <View>
            <Text style={[styles.chartTitleText, {color: showColor}]}>
              {common.convertName(obj.name)}
            </Text>
          </View>
          <View>
            {common.chartsProps(
              obj.date,
              obj.data,
              obj.average,
              showColor,
              typeName,
              false,
            )}
          </View>
        </View>
      );
    });
  };

  const gameTypeImage = (name: string) => {
    if (name === 'all') {
      return (
        <Image
          source={require('../../res/gameType/all.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'baseball') {
      return (
        <Image
          source={require('../../res/gameType/baseball.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'basketball') {
      return (
        <Image
          source={require('../../res/gameType/basketball.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'esport') {
      return (
        <Image
          source={require('../../res/gameType/esport.png')}
          style={{width: 43, height: 29}}
        />
      );
    } else if (name === 'soccer') {
      return (
        <Image
          source={require('../../res/gameType/soccer.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'electronic') {
      return (
        <Image
          source={require('../../res/gameType/electronic.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'fantasy') {
      return (
        <Image
          source={require('../../res/gameType/fantasy.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'superSports') {
      return (
        <Image
          source={require('../../res/gameType/fantasy.png')}
          style={styles.imageSize}
        />
      );
    }
  };

  const createBarButton = (data: any, name: string, index: number) => {
    var showChart;
    for (var a = 0; a < data.length; a++) {
      const uniqueArr = [...new Set(data[a].data)];
      if (!showChart) {
        if (uniqueArr.length === 1 && uniqueArr[0] === 0) {
          showChart = false;
        } else {
          showChart = true;
        }
      }
    }

    return (
      <View style={[styles.viewBox]}>
        <Pressable
          style={{
            backgroundColor: '#42445A',
            borderRadius: 15,
            paddingVertical: 25,
          }}
          onPress={() => {
            showBarButtonFN[index](!showBarButtonArray[index]);
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: '90%',
                paddingHorizontal: 25,
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              {gameTypeImage(name)}
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 24,
                  alignSelf: 'center',
                  marginLeft: 10,
                }}>
                {common.convertSportsTypeName(name)}
              </Text>
            </View>
            <View style={{width: '10%', alignSelf: 'center'}}>
              <Image
                source={require('../../res/arrow.png')}
                style={{
                  transform: [
                    {rotate: showBarButtonArray[index] ? '0deg' : '-90deg'},
                  ],
                }}
              />
            </View>
          </View>
        </Pressable>
        <View
          style={{
            paddingHorizontal: 15,
            display: showBarButtonArray[index] ? 'flex' : 'none',
          }}>
          <View
            style={{
              width: '100%',
              height: 15,
              alignItems: 'flex-end',
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 14}}>幣別：CNY</Text>
          </View>
          {showChart ? createCharts(data) : nullData()}
          {/* {createCharts(data)} */}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          <View style={{width: '100%'}}>
            <BackButton
              title={'champland'}
              onPress={() => navigation.pop()}
              bgcolor={'#42445A'}
            />
          </View>
        </View>
        {LogoutTimer()}
        <View style={{flex: 8, width: '100%'}}>
          <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            <View style={styles.todayDataBox}>
              <View style={styles.todayDataBoxDate}>
                <Text
                  style={{color: '#FFFFFF', fontSize: 28, fontWeight: '500'}}>
                  {common.dateFormat(keyProps.date)}
                </Text>
                <Text
                  style={{color: '#FFFFFF', fontWeight: '400', fontSize: 16}}>
                  當日業績
                </Text>
              </View>
              <View style={styles.todayDataBoxDatabase}>
                <View style={styles.contentTextSet}>
                  <Text style={{color: '#FFFFFF', fontSize: 15}}>總碼量</Text>
                  <Text
                    style={{color: '#BFF2FF', fontSize: 20, fontWeight: '500'}}>
                    {common.thousandths(keyProps.bet)}
                  </Text>
                </View>
                <View style={styles.contentTextSet}>
                  <Text style={{color: '#FFFFFF', fontSize: 15}}>總人數</Text>
                  <Text
                    style={{color: '#FFEFBF', fontSize: 20, fontWeight: '500'}}>
                    {common.thousandths(keyProps.player)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.viewBox, {padding: 10, marginTop: 7}]}>
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text
                  style={{color: '#FFFFFF', fontSize: 20, fontWeight: '700'}}>
                  當日
                </Text>
              </View>
              {createTypeTable(tableDataBase)}
              <View>
                <View
                  style={{
                    backgroundColor: '#515369',
                    borderRadius: 20,
                    padding: 5,
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Text style={{color: '#FFFFFF', fontSize: 16}}>
                    當日TOP3熱門賽事
                  </Text>
                </View>
                {createDayTop(tableDataTopBase)}
              </View>
            </View>
            <View
              style={{
                width: '90%',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#242740',
                  width: '100%',
                  height: 30,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#FFFFFF', fontSize: 18}}>
                  近30天走勢圖
                </Text>
              </View>
              <View style={styles.triangleStyle} />
            </View>
            {createBarButton(chartsDataBase, 'all', 0)}
            {createBarButton(chartsBasketballData, 'basketball', 1)}
            {createBarButton(chartsBaseballData, 'baseball', 2)}
            {createBarButton(chartsEsportData, 'esport', 3)}
            {createBarButton(chartsSoccerData, 'soccer', 4)}
            {createBarButton(chartsSuperSportsData, 'superSports', 5)}
            {createBarButton(chartsFantasyData, 'fantasy', 6)}
            {createBarButton(chartsElectronicData, 'electronic', 7)}
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
    backgroundColor: '#42445A',
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTextSet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
  titleBox: {
    flex: 1,
    flexDirection: 'row',
  },
  todayDataBox: {
    flexDirection: 'row',
    backgroundColor: '#242740',
    borderRadius: 15,
    paddingHorizontal: 10,
    width: '90%',
  },
  todayDataBoxDate: {
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayDataBoxDatabase: {
    width: '70%',
    marginVertical: 10,
    borderLeftColor: '#FFFFFF',
    borderLeftWidth: 1,
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chartBox: {
    borderColor: '#FFFFFF48',
    borderBottomWidth: 4,
    // marginVertical: 5,
    paddingHorizontal: 10,
  },
  chartTitleText: {
    fontSize: 17,
    fontWeight: '600',
  },
  tableText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  viewBox: {
    backgroundColor: '#1A1C2E',
    borderRadius: 15,
    width: '90%',
    marginVertical: 3,
  },
  triangleStyle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: '#242740',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
  },
  imageSize: {
    width: 41,
    height: 41,
    resizeMode: 'contain',
  },

  font1: {fontSize: 18, fontWeight: '600', textAlign: 'center', width: '100%'},
});
export default ChamplandScreen;
