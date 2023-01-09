import React, {useState, useCallback, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ImageBackground,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as common from '../../components/common';
import {Dropdown} from 'react-native-element-dropdown';
import {AxiosContext} from '../../context/axiosContext';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';

interface groupComparisonScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'GroupComparisonScreen'>;
}

const GroupComparison: React.FC<groupComparisonScreenProps> = ({
  navigation,
}) => {
  const allCurrency = [
    {label: 'CNY', value: 'CNY'},
    {label: 'KRW', value: 'KRW'},
    {label: 'THB', value: 'THB'},
    {label: 'VND', value: 'VND'},
    {label: 'IDR', value: 'IDR'},
    {label: 'MYR', value: 'MYR'},
    {label: 'PHP', value: 'PHP'},
    {label: 'MMK', value: 'MMK'},
    {label: 'USD', value: 'USD'},
    {label: 'HKD', value: 'HKD'},
  ];
  const [displayContent, setDisplayContent] = useState<Boolean>(false);
  const axiosContext = useContext(AxiosContext);
  const [selectOne, setSelectOne] = useState<any>();
  const [selectTwo, setSelectTwo] = useState<any>();
  const [selectMonth, setSelectMonth] = useState<any>();

  const [currencyLatest1, setCurrencyLatest1] = useState<any>();
  const [currencyTopGameLatest1, setCurrencyTopGameLatest1] = useState<any>();
  const [currencyLatest2, setCurrencyLatest2] = useState<any>();
  const [currencyTopGameLatest2, setCurrencyTopGameLatest2] = useState<any>();

  const fetchLatest = useCallback(
    async (currency: any[]) => {
      try {
        const [resp1, resp2] = await Promise.all([
          await axiosContext.authCq9Axios.get(
            '/api/v1/inquiry/sales/performance/gametype/latest',
            // `/api/v1/inquiry/currency/premonth/gametype/bet`,
            {
              params: {
                by_currency: currency[0],
              },
            },
          ),
          await axiosContext.authCq9Axios.get(
            '/api/v1/inquiry/sales/performance/gametype/latest',
            {
              params: {
                by_currency: currency[1],
              },
            },
          ),
        ]);
        if (typeof resp1.data !== 'object') {
          console.error('Fetch currency nothing');
        }
        console.log('Loading latest currency performane success');
        currencyArrange(
          resp1.data,
          setCurrencyLatest1,
          setCurrencyTopGameLatest1,
        );
        currencyArrange(
          resp2.data,
          setCurrencyLatest2,
          setCurrencyTopGameLatest2,
        );
        // console.log(resp1.data);
        // console.log(resp2.data);
        setDisplayContent(true);
      } catch (error: any) {
        const alertMsg = error.response.config.baseURL
          ? `${error.response.data.message} under host ${error.response.config.baseURL}`
          : `${error}`;
        console.error('Fetch latest currency failed', alertMsg);
      }
    },
    [axiosContext.authCq9Axios],
  );

  const currencyArrange = (data: any[], setLatest: any, setTopGame: any) => {
    var currency = '';
    var area = '';
    var averageDailyBet = 0;
    const player_composition: any = {lower: 0, mid: 0, high: 0};
    const game_average_bet: any = {slot: 0, fish: 0, table: 0, arcade: 0};
    const game_average_time: any = {slot: 0, fish: 0, table: 0, arcade: 0};
    const retentionRate: any = {
      day_1: 0,
      day_3: 0,
      day_7: 0,
      day_14: 0,
      day_30: 0,
    };
    const topGame = [];

    currency = data[0].currency;
    area = data[0].brand; //
    averageDailyBet = data[0].bet; // ÷30?
    player_composition.lower = data[0].bet; //
    player_composition.mid = data[0].bet_day_diff; //
    player_composition.high = data[0].bet_month_avg_diff; //
    game_average_bet.slot = data[0].player;
    game_average_bet.fish = data[1].player;
    game_average_bet.table = data[2].player;
    game_average_bet.arcade = data[3].player;

    game_average_time.slot = data[0].rounds;
    game_average_time.fish = data[1].rounds;
    game_average_time.table = data[2].rounds;
    game_average_time.arcade = data[3].rounds;
    retentionRate.day_1 = data[0].player;
    retentionRate.day_3 = data[0].player;
    retentionRate.day_7 = data[0].player;
    retentionRate.day_14 = data[0].player;
    retentionRate.day_30 = data[0].player;
    topGame.push(
      {name: 'test_1', type: 'slot'},
      {name: 'test_2', type: 'fish'},
      {name: 'test_3', type: 'table'},
      {name: 'test_4', type: 'arcade'},
      {name: 'test_5', type: 'slot'},
    );

    const dataBase = {
      currency: currency,
      area: area,
      averageDailyBet: averageDailyBet,
      player_composition: player_composition,
      game_average_bet: game_average_bet,
      game_average_time: game_average_time,
      retentionRate: retentionRate,
    };

    setLatest(dataBase);
    setTopGame(topGame);
  };

  const getDateArray = () => {
    //從上個月開始 計算12個月
    const monthArray: any[] = [];
    const year = new Date().getFullYear();
    const month = new Date().getMonth(); //last month
    for (var i = 0; i < 12; i++) {
      var monthStr = month - i;
      var yearStr = year;
      if (month - i < 1) {
        monthStr = month + 12 - i;
        yearStr = year - 1;
      }
      monthArray.push({
        label: yearStr + '-' + monthStr + '月',
        value: yearStr + '-' + monthStr,
      });
    }
    return monthArray;
  };

  const sendCheck = () => {
    if (!selectOne) {
      Alert.alert('第一個幣別尚未選擇');
      return;
    }
    if (!selectTwo) {
      Alert.alert('第個幣別尚未選擇');
      return;
    }
    if (!selectMonth) {
      Alert.alert('尚未選擇月份');
      return;
    }
    if (selectOne.value === selectTwo.value) {
      Alert.alert('幣別重複');
      return;
    }
    fetchLatest([selectOne.value, selectTwo.value]);
  };

  const currencyImage = (name: string) => {
    if (name === 'CNY') {
      return (
        <Image
          source={require('../../../res/currency/CNY.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'KRW') {
      return (
        <Image
          source={require('../../../res/currency/KRW.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'THB') {
      return (
        <Image
          source={require('../../../res/currency/THB.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'VND') {
      return (
        <Image
          source={require('../../../res/currency/VND.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'IDR') {
      return (
        <Image
          source={require('../../../res/currency/IDR.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'MYR') {
      return (
        <Image
          source={require('../../../res/currency/MYR.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'PHP') {
      return (
        <Image
          source={require('../../../res/currency/PHP.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'MMK') {
      return (
        <Image
          source={require('../../../res/currency/MMK.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'USD') {
      return (
        <Image
          source={require('../../../res/currency/USD.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'HKD') {
      return (
        <Image
          source={require('../../../res/currency/HKD.png')}
          style={styles.imageSize}
        />
      );
    }
  };

  const createWidthBar = (width: string, position: any, color: string) => {
    return (
      <View style={[styles.gameTopBox, {alignItems: position}]}>
        <View
          style={{
            width: width,
            backgroundColor: color,
            height: '100%',
          }}
        />
      </View>
    );
  };

  const renderItem = (item: any, selecded: any) => {
    return (
      <View style={styles.item}>
        <Text
          style={[styles.textItem, {color: selecded ? '#1A1C2E' : '#FFFFFF'}]}>
          {item.label}
        </Text>
      </View>
    );
  };

  const createMonthView = (data1: string, data2: string) => {
    return (
      <View style={styles.typeBigBox}>
        <View style={styles.outerFrameBox}>
          <Text style={styles.font1}>{selectMonth.label}</Text>
        </View>
        <View style={styles.segmentView}>
          <View style={{alignItems: 'center'}}>
            {currencyImage(data1)}
            <Text style={styles.font2}>{data1}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            {currencyImage(data2)}
            <Text style={styles.font2}>{data2}</Text>
          </View>
        </View>
      </View>
    );
  };

  const createAreaView = (data1: any[], data2: any[], color: string[]) => {
    return (
      <View style={styles.typeBigBox}>
        <View style={styles.outerFrameBox}>
          <Text style={styles.font1}>玩家集中地區</Text>
        </View>
        <View style={styles.segmentView}>
          <View style={[styles.areaTextBox, {backgroundColor: color[0]}]}>
            <Text style={styles.font3}>{data1}</Text>
          </View>
          <Image
            source={require('../../../res/grounpComparison/area.png')}
            style={styles.imageSize2}
          />
          <View style={[styles.areaTextBox, {backgroundColor: color[1]}]}>
            <Text style={styles.font3}>{data2}</Text>
          </View>
        </View>
      </View>
    );
  };

  const createDailyBetView = (data1: any, data2: any, color: string[]) => {
    const totBat = data1 + data2;
    const currencyOneBet = ((data1 / totBat) * 100).toFixed(2) + '%';
    const currencyTwoBet = ((data2 / totBat) * 100).toFixed(2) + '%';
    return (
      <View style={styles.typeBigBox}>
        <View style={styles.outerFrameBox}>
          <Text style={styles.font1}>日均碼</Text>
        </View>
        <View style={[styles.segmentView, {paddingTop: 5, paddingBottom: 0}]}>
          <Text style={{color: color[0]}}>{common.thousandths(data1)}</Text>
          <Image
            source={require('../../../res/grounpComparison/dailyBet.png')}
            style={styles.imageSize2}
          />
          <Text style={{color: color[1]}}>{common.thousandths(data2)}</Text>
        </View>
        <View style={styles.segmentView}>
          {createWidthBar(currencyOneBet, 'flex-end', color[0])}
          {createWidthBar(currencyTwoBet, 'flex-start', color[1])}
        </View>
      </View>
    );
  };

  const createDifPlayer = (
    color: string[],
    bet: number[],
    totBet: number[],
    title: string,
  ) => {
    const betProportion1 = ((bet[0] / totBet[0]) * 100).toFixed(2);
    const betProportion2 = ((bet[1] / totBet[1]) * 100).toFixed(2);
    return (
      <View>
        <View style={[styles.segmentView, {justifyContent: 'space-evenly'}]}>
          <Text style={{color: color[0]}}>{betProportion1}%</Text>
          <Text style={{color: '#ACB2FF'}}>{title}</Text>
          <Text style={{color: color[1]}}>{betProportion2}%</Text>
        </View>
        <View style={[styles.segmentView, {paddingVertical: 0}]}>
          {createWidthBar(betProportion1 + '%', 'flex-end', color[0])}
          {createWidthBar(betProportion2 + '%', 'flex-start', color[1])}
        </View>
      </View>
    );
  };

  const createPlayerView = (data1: any, data2: any, color: string[]) => {
    const high_tot_one = data1.high + data1.mid + data1.lower;
    const high_tot_two = data2.high + data2.mid + data2.lower;
    return (
      <View style={styles.typeBigBox}>
        <View style={styles.outerFrameBox}>
          <Text style={styles.font1}>玩家組成</Text>
        </View>
        <Image
          source={require('../../../res/grounpComparison/player.png')}
          style={styles.imageSize2}
        />
        {createDifPlayer(
          color,
          [data1.lower, data2.lower],
          [high_tot_one, high_tot_two],
          '低碼',
        )}
        {createDifPlayer(
          color,
          [data1.mid, data2.mid],
          [high_tot_one, high_tot_two],
          '中碼',
        )}
        {createDifPlayer(
          color,
          [data1.high, data2.high],
          [high_tot_one, high_tot_two],
          '高碼',
        )}
      </View>
    );
  };

  const createTextBorderBox = (ageBet: number, color: string) => {
    return (
      <View
        style={[
          styles.areaTextBox,
          {height: 40, borderColor: color, borderWidth: 1},
        ]}>
        <Text style={[styles.font4, {color: color}]}>{ageBet}</Text>
      </View>
    );
  };

  const createGameTypeView = (
    data1: any,
    data2: any,
    color: string[],
    name: string,
  ) => {
    return (
      <View style={styles.typeBigBox}>
        <View style={styles.outerFrameBox}>
          <Text style={styles.font1}>{name}</Text>
        </View>
        <View style={styles.segmentView}>
          {createTextBorderBox(data1.slot, color[0])}
          <Image
            source={require('../../../res/grounpComparison/icon_slot.png')}
            style={styles.imageSize3}
          />
          {createTextBorderBox(data2.slot, color[1])}
        </View>
        <View style={styles.segmentView}>
          {createTextBorderBox(data1.fish, color[0])}
          <Image
            source={require('../../../res/grounpComparison/icon_fish.png')}
            style={styles.imageSize3}
          />
          {createTextBorderBox(data2.fish, color[1])}
        </View>
        <View style={styles.segmentView}>
          {createTextBorderBox(data1.table, color[0])}
          <Image
            source={require('../../../res/grounpComparison/icon_table.png')}
            style={styles.imageSize3}
          />
          {createTextBorderBox(data2.table, color[1])}
        </View>
        <View style={styles.segmentView}>
          {createTextBorderBox(data1.arcade, color[0])}
          <Image
            source={require('../../../res/grounpComparison/icon_arcade.png')}
            style={styles.imageSize3}
          />
          {createTextBorderBox(data2.arcade, color[1])}
        </View>
      </View>
    );
  };

  const retentionRateDayImage = (name: string) => {
    if (name === 'day_1') {
      return (
        <Image
          source={require('../../../res/grounpComparison/day1.png')}
          style={styles.imageSize2}
        />
      );
    } else if (name === 'day_3') {
      return (
        <Image
          source={require('../../../res/grounpComparison/day3.png')}
          style={styles.imageSize2}
        />
      );
    } else if (name === 'day_7') {
      return (
        <Image
          source={require('../../../res/grounpComparison/day7.png')}
          style={styles.imageSize2}
        />
      );
    } else if (name === 'day_14') {
      return (
        <Image
          source={require('../../../res/grounpComparison/day14.png')}
          style={styles.imageSize2}
        />
      );
    } else if (name === 'day_30') {
      return (
        <Image
          source={require('../../../res/grounpComparison/day30.png')}
          style={styles.imageSize2}
        />
      );
    }
  };

  const createDayView = (data1: any, data2: any, color: string[]) => {
    const dayArray = ['day_1', 'day_3', 'day_7', 'day_14', 'day_30'];
    return dayArray.map((obj: string, index: number) => {
      return (
        <View
          key={obj + '_' + index}
          style={[
            styles.segmentView,
            {borderBottomColor: '#ACB2FF', borderBottomWidth: 1},
          ]}>
          <Text style={[styles.font5, {color: color[0]}]}>
            {data1[dayArray[index]]}%
          </Text>
          {retentionRateDayImage(obj)}
          <Text style={[styles.font5, {color: color[1]}]}>
            {data2[dayArray[index]]}%
          </Text>
        </View>
      );
    });
  };

  const createRetentionRateView = (data1: any, data2: any, color: string[]) => {
    return (
      <View style={styles.typeBigBox}>
        <View style={styles.outerFrameBox}>
          <Text style={styles.font1}>留存率</Text>
        </View>
        {createDayView(data1, data2, color)}
      </View>
    );
  };

  const gameIconImage = (name: string) => {
    if (name === 'slot') {
      return (
        <Image
          source={require('../../../res/grounpComparison/game_slot.png')}
          style={styles.imageSize2}
        />
      );
    } else if (name === 'fish') {
      return (
        <Image
          source={require('../../../res/grounpComparison/game_fish.png')}
          style={styles.imageSize2}
        />
      );
    } else if (name === 'table') {
      return (
        <Image
          source={require('../../../res/grounpComparison/game_table.png')}
          style={styles.imageSize2}
        />
      );
    } else if (name === 'arcade') {
      return (
        <Image
          source={require('../../../res/grounpComparison/game_arcade.png')}
          style={styles.imageSize2}
        />
      );
    }
  };

  const createGameBox = (data1: any, data2: any) => {
    return data1.map((obj: any, index: number) => {
      return (
        <View
          key={obj.type + '_' + index}
          style={[
            styles.segmentView,
            {borderBottomColor: '#ACB2FF', borderBottomWidth: 1},
          ]}>
          <View style={styles.gmaeTopText}>
            {gameIconImage(data1[index].type)}
            <Text style={styles.font6}>{data1[index].name}</Text>
          </View>
          <View style={styles.gameTopBorder} />
          <View style={styles.gmaeTopText}>
            {gameIconImage(data2[index].type)}
            <Text style={styles.font6}>{data2[index].name}</Text>
          </View>
        </View>
      );
    });
  };

  const createTopGameView = (data1: any, data2: any) => {
    return (
      <View style={styles.typeBigBox}>
        <View style={[styles.outerFrameBox, {marginBottom: 10, marginTop: 5}]}>
          <Text style={styles.font1}>熱門Top5遊戲</Text>
        </View>
        {createGameBox(data1, data2)}
      </View>
    );
  };

  const createGrounpComparison = (
    data1: any,
    data2: any,
    dataGameTop1: any,
    dataGameTop2: any,
  ) => {
    if (!data1) {
      return null;
    }
    if (!data2) {
      return null;
    }
    if (!dataGameTop1) {
      return null;
    }
    if (!dataGameTop2) {
      return null;
    }

    const colorArray: string[] = [
      common.currencyColor(data1.currency),
      common.currencyColor(data2.currency),
    ];
    return (
      <View style={{width: '100%', paddingHorizontal: 10}}>
        {createMonthView(data1.currency, data2.currency)}
        {createAreaView(data1.area, data2.area, colorArray)}
        {createDailyBetView(
          data1.averageDailyBet,
          data2.averageDailyBet,
          colorArray,
        )}
        {createPlayerView(
          data1.player_composition,
          data2.player_composition,
          colorArray,
        )}
        {createGameTypeView(
          data1.game_average_bet,
          data2.game_average_bet,
          colorArray,
          '遊戲平均押注',
        )}
        {createGameTypeView(
          data1.game_average_time,
          data2.game_average_time,
          colorArray,
          '遊戲遊玩時間',
        )}
        {createRetentionRateView(
          data1.retentionRate,
          data2.retentionRate,
          colorArray,
        )}
        {createTopGameView(dataGameTop1, dataGameTop2)}
      </View>
    );
  };

  const createDropdpwn = (
    data: any,
    showText: string,
    select: any,
    setSelect: any,
  ) => {
    return (
      <View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.containerStyle}
          inputSearchStyle={styles.containerStyle}
          activeColor={'#ACB2FF'}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={showText}
          autoScroll={false}
          value={select}
          onChange={item => {
            setSelect(item);
          }}
          renderItem={renderItem}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View style={{backgroundColor: '#42445A'}}>
          <View style={{marginTop: 10, marginBottom: 10}}>
            <Text style={styles.promptText}>分群比較</Text>
          </View>
          <View style={{position: 'absolute', top: 10, left: 0}}>
            <Pressable
              onPress={() => navigation.pop()}
              style={styles.backButtonSet}>
              {common.backButton()}
            </Pressable>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>{LogoutTimer()}</View>
        <View style={{flex: 9}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
            bounces={false}>
            <View style={styles.contentBox}>
              <View>
                <View style={{backgroundColor: '#515369', borderRadius: 20}}>
                  <Text style={[styles.font1, {padding: 3}]}>
                    請選擇比較項目
                  </Text>
                </View>
                {createDropdpwn(
                  allCurrency,
                  '請選擇幣別A',
                  selectOne,
                  setSelectOne,
                )}
                {createDropdpwn(
                  allCurrency,
                  '請選擇幣別B',
                  selectTwo,
                  setSelectTwo,
                )}
                {createDropdpwn(
                  getDateArray(),
                  '請選擇查看月份',
                  selectMonth,
                  setSelectMonth,
                )}
                <Pressable
                  style={styles.sendButton}
                  onPress={() => {
                    sendCheck();
                  }}>
                  <Text style={styles.font1}>確認送出</Text>
                </Pressable>
                <View style={{display: displayContent ? 'flex' : 'none'}}>
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      marginVertical: 20,
                    }}>
                    <View style={styles.horizontalStyle} />
                    <View style={styles.triangleStyle} />
                  </View>
                  <View>
                    {createGrounpComparison(
                      currencyLatest1,
                      currencyLatest2,
                      currencyTopGameLatest1,
                      currencyTopGameLatest2,
                    )}
                  </View>
                </View>
              </View>
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
    backgroundColor: '#42445A',
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentSet: {
    flex: 9,
    paddingHorizontal: '5%',
  },
  contentBox: {
    backgroundColor: '#1A1C2E',
    width: '90%',
    padding: 10,
    borderRadius: 10,
  },
  promptText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 26,
    textAlign: 'center',
    paddingTop: 8,
  },
  backButtonSet: {
    alignItems: 'center',
    padding: 7,
    paddingLeft: 20,
    paddingRight: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  dropdown: {
    borderColor: '#ACB2FF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  containerStyle: {
    backgroundColor: '#1A1C2E',
    borderColor: '#ACB2FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#FFFFFF',
  },
  placeholderStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF63',
  },
  selectedTextStyle: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  item: {
    padding: 5,
    marginVertical: 4,
  },
  textItem: {
    width: '100%',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
  },
  sendButton: {
    backgroundColor: '#ACB2FF',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  triangleStyle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: '#ACB2FF',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
  },
  horizontalStyle: {
    backgroundColor: '#ACB2FF',
    width: '100%',
    height: 5,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBigBox: {alignItems: 'center', marginVertical: 5},
  segmentView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  outerFrameBox: {
    width: '100%',
    padding: 5,
    backgroundColor: '#515369',
    borderRadius: 15,
  },
  areaTextBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    width: '35%',
  },
  gameTopBox: {
    borderColor: '#ACB2FF',
    borderWidth: 1,
    width: '48%',
    height: 30,
  },
  gmaeTopText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '49%',
    paddingHorizontal: 5,
  },
  gameTopBorder: {
    width: 1,
    marginHorizontal: 1,
    backgroundColor: '#FFFFFF',
    height: 30,
  },
  imageSize: {width: 50, height: 50, resizeMode: 'contain'},
  imageSize2: {width: 30, height: 30, resizeMode: 'contain'},
  imageSize3: {width: 40, height: 40, resizeMode: 'contain'},
  font1: {color: '#FFFFFF', fontSize: 18, textAlign: 'center'},
  font2: {color: '#FFFFFF', fontSize: 18, marginTop: 10},
  font3: {color: '#000000', fontSize: 18, fontWeight: '400'},
  font4: {fontSize: 15, fontWeight: '700'},
  font5: {fontSize: 18, fontWeight: '400'},
  font6: {color: '#FFFFFF', fontSize: 20},
});

export default GroupComparison;
