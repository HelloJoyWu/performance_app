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
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as common from '../../components/common';
import {format} from 'date-fns';
import {AxiosContext} from '../../context/axiosContext';
import {loadView} from '../../components/loadImage';
import * as StorageHelper from '../../helpers/storageHelper';
import {LineChart} from 'react-native-gifted-charts';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';

interface cq9AllAccBetScreenScreenProps {
  navigation: StackNavigationProp<
    RootStackParamList,
    'CQ9AllAccBetScreenScreen'
  >;
}

const CQ9AllAccBetScreen: React.FC<cq9AllAccBetScreenScreenProps> = ({
  navigation,
}) => {
  const axiosContext = useContext(AxiosContext);
  // const ref = React.useRef<any>(null);

  const allCurrency = [
    'CNY',
    'KRW',
    'THB',
    'VND',
    'IDR',
    'MYR',
    'PHP',
    'MMK',
    'USD',
    'HKD',
  ];
  const [nowTime, setNowTime] = useState<string>(
    format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
  );

  // 當月為on_month預設this，前月為pre
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [agentDataArray, setAgentDataArray] = useState<any[]>([]);
  const [agentLineData, setAgentLineData] = useState<any[]>([]);

  const [loadingDisplay, setLoadingDisplay] = useState<boolean>(false);
  const [ownerArray, setOwnerArray] = useState<any[]>([]);
  const [showExclamationText, setShowExclamationText] =
    useState<boolean>(false);

  const getStorageItem = async () => {
    const owner_list = await StorageHelper.getOwnerList('ownerList');
    setOwnerArray(owner_list);
  };

  const covnertLineChartData = (data: any, agentData: any) => {
    const normalizeArray: number[] = [];

    const haveBet: number[] = [];
    let haveAddBet: number = 0;
    for (let a = 0; a < data.data.length; a++) {
      normalizeArray.push(data.data[a].bet);
      if (data.data[a].bet !== 0) {
        haveBet.push(data.data[a].bet);
        haveAddBet += data.data[a].bet;
      }
    }
    const normalizeValueArray = common.normalizeValue(normalizeArray, 0);
    const dataBase: any[] = [];
    for (let i = 0; i < data.data.length; i++) {
      dataBase.push({
        date: data.data[i].date,
        bet: data.data[i].bet,
        value: isNaN(normalizeValueArray[0][i]) ? 0 : normalizeValueArray[0][i],
      });
    }

    return {
      data: dataBase,
      compare_pre: data.compare,
      compare_this: haveAddBet / haveBet.length,
      bet: agentData.bet,
      oid: agentData.oid,
    };
  };

  const fetchAgentLatest = useCallback(
    async (agentData: any, currcncy: string, month: string) => {
      try {
        const resp1 = await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/agent/owner/month/date/bet',
          {
            params: {
              owner_id: agentData.oid,
              check_currency: currcncy,
              on_month: month,
            },
          },
        );
        console.log(agentData.oid, resp1.data);
        const database = covnertLineChartData(resp1.data, agentData);
        setAgentLineData(oldArray => [...oldArray, database]);
      } catch (error: any) {
        const alertMsg = error.response.config.baseURL
          ? `${error.response.data.message} under host ${error.response.config.baseURL}`
          : `${error}`;
        console.error('Fetch latest currency failed', alertMsg);
      }
    },
    [axiosContext.authCq9Axios],
  );

  const fetchCurrencyLatest = useCallback(
    async (currency: string, month: string) => {
      setLoadingDisplay(true);
      try {
        const resp1 = await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/currency/month/top/owner',
          {
            params: {
              check_currency: currency,
              on_month: month,
            },
          },
        );
        console.log(resp1.data);
        setLoadingDisplay(false);
        for (let i = 0; i < resp1.data.length; i++) {
          setAgentDataArray(oldArray => [...oldArray, resp1.data[i]]);
          fetchAgentLatest(resp1.data[i], currency, month);
        }
        setNowTime(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
      } catch (error: any) {
        const alertMsg = error.response.config.baseURL
          ? `${error.response.data.message} under host ${error.response.config.baseURL}`
          : `${error}`;
        console.error('Fetch latest currency failed', alertMsg);
        setLoadingDisplay(false);
      }
    },
    [axiosContext.authCq9Axios, fetchAgentLatest],
  );

  useEffect(() => {
    console.log('Loading champ latest currency performane');
    getStorageItem();
  }, []);

  const sentCurrencyData = (currcncy: string) => {
    if (currcncy === selectedCurrency) {
      return;
    }
    setSelectedCurrency(currcncy);
    if (selectedMonth.length <= 0) {
      return;
    }
    setAgentDataArray([]);
    setAgentLineData([]);
    fetchCurrencyLatest(currcncy, selectedMonth);
  };

  const snetMonthDatt = (month: string) => {
    if (month === selectedMonth) {
      return;
    }
    setSelectedMonth(month);
    if (selectedCurrency.length <= 0) {
      return;
    }
    setAgentDataArray([]);
    setAgentLineData([]);
    fetchCurrencyLatest(selectedCurrency, month);
  };

  const createCurrencyBtn = (allCurrencyArray: any[]) => {
    return allCurrencyArray.map((obj: any, index: number) => {
      return (
        <Pressable
          key={'currency_' + index}
          onPress={() => {
            sentCurrencyData(obj);
          }}
          style={[
            styles.currencyBtnView,
            {backgroundColor: selectedCurrency === obj ? '#ACB2FF' : '#1A1C2E'},
          ]}>
          <Text
            style={[
              styles.font1,
              {color: selectedCurrency === obj ? '#000000' : '#FFFFFF'},
            ]}>
            {obj}
          </Text>
        </Pressable>
      );
    });
  };

  const convertOidName = (oid: number) => {
    const name = ownerArray.find(x => x.value === oid);
    if (name) {
      return name.label;
    } else {
      oid;
    }
  };

  const createLineChart = (data: any) => {
    if (!data || data.length <= 0) {
      return (
        <View style={styles.loadBox}>
          <ActivityIndicator size="large" color="#A1A1A1" />
        </View>
      );
    }

    const indexLength = data.data.length === 1 ? 1 : data.data.length - 1;

    const dif_pre_bet =
      ((data.compare_this - data.compare_pre) / data.compare_pre) * 100;

    const numColor = dif_pre_bet >= 0 ? '#4BFFCA' : '#FF7778';
    const allWidth = Dimensions.get('window').width * 0.9;
    const spacingWidth = (allWidth * 0.44) / indexLength;
    const hiedPoint = data.data.length >= 6 ? true : false;
    if (data.data.length === 1) {
      return (
        <View style={{width: allWidth * 0.49, alignItems: 'center'}}>
          <View style={{height: 90, justifyContent: 'center'}}>
            <Text style={styles.font5}>目前只有一筆資料</Text>
          </View>
          <Text style={{color: numColor, fontSize: 15}}>
            {common.decimalPoint(dif_pre_bet)}%
          </Text>
        </View>
      );
    }
    return (
      <View style={{width: allWidth * 0.49, alignItems: 'center'}}>
        <View style={{maxWidth: allWidth * 0.46}}>
          <LineChart
            data={data.data}
            height={90}
            yAxisLabelWidth={0.1}
            initialSpacing={4}
            spacing={spacingWidth}
            disableScroll
            xAxisColor="none"
            yAxisColor="#41414100"
            hideRules={true}
            labelsExtraHeight={-30}
            color={numColor}
            areaChart
            startFillColor={numColor}
            endFillColor={numColor}
            startOpacity={0.3}
            endOpacity={0.01}
            hideDataPoints={hiedPoint}
            dataPointsColor1={numColor}
          />
        </View>
        <Text style={{color: numColor, fontSize: 15}}>
          {common.decimalPoint(dif_pre_bet)}%
        </Text>
      </View>
    );
  };

  const createAgentBox = (data: any[]) => {
    if (agentLineData.length <= 0) {
      return;
    }

    return data.map((obj: any, index: number) => {
      const angentDataBase = agentLineData.find(item => item.oid === obj.oid);
      return (
        <View key={'ChartLine_' + index} style={styles.lineChartBox}>
          <Text style={styles.font2}>{convertOidName(obj.oid)}</Text>
          <Text style={styles.font3}>{common.thousandths(obj.bet)}</Text>
          <View>{createLineChart(angentDataBase)}</View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View>
          <View style={{marginTop: 10, marginBottom: 10}}>
            <Text style={styles.promptText}>整體累積碼量-CQ9各幣別</Text>
          </View>
          <Text style={{color: '#FFFFFF', textAlign: 'center', fontSize: 13}}>
            更新時間:{nowTime}
          </Text>
          <View style={{position: 'absolute', top: 10, left: 0}}>
            <Pressable
              onPress={() => navigation.pop()}
              style={styles.backButtonSet}>
              {common.backButton()}
            </Pressable>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>{LogoutTimer()}</View>
        <View style={styles.viewBox}>
          <View style={styles.selectBigBox}>
            <Text style={{color: '#FFFFFF', fontSize: 18}}>請選按查看項目</Text>
            <View style={styles.monthSelectBox}>
              <Pressable
                onPress={() => {
                  snetMonthDatt('pre');
                }}
                style={[
                  styles.monthBtnView,
                  {
                    backgroundColor:
                      selectedMonth === 'pre' ? '#ACB2FF' : '#1A1C2E',
                  },
                ]}>
                <Text
                  style={[
                    styles.font4,
                    {color: selectedMonth === 'pre' ? '#000000' : '#ACB2FF'},
                  ]}>
                  前月
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  snetMonthDatt('this');
                }}
                style={[
                  styles.monthBtnView,
                  {
                    backgroundColor:
                      selectedMonth === 'this' ? '#ACB2FF' : '#1A1C2E',
                  },
                ]}>
                <Text
                  style={[
                    styles.font4,
                    {color: selectedMonth === 'this' ? '#000000' : '#ACB2FF'},
                  ]}>
                  當月
                </Text>
              </Pressable>
            </View>
            <ScrollView horizontal={true} style={{marginLeft: '2.5%'}}>
              {createCurrencyBtn(allCurrency)}
            </ScrollView>
            <View style={{position: 'absolute', top: 10, right: 10}}>
              <Pressable onPress={() => setShowExclamationText(true)}>
                <Image
                  source={require('../../../res/picture/info_yellow.png')}
                  style={styles.image1}
                />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={{width: '100%'}}
            contentContainerStyle={{alignItems: 'center'}}>
            <View style={styles.showAllChartBox}>
              {createAgentBox(agentDataArray)}
            </View>
          </ScrollView>
        </View>

        <Pressable
          onPress={() => {
            setShowExclamationText(false);
          }}
          style={{
            display: showExclamationText ? 'flex' : 'none',
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}>
          <View style={[styles.exclamationPointBox]}>
            <Text style={styles.fon8}>-說明-</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.font6}>*</Text>
              <Text style={styles.font6}>成長率為日平均</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.font6}>*</Text>
              <Text style={styles.font6}>
                跨月第一日因帳務尚未結算,數據則會顯示前兩月份資料(ex:12/1會顯示10月及11月份資料)
              </Text>
            </View>
          </View>
        </Pressable>

        {loadView(loadingDisplay)}
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
  promptText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 23,
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
    backgroundColor: '#666DC1',
  },
  loadBox: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBox: {width: '100%', alignItems: 'center', height: '85%'},
  selectBigBox: {
    width: '90%',
    marginHorizontal: '5%',
    paddingVertical: 10,
    backgroundColor: '#1A1C2E',
    alignItems: 'center',
    borderRadius: 5,
  },
  monthSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 15,
  },
  monthBtnView: {
    borderColor: '#ACB2FF',
    borderRadius: 7,
    borderWidth: 2,
    width: '45%',
    paddingVertical: 5,
    alignItems: 'center',
  },
  currencyBtnView: {
    borderColor: '#ACB2FF',
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginHorizontal: 5,
  },
  showAllChartBox: {
    width: '90%',
    marginVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lineChartBox: {
    width: '49%',
    backgroundColor: '#1A1C2E',
    marginVertical: 5,
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
  },
  exclamationPointBox: {
    backgroundColor: '#FCFFA7',
    padding: 10,
    borderRadius: 15,
    width: '85%',
    position: 'absolute',
    top: 150,
  },

  font1: {fontSize: 15, fontWeight: '600'},
  font2: {color: '#FFFFFF', fontSize: 15, fontWeight: '500', marginVertical: 3},
  font3: {color: '#BFF2FF', fontSize: 18, fontWeight: '600'},
  font4: {fontSize: 18, fontWeight: '500'},
  font5: {color: '#FFFFFF', fontSize: 12},
  font6: {color: '#443F3F', fontSize: 14, fontWeight: '400'},
  font7: {color: '#000000', fontSize: 12, fontWeight: '600'},
  fon8: {
    textAlign: 'center',
    color: '#707064',
    fontSize: 14,
    fontWeight: '600',
  },
  image1: {width: 25, height: 25, resizeMode: 'contain'},
});

export default CQ9AllAccBetScreen;
