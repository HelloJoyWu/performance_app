import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import BackButton from '../components/backButton';
import * as common from '../components/common';
import {AxiosContext} from '../context/axiosContext';
import {getUTCLatestDateRange} from '../core/util';
import {format} from 'date-fns';
import {BarChart} from 'react-native-gifted-charts';
import {LogoutTimer, ExtensionTime} from '../components/logoutTimer';

interface cq9ScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Cq9Screen'>;
  route: RouteProp<RootStackParamList, 'Cq9Screen'>;
}

const setCurrencyTable = (
  gameData: any,
  topData: any,
  currency: string,
  displayBrandList: Array<string>,
  setTableDataList: {(kwargs: object): void}[],
) => {
  const agent_name = [];
  const game_name = [];

  for (var i = 0; i < topData.length; i++) {
    if (topData[i].top_type === 'agent') {
      agent_name.push(topData[i]);
    } else if (topData[i].top_type === 'game') {
      game_name.push(topData[i]);
    }
  }
  const agent_name_Rank = agent_name.sort(function (a, b) {
    return a.rank > b.rank ? 1 : -1;
  });
  const game_name_Rank = game_name.sort(function (a, b) {
    return a.rank > b.rank ? 1 : -1;
  });

  const index = displayBrandList.indexOf(currency);
  setTableDataList[index]({
    owner: agent_name_Rank,
    game: gameData,
    gameName: game_name_Rank,
  });
};

const displayBrandList = ['ALL', 'CNY', 'KRW', 'THB', 'VND', 'IDR', 'PHP'];

const Cq9Screen: React.FC<cq9ScreenProps> = ({route, navigation}) => {
  const axiosContext = useContext(AxiosContext);

  const keyProps: any = route.params.keyProps || ' ';
  // const ref = React.useRef();
  const ref = React.useRef<any>(null);

  const [showDisable, setShowDidable] = useState<boolean>(true);
  const [allData, setAllData] = useState<{}>({});
  const [CNYData, setCNYData] = useState<{}>({});
  const [KRWData, setKRWData] = useState<{}>({});
  const [THBData, setTHBData] = useState<{}>({});
  const [VNDData, setVNDData] = useState<{}>({});
  const [IDRData, setIDRData] = useState<{}>({});
  const [PHPData, setPHPData] = useState<{}>({});
  const currencyDataList = [
    allData,
    CNYData,
    KRWData,
    THBData,
    VNDData,
    IDRData,
    PHPData,
  ];

  const [storeChartALLData, setStoreChartaLLData] = useState<{}>({});
  const [storeChartCNYData, setStoreChartCNYData] = useState<{}>({});
  const [storeChartKRWData, setStoreChartKRWData] = useState<{}>({});
  const [storeChartTHBData, setStoreChartTHBData] = useState<{}>({});
  const [storeChartVNDData, setStoreChartVNDData] = useState<{}>({});
  const [storeChartIDRData, setStoreChartIDRData] = useState<{}>({});
  const [storeChartPHPData, setStoreChartPHPData] = useState<{}>({});

  const allCurrencyDataList = [
    setAllData,
    setCNYData,
    setKRWData,
    setTHBData,
    setVNDData,
    setIDRData,
    setPHPData,
  ];
  const storeCurrencyDataList = [
    storeChartALLData,
    storeChartCNYData,
    storeChartKRWData,
    storeChartTHBData,
    storeChartVNDData,
    storeChartIDRData,
    storeChartPHPData,
  ];

  const [allTableData, setAllTableData] = useState<{}>({});
  const [CNYTableData, setCNYTableData] = useState<{}>({});
  const [KRWTableData, setKRWTableData] = useState<{}>({});
  const [THBTableData, setTHBTableData] = useState<{}>({});
  const [VNDTableData, setVNDTableData] = useState<{}>({});
  const [IDRTableData, setIDRTableData] = useState<{}>({});
  const [PHPTableData, setPHPTableData] = useState<{}>({});

  const tableDataList = [
    allTableData,
    CNYTableData,
    KRWTableData,
    THBTableData,
    VNDTableData,
    IDRTableData,
    PHPTableData,
  ];

  const [ALLOwnerData, setALLOwnerData] = useState<any>({name: '', value: ''});
  const [CNYOwnerData, setCNYOwnerData] = useState<any>({name: '', value: ''});
  const [KRWOwnerData, setKRWOwnerData] = useState<any>({name: '', value: ''});
  const [THBOwnerData, setTHBOwnerData] = useState<any>({name: '', value: ''});
  const [VNDOwnerData, setVNDOwnerData] = useState<any>({name: '', value: ''});
  const [IDROwnerData, setIDROwnerData] = useState<any>({name: '', value: ''});
  const [PHPOwnerData, setPHPOwnerData] = useState<any>({name: '', value: ''});

  const ownerBarDataonPress = [
    setALLOwnerData,
    setCNYOwnerData,
    setKRWOwnerData,
    setTHBOwnerData,
    setVNDOwnerData,
    setIDROwnerData,
    setPHPOwnerData,
  ];
  const ownerBarData = [
    ALLOwnerData,
    CNYOwnerData,
    KRWOwnerData,
    THBOwnerData,
    VNDOwnerData,
    IDROwnerData,
    PHPOwnerData,
  ];
  const [ALLGameTypeData, setALLGameTypeData] = useState<any>({
    name: '',
    value: '',
  });
  const [CNYGameTypeData, setCNYGameTypeData] = useState<any>({
    name: '',
    value: '',
  });
  const [KRWGameTypeData, setKRWGameTypeData] = useState<any>({
    name: '',
    value: '',
  });
  const [THBGameTypeData, setTHBGameTypeData] = useState<any>({
    name: '',
    value: '',
  });
  const [VNDGameTypeData, setVNDGameTypeData] = useState<any>({
    name: '',
    value: '',
  });
  const [IDRGameTypeData, setIDRGameTypeData] = useState<any>({
    name: '',
    value: '',
  });
  const [PHPGameTypeData, setPHPGameTypeData] = useState<any>({
    name: '',
    value: '',
  });

  const gameTypeBarDataonPress = [
    setALLGameTypeData,
    setCNYGameTypeData,
    setKRWGameTypeData,
    setTHBGameTypeData,
    setVNDGameTypeData,
    setIDRGameTypeData,
    setPHPGameTypeData,
  ];
  const gameTypeBarData = [
    ALLGameTypeData,
    CNYGameTypeData,
    KRWGameTypeData,
    THBGameTypeData,
    VNDGameTypeData,
    IDRGameTypeData,
    PHPGameTypeData,
  ];
  const [latestData, setLatestData] = useState([]);
  // const lastThirtyDaysArray = common.lastThirtyDays();

  const fetchLatest = useCallback(async () => {
    const lastALLDate = [
      {bet: keyProps.bet, player: keyProps.player, currency: 'ALL'},
    ];
    try {
      const {utcNowDateStr, utcPreDateStr} = getUTCLatestDateRange(30);

      const yesterDay = new Date(
        new Date().setDate(new Date(utcNowDateStr).getDate() - 1),
      );
      const yesterDayStr = format(yesterDay, 'yyyy-MM-dd');

      const [resp1, resp2, resp3, resp4] = await Promise.all([
        await axiosContext.authCq9Axios.get(
          `/api/v1/inquiry/sales/performance/currency/latest/${keyProps.brand}`,
        ),
        await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/sales/performance/currency/date',
          {
            params: {
              from_date: utcPreDateStr,
              to_date: yesterDayStr,
            },
          },
        ),
        axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/sales/performance/date',
          {
            params: {from_date: utcPreDateStr, to_date: utcNowDateStr},
          },
        ),
        await axiosContext.authCq9Axios.get(
          `/api/v1/inquiry/sales/performance/currency/latest/${keyProps.brand}`,
        ),
      ]);
      if (typeof resp1.data !== 'object' && typeof resp2.data !== 'object') {
        console.error('Fetch currency nothing');
      }
      console.log('Loading latest currency performane success');

      setLatestData(resp1.data.concat(lastALLDate));
      setShowDidable(false);
      currencyClassify(resp1.data.concat(resp2.data));
      setStoreChartaLLData(common.chartsDataarrange(resp3.data, 'CQ9'));
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, [axiosContext.authCq9Axios, keyProps]);

  const fetchCurrencyData = useCallback(
    async (currency: string) => {
      //top10 API
      try {
        const [resp1, resp2] = await Promise.all([
          await axiosContext.authCq9Axios.get(
            `/api/v1/inquiry/sales/performance/gametype/latest/${keyProps.brand}`,
            {
              params: {by_currency: currency},
            },
          ),
          await axiosContext.authCq9Axios.get(
            `/api/v1/inquiry/sales/performance/top/bet/latest/${keyProps.brand}`,
            {
              params: {by_currency: currency},
            },
          ),
        ]);
        if (typeof resp1.data !== 'object' && typeof resp2.data !== 'object') {
          console.error('Fetch gametype and top nothing');
        }
        console.log('Loading latest gametype and top performane success');
        setCurrencyTable(resp1.data, resp2.data, currency, displayBrandList, [
          setAllTableData,
          setCNYTableData,
          setKRWTableData,
          setTHBTableData,
          setVNDTableData,
          setIDRTableData,
          setPHPTableData,
        ]);
      } catch (error: any) {
        const alertMsg = error.response.config.url
          ? `[${error.response.status}] ${error.response.data.message}`
          : `${error}`;
        console.error('Fetch latest gametype and top failed', alertMsg);
      }
    },
    [axiosContext.authCq9Axios, keyProps],
  );

  useEffect(() => {
    console.log('Loading latest currency performane');
    fetchLatest();
    switchPushArray();
  }, [fetchLatest]);

  const [showBoxBool, setShowBoxBool] = useState<boolean>();
  const [showBoxBoolArray, setShowBoxBoolArray] = useState<boolean[]>([]);

  const createTableBox = (database: any, type: string, quantity: number) => {
    var databaseTypeOrigin = type === 'top' ? database.owner : database.game;
    var databaseType = Object.assign([], databaseTypeOrigin);

    if (!databaseType) {
      databaseType = [];
    }
    databaseType = common.tableDataSore(databaseType);
    if (databaseType.length < quantity) {
      for (var i = 0; i < quantity; i++) {
        if (!databaseType[i]) {
          databaseType.push({name: '-', bet: 0});
        }
      }
    }
    if (databaseType) {
      for (var i = 0; i < databaseType.length; i++) {
        if (databaseType[i].gametype === 'lotto') {
          databaseType.splice(i, 1);
        }
      }
    }
    return databaseType.map((obj: any, index: number) => {
      const name = obj.name
        ? obj.name
        : common.convertGameTypeName(obj.gametype);

      const dif_pre_bet = ((obj.bet - obj.pre_bet) / obj.pre_bet) * 100;
      const dif_pre_month_avg_bet =
        ((obj.bet - obj.pre_month_avg_bet) / obj.pre_month_avg_bet) * 100;

      let showCurrency: boolean = true;
      if (obj.currency === 'CNY') {
        showCurrency = false;
      }
      if (obj.currency === 'ALL') {
        showCurrency = false;
      }

      return (
        <View key={obj + index}>
          <View style={styles.tableNameTextBox}>
            <View style={{width: '42%'}}>
              <Text style={styles.tableNameText}>
                {index + 1}. {name}
              </Text>
            </View>
            <View style={{width: '58%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: showCurrency ? 'space-between' : 'flex-end',
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    display: showCurrency ? 'flex' : 'none',
                  }}>
                  (CNY)
                </Text>
                <Text style={[styles.tableNameText, {textAlign: 'right'}]}>
                  {common.thousandths(obj.bet) === '0'
                    ? '-'
                    : common.thousandths(obj.bet)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  display: showCurrency ? 'flex' : 'none',
                }}>
                <Text style={{color: '#FFFFFF'}}>({obj.currency})</Text>
                <Text style={[styles.tableNameText, {textAlign: 'right'}]}>
                  {common.thousandths(obj.bet) === '0'
                    ? '-'
                    : common.thousandths(
                        common.exchangeRate(obj.currency, obj.bet),
                      )}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              alignItems: 'flex-end',
            }}>
            <View style={styles.tableDataText}>
              <Text style={{color: '#FFFFFF', opacity: 0.7, fontSize: 12}}>
                前日差
              </Text>
              <Text
                style={[
                  styles.tableDataNum,
                  {color: common.tableDataTextColor(dif_pre_bet)},
                ]}>
                {common.decimalPoint(dif_pre_bet)}%
              </Text>
            </View>
            <View style={styles.tableDataText}>
              <Text style={{color: '#FFFFFF', opacity: 0.7, fontSize: 12}}>
                上月日均差
              </Text>
              <Text
                style={[
                  styles.tableDataNum,
                  {color: common.tableDataTextColor(dif_pre_month_avg_bet)},
                ]}>
                {common.decimalPoint(dif_pre_month_avg_bet)}%
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const currencyClassify = (data: any) => {
    //分類30天日期
    const cny_data_array: string[] = [];
    const cny_bet_array: number[] = [];
    const cny_player_array: number[] = [];
    var cny_bet_sum: number = 0;
    var cny_player_sum: number = 0;

    const krw_data_array: string[] = [];
    const krw_bet_array: number[] = [];
    const krw_player_array: number[] = [];
    var krw_bet_sum: number = 0;
    var krw_player_sum: number = 0;

    const thb_data_array: string[] = [];
    const thb_bet_array: number[] = [];
    const thb_player_array: number[] = [];
    var thb_bet_sum: number = 0;
    var thb_player_sum: number = 0;

    const vnd_data_array: string[] = [];
    const vnd_bet_array: number[] = [];
    const vnd_player_array: number[] = [];
    var vnd_bet_sum: number = 0;
    var vnd_player_sum: number = 0;

    const idr_data_array: string[] = [];
    const idr_bet_array: number[] = [];
    const idr_player_array: number[] = [];
    var idr_bet_sum: number = 0;
    var idr_player_sum: number = 0;

    const php_data_array: string[] = [];
    const php_bet_array: number[] = [];
    const php_player_array: number[] = [];
    var php_bet_sum: number = 0;
    var php_player_sum: number = 0;

    for (var i = 0; i < data.length; i++) {
      const database = data[i];

      if (database.currency === 'CNY') {
        cny_data_array.unshift(common.dateFormat(database.date));
        cny_bet_array.unshift(database.bet);
        cny_player_array.unshift(database.player);
        cny_bet_sum += database.bet;
        cny_player_sum += database.player;
      } else if (database.currency === 'KRW') {
        krw_data_array.unshift(common.dateFormat(database.date));
        krw_bet_array.unshift(database.bet);
        krw_player_array.unshift(database.player);
        krw_bet_sum += database.bet;
        krw_player_sum += database.player;
      } else if (database.currency === 'THB') {
        thb_data_array.unshift(common.dateFormat(database.date));
        thb_bet_array.unshift(database.bet);
        thb_player_array.unshift(database.player);
        thb_bet_sum += database.bet;
        thb_player_sum += database.player;
      } else if (database.currency === 'VND') {
        vnd_data_array.unshift(common.dateFormat(database.date));
        vnd_bet_array.unshift(database.bet);
        vnd_player_array.unshift(database.player);
        vnd_bet_sum += database.bet;
        vnd_player_sum += database.player;
      } else if (database.currency === 'IDR') {
        idr_data_array.unshift(common.dateFormat(database.date));
        idr_bet_array.unshift(database.bet);
        idr_player_array.unshift(database.player);
        idr_bet_sum += database.bet;
        idr_player_sum += database.player;
      } else if (database.currency === 'PHP') {
        php_data_array.unshift(common.dateFormat(database.date));
        php_bet_array.unshift(database.bet);
        php_player_array.unshift(database.player);
        php_bet_sum += database.bet;
        php_player_sum += database.player;
      }
    }
    const cny_bet_age: number = cny_bet_sum / cny_data_array.length;
    const cny_player_age: number = cny_player_sum / cny_data_array.length;

    const krw_bet_age: number = krw_bet_sum / krw_data_array.length;
    const krw_player_age: number = krw_player_sum / krw_data_array.length;

    const thb_bet_age: number = thb_bet_sum / thb_data_array.length;
    const thb_player_age: number = thb_player_sum / thb_data_array.length;

    const vnd_bet_age: number = vnd_bet_sum / vnd_data_array.length;
    const vnd_player_age: number = vnd_player_sum / vnd_data_array.length;

    const idr_bet_age: number = idr_bet_sum / idr_data_array.length;
    const idr_player_age: number = idr_player_sum / idr_data_array.length;

    const php_bet_age: number = php_bet_sum / php_data_array.length;
    const php_player_age: number = php_player_sum / php_data_array.length;

    const new_cny_date_array = common.lastThirtyDays(cny_data_array);
    const new_krw_date_array = common.lastThirtyDays(krw_data_array);
    const new_thb_date_array = common.lastThirtyDays(thb_data_array);
    const new_vnd_date_array = common.lastThirtyDays(vnd_data_array);
    const new_idr_date_array = common.lastThirtyDays(idr_data_array);
    const new_php_date_array = common.lastThirtyDays(php_data_array);

    for (var a = 0; a < 30; a++) {
      if (cny_data_array[a] !== new_cny_date_array[a]) {
        cny_data_array.splice(a, 0, new_cny_date_array[a]);
        cny_bet_array.splice(a, 0, 0);
        cny_player_array.splice(a, 0, 0);
      }
      if (krw_data_array[a] !== new_krw_date_array[a]) {
        krw_data_array.splice(a, 0, new_krw_date_array[a]);
        krw_bet_array.splice(a, 0, 0);
        krw_player_array.splice(a, 0, 0);
      }
      if (thb_data_array[a] !== new_thb_date_array[a]) {
        thb_data_array.splice(a, 0, new_thb_date_array[a]);
        thb_bet_array.splice(a, 0, 0);
        thb_player_array.splice(a, 0, 0);
      }
      if (vnd_data_array[a] !== new_vnd_date_array[a]) {
        vnd_data_array.splice(a, 0, new_vnd_date_array[a]);
        vnd_bet_array.splice(a, 0, 0);
        vnd_player_array.splice(a, 0, 0);
      }
      if (idr_data_array[a] !== new_idr_date_array[a]) {
        idr_data_array.splice(a, 0, new_idr_date_array[a]);
        idr_bet_array.splice(a, 0, 0);
        idr_player_array.splice(a, 0, 0);
      }
      if (php_data_array[a] !== new_php_date_array[a]) {
        php_data_array.splice(a, 0, new_php_date_array[a]);
        php_bet_array.splice(a, 0, 0);
        php_player_array.splice(a, 0, 0);
      }
    }

    const cny_obj = {
      name: 'CNY',
      date: cny_data_array,
      bet: cny_bet_array,
      player: cny_player_array,
      bet_age: cny_bet_age,
      player_age: cny_player_age,
    };
    const krw_obj = {
      name: 'KRD',
      date: krw_data_array,
      bet: krw_bet_array,
      player: krw_player_array,
      bet_age: krw_bet_age,
      player_age: krw_player_age,
    };
    const thb_obj = {
      name: 'THB',
      date: thb_data_array,
      bet: thb_bet_array,
      player: thb_player_array,
      bet_age: thb_bet_age,
      player_age: thb_player_age,
    };
    const vnd_obj = {
      name: 'VND',
      date: vnd_data_array,
      bet: vnd_bet_array,
      player: vnd_player_array,
      bet_age: vnd_bet_age,
      player_age: vnd_player_age,
    };
    const idr_obj = {
      name: 'IDR',
      date: idr_data_array,
      bet: idr_bet_array,
      player: idr_player_array,
      bet_age: idr_bet_age,
      player_age: idr_player_age,
    };
    const php_obj = {
      name: 'PHP',
      date: php_data_array,
      bet: php_bet_array,
      player: php_player_array,
      bet_age: php_bet_age,
      player_age: php_player_age,
    };
    setStoreChartCNYData(cny_obj);
    setStoreChartKRWData(krw_obj);
    setStoreChartTHBData(thb_obj);
    setStoreChartVNDData(vnd_obj);
    setStoreChartIDRData(idr_obj);
    setStoreChartPHPData(php_obj);
  };

  const BarChartProportion = (
    data: any,
    type: string,
    index: number,
    totBet: number,
  ) => {
    if (!data.owner) {
      return null;
    }

    if (type === 'top') {
      const obj = data.owner;

      const dataArray: any = [];
      for (var i = 0; i < obj.length; i++) {
        const dataBase = obj[i];
        const betPro = (dataBase.bet / totBet) * 100;
        const betProStr = Number(betPro.toFixed(1)) + '%';
        const setIndex = index;
        dataArray.push({
          value: betPro,
          name: dataBase.name,
          onPress: () => {
            ownerBarDataonPress[setIndex]({
              name: dataBase.name,
              value: betProStr,
            });
          },
          topLabelComponent: () => (
            <Text style={styles.barChartText}>{betProStr}</Text>
          ),
        });
      }
      const newArray = tableTopTen(dataArray);
      return createBarChart(newArray, 10, index, type);
    } else if (type === 'game') {
      const obj = data.game;
      const dataArray: any = [];

      for (var i = 0; i < obj.length; i++) {
        const dataBase = obj[i];

        const betPro = (dataBase.bet / totBet) * 100;
        const betProStr = Number(betPro.toFixed(1)) + '%';
        const setIndex = index;
        if (dataBase.gametype !== 'lotto') {
          dataArray.push({
            value: betPro,
            name: dataBase.gametype,
            frontColor: '#79C3DB',
            onPress: () => {
              gameTypeBarDataonPress[setIndex]({
                name: common.convertGameTypeName(dataBase.gametype),
                value: betProStr,
              });
            },
            topLabelComponent: () => (
              <Text style={styles.barChartText}>{betProStr}</Text>
            ),
          });
        }
      }
      const newArray = tableTopTen(dataArray);
      return createBarChart(newArray, 20, index, type);
    }
  };

  const tableTopTen = (data: any[]) => {
    const colorArray = [
      '#3C46CD',
      '#4B3ED3',
      '#5A36D9',
      '#692EDF',
      '#7428D9',
      '#871EEB',
      '#9616F1',
      '#A50EF7',
      '#A50EF7',
      '#B406FD',
      '#C100FF',
    ];
    data = data.sort(function (a, b) {
      return a.value < b.value ? 1 : -1;
    });
    for (var i = 0; i < data.length; i++) {
      data[i].frontColor = colorArray[i];
      const xText = i + 1;
      data[i].labelComponent = () => (
        <Text style={styles.barXText}>{xText}</Text>
      );
    }
    return data;
  };

  const createBarChart = (
    data: any,
    bar: number,
    index: number,
    type: string,
  ) => {
    var nameText = '';
    var valueText = '';
    var barSpacing = bar * 1.2;
    var barWidth = bar;
    var deductWidth = 110;

    if (type === 'top') {
      if (ownerBarData[index]) {
        nameText = ownerBarData[index].name;
        valueText = ownerBarData[index].value;
      }
      barSpacing = bar * 2;
      barWidth = bar * 2.1;
      deductWidth = 50;
    } else if (type === 'game') {
      if (gameTypeBarData[index]) {
        nameText = gameTypeBarData[index].name;
        valueText = gameTypeBarData[index].value;
      }
    }
    return (
      <View style={{marginLeft: 30}}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            top: 10,
            right: 50,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignItems: 'center',
            borderRadius: 10,
            display: nameText !== '' ? 'flex' : 'none',
          }}>
          <Text>{nameText}</Text>
          <Text>{valueText}</Text>
        </View>
        <BarChart
          width={Dimensions.get('window').width - deductWidth}
          spacing={barSpacing}
          data={data}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules={true}
          initialSpacing={20}
          yAxisLabelWidth={0.1}
          labelWidth={0}
          barWidth={barWidth}
        />
      </View>
    );
  };

  const createDetailedView = (obj: any) => {
    if (!obj.bet) {
      obj = {bet: [], date: [], player: []};
    }
    return (
      <View>
        <View>
          <View style={{margin: 2}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: '500'}}>
                近30天走勢圖
              </Text>
            </View>
            <View style={styles.rightSmallText}>
              <Text style={{color: '#FFFFFF', fontSize: 12}}>
                換算幣別：CNY
              </Text>
            </View>
          </View>

          <View style={styles.chartBox}>
            <View>
              <Text style={{color: '#BFF2FF', fontSize: 18}}>總碼量</Text>
            </View>
            {common.chartsProps(
              obj.date,
              obj.bet,
              obj.bet_age,
              '#BFF2FF',
              '碼量',
              true,
            )}
          </View>
          <View style={{paddingHorizontal: 20}}>
            <View style={{paddingTop: 5}}>
              <Text style={{color: '#FFEFBF', fontSize: 18}}>總人數</Text>
            </View>
            {common.chartsProps(
              obj.date,
              obj.player,
              obj.player_age,
              '#FFEFBF',
              '人數',
              true,
            )}
          </View>
        </View>
      </View>
    );
  };

  const createInformationBar = (datalist: any, database: any) => {
    return datalist.map((obj: any, index: number) => {
      for (var i = 0; i < database.length; i++) {
        const data = database[i];
        if (obj === data.currency) {
          const defaultInfo = {
            bet: data.bet,
            brand: data.brand,
            currency: data.currency,
            date: data.date,
            net_win: data.net_win,
            player: data.player,
            rounds: data.rounds,
          };
          return createInformationView(defaultInfo, index);
        }
      }
      const defaultInfo = {
        bet: 0,
        brand: '',
        currency: obj,
        date: '',
        net_win: 0,
        player: 0,
        rounds: 0,
      };
      return createInformationView(defaultInfo, index);
    });
  };

  const currencyImage = (name: string) => {
    if (name === 'CNY') {
      return (
        <Image
          source={require('../../res/currency/CNY.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'KRW') {
      return (
        <Image
          source={require('../../res/currency/KRW.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'THB') {
      return (
        <Image
          source={require('../../res/currency/THB.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'VND') {
      return (
        <Image
          source={require('../../res/currency/VND.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'IDR') {
      return (
        <Image
          source={require('../../res/currency/IDR.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'PHP') {
      return (
        <Image
          source={require('../../res/currency/PHP.png')}
          style={styles.imageSize}
        />
      );
    }
  };

  const createGameNameRanking = (data: any, start: number) => {
    if (!data.gameName) {
      return null;
    }
    return data.gameName.map((obj: any, index: number) => {
      if (index < start || index > start + 4) {
        return null;
      }
      return (
        <View key={'name' + index} style={styles.gmaeName}>
          <Text style={styles.tableNameText}>{index + 1}.</Text>
          <Text style={styles.tableNameText}>{obj.name}</Text>
        </View>
      );
    });
  };

  const createInformationView = (defaultInfo: any, index: number) => {
    return (
      <View style={styles.currencyBigView} key={defaultInfo.currency + index}>
        <Pressable
          style={styles.currencyViex}
          disabled={showDisable}
          onPress={() => {
            console.log('按下幣別：', displayBrandList[index]);
            if (!showBoxBoolArray[index]) {
              fetchCurrencyData(displayBrandList[index]);
              allCurrencyDataList[index](storeCurrencyDataList[index]);
            }
            //下面兩行缺一不可 可以手動顯示消失
            showBoxBoolArray[index] = !showBoxBoolArray[index];
            setShowBoxBool(!showBoxBool);
          }}>
          {displayBrandList[index] === 'ALL' ? (
            <View style={{flexDirection: 'row', height: 60}}>
              <View style={{alignSelf: 'center', width: '85%'}}>
                <Text style={{color: '#FFFFFF', fontSize: 20, paddingLeft: 10}}>
                  整體近30天走勢圖
                </Text>
              </View>
              <View
                style={{
                  width: '15%',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../res/arrow.png')}
                  style={{
                    transform: [
                      {rotate: showBoxBoolArray[index] ? '0deg' : '-90deg'},
                    ],
                  }}
                />
              </View>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: '20%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {currencyImage(defaultInfo.currency)}
                <Text
                  style={{
                    width: '100%',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontSize: 20,
                  }}>
                  {defaultInfo.currency}
                </Text>
              </View>
              <View
                style={{
                  width: '70%',
                  paddingRight: 10,
                  justifyContent: 'space-between',
                }}>
                <View style={[styles.contentTextSet, {width: '100%'}]}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 13,
                      display: defaultInfo.currency === 'CNY' ? 'flex' : 'none',
                    }}>
                    總碼量
                  </Text>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 13,
                      display: defaultInfo.currency !== 'CNY' ? 'flex' : 'none',
                    }}>
                    總碼量(CNY)
                  </Text>
                  <Text
                    style={{
                      color: '#BFF2FF',
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    {common.thousandths(defaultInfo.bet)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.contentTextSet,
                    {
                      display: defaultInfo.currency !== 'CNY' ? 'flex' : 'none',
                      width: '100%',
                    },
                  ]}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 13,
                    }}>
                    總碼量({defaultInfo.currency})
                  </Text>
                  <Text
                    style={{
                      color: '#BFF2FF',
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    {common.thousandths(
                      common.exchangeRate(
                        defaultInfo.currency,
                        defaultInfo.bet,
                      ),
                    )}
                  </Text>
                </View>
                <View style={[styles.contentTextSet, {width: '100%'}]}>
                  <Text style={{color: '#FFFFFF', fontSize: 13}}>總人數</Text>
                  <Text
                    style={{
                      color: '#FFEFBF',
                      fontSize: 18,
                      fontWeight: '500',
                    }}>
                    {common.thousandths(defaultInfo.player)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '10%',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../res/arrow.png')}
                  style={{
                    transform: [
                      {rotate: showBoxBoolArray[index] ? '0deg' : '-90deg'},
                    ],
                  }}
                />
              </View>
            </View>
          )}
        </Pressable>
        <View style={{display: showBoxBoolArray[index] ? 'flex' : 'none'}}>
          {createDetailedView(currencyDataList[index])}
          <View style={[styles.tableBox, styles.tableBorder]}>
            <Text style={styles.tableTitleText}>當日TOP10包網商碼量</Text>
            {createTableBox(tableDataList[index], 'top', 10)}
          </View>
          <View
            style={[
              styles.tableBox,
              {borderTopColor: '#48158B', borderTopWidth: 5},
            ]}>
            <View>
              <Text style={styles.tableTitleText}>當日Top10包網商佔比</Text>
            </View>
            {BarChartProportion(
              tableDataList[index],
              'top',
              index,
              defaultInfo.bet,
            )}
          </View>
          <View style={[styles.tableBox, styles.tableBorder]}>
            <Text style={styles.tableTitleText}>當日遊戲種類碼量</Text>
            {createTableBox(tableDataList[index], 'game', 0)}
          </View>
          <View
            style={[
              styles.tableBox,
              {borderTopColor: '#48158B', borderTopWidth: 5},
            ]}>
            <View>
              <Text style={styles.tableTitleText}>當日遊戲種類佔比</Text>
            </View>
            {BarChartProportion(
              tableDataList[index],
              'game',
              index,
              defaultInfo.bet,
            )}
            <View style={styles.gamgeNameBox}>
              <Text style={styles.tableTitleText}>當日熱門Top 10遊戲名稱</Text>
              <View style={styles.gameNameList}>
                <View style={{width: '49%'}}>
                  {createGameNameRanking(tableDataList[index], 0)}
                </View>
                <View style={{width: '49%'}}>
                  {createGameNameRanking(tableDataList[index], 5)}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const switchPushArray = () => {
    for (var i = 0; i < displayBrandList.length; i++) {
      setShowBoxBoolArray(prevFriends => [
        ...prevFriends,
        false,
        // (true)
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          <View style={{width: '100%'}}>
            <BackButton
              title={'cq9'}
              onPress={() => navigation.pop()}
              bgcolor={'#42445A'}
            />
          </View>
        </View>
        {LogoutTimer()}

        <View style={{flex: 8, width: '100%'}}>
          <ScrollView contentContainerStyle={{alignItems: 'center'}} ref={ref}>
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
            {createInformationBar(displayBrandList, latestData)}
          </ScrollView>
          <Pressable
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}
            onPress={() => {
              for (var i = 0; i < showBoxBoolArray.length; i++) {
                showBoxBoolArray[i] = false;
              }
              ref.current.scrollTo({x: 0, y: 0, animated: true});
            }}>
            <Image
              source={require('../../res/btn_Top.png')}
              style={{width: 35, height: 35}}
            />
          </Pressable>
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
    marginBottom: 3,
  },
  todayDataBoxDate: {
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayDataBoxDatabase: {
    width: '70%',
    borderLeftColor: '#FFFFFF',
    borderLeftWidth: 1,
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  tableBox: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  tableBorder: {
    borderTopColor: '#646464',
    borderTopWidth: 5,
  },
  tableTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    margin: 10,
  },
  tableNameTextBox: {
    borderRadius: 20,
    backgroundColor: '#646464',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  tableNameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  tableDataText: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
  },
  tableDataNum: {
    paddingRight: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  rightSmallText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  chartBox: {
    paddingHorizontal: 10,
    borderBottomColor: '#FFFFFF45',
    borderBottomWidth: 3,
    marginHorizontal: 15,
  },
  imageSize: {
    width: 45,
    height: 45,
  },
  currencyBigView: {
    backgroundColor: '#1A1C2E',
    borderRadius: 15,
    marginVertical: 3,
    width: '90%',
  },
  currencyViex: {
    backgroundColor: '#42445A',
    borderRadius: 15,
    padding: 15,
  },
  barChartText: {
    color: '#FFFFFF',
    fontSize: 14,
    width: 45,
    height: 20,
    padding: 1,
    lineHeight: 20,
    textAlign: 'center',
  },
  barXText: {
    color: '#FFFFFF',
    fontSize: 14,
    height: 20,
    padding: 1,
    textAlign: 'center',
  },
  gamgeNameBox: {
    width: '100%',
    borderTopColor: '#FFFFFF6C',
    borderTopWidth: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  gameNameList: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gmaeName: {
    backgroundColor: '#42445A',
    width: '98%',
    marginHorizontal: '1%',
    marginVertical: 2,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
});

export default Cq9Screen;
