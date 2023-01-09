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
  Dimensions,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as common from '../../components/common';
import {MultiSelect} from 'react-native-element-dropdown';
import {BarChart} from 'react-native-gifted-charts';
import {format} from 'date-fns';
import {AxiosContext} from '../../context/axiosContext';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';

interface averageDailyPlayerScreenProps {
  navigation: StackNavigationProp<
    RootStackParamList,
    'AverageDailyPlayerScreen'
  >;
}

const AverageDailyPlayerScreen: React.FC<averageDailyPlayerScreenProps> = ({
  navigation,
}) => {
  const data = [
    {label: '整體', value: 'ALL', index: 0},
    {label: 'CNY', value: 'CNY', index: 1},
    {label: 'KRW', value: 'KRW', index: 2},
    {label: 'THB', value: 'THB', index: 3},
    {label: 'VND', value: 'VND', index: 4},
    {label: 'IDR', value: 'IDR', index: 5},
    {label: 'MYR', value: 'MYR', index: 6},
    {label: 'PHP', value: 'PHP', index: 7},
    {label: 'MMK', value: 'MMK', index: 8},
    {label: 'USD', value: 'USD', index: 9},
    {label: 'HKD', value: 'HKD', index: 10},
  ];
  const allCurrency = [
    'ALL',
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
  const axiosContext = useContext(AxiosContext);

  const [selectedCurrency, setSelectedCurrency] = useState<any[]>([]);
  const [showData, setShowData] = useState<Boolean>(false);

  const [latestData, setLatestData] = useState<any[]>([]);
  const [latestAllData, setLatestAllData] = useState<any[]>([]);
  const fetchLatest = useCallback(async () => {
    try {
      const {utcPreMonthStr, utcNowMonthStr} = common.getSixMonthDate(6);

      const [resp1] = await Promise.all([
        await axiosContext.authCq9Axios.get(
          //是一個api可以要到三種幣別(全部要到自己分)或是一個一個要
          '/api/v1/inquiry/currency/month/avg/player',
          {
            params: {
              from_time: utcPreMonthStr,
              to_time: utcNowMonthStr,
            },
          },
        ),
      ]);
      if (typeof resp1.data !== 'object') {
        console.error('Fetch currency nothing');
      }
      console.log('Loading latest currency performane success');
      setLatestAllData(resp1.data);
      // console.log(resp1.data);
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, [axiosContext.authCq9Axios]);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  const currencyClassify = (dataBase: any[], currencyArray: any[]) => {
    const data1: any[] = [];
    const data2: any[] = [];
    const data3: any[] = [];
    const digitsNum: number = 1000;

    for (var i = 0; i < dataBase.length; i++) {
      const month = Number(format(new Date(dataBase[i].date), 'MM')).toString();

      if (dataBase[i].currency === currencyArray[0]) {
        const playerStr = common.thousandths(dataBase[i].avg_player);
        data1.push({
          value: dataBase[i].avg_player / digitsNum,
          label: month,
          labelComponent: () => (
            <Text style={styles.barLableText}>{month}月</Text>
          ),
          topLabelComponent: () => (
            <Text style={styles.barChartText}>{playerStr}</Text>
          ),
        });
      } else if (dataBase[i].currency === currencyArray[1]) {
        const playerStr = common.thousandths(dataBase[i].avg_player);

        data2.push({
          value: dataBase[i].avg_player / digitsNum,
          label: month,
          labelComponent: () => (
            <Text style={styles.barLableText}>{month}月</Text>
          ),
          topLabelComponent: () => (
            <Text style={styles.barChartText}>{playerStr}</Text>
          ),
        });
      } else if (dataBase[i].currency === currencyArray[2]) {
        const playerStr = common.thousandths(dataBase[i].avg_player);

        data3.push({
          value: dataBase[i].avg_player / digitsNum,
          label: month,
          labelComponent: () => (
            <Text style={styles.barLableText}>{month}月</Text>
          ),
          topLabelComponent: () => (
            <Text style={styles.barChartText}>{playerStr}</Text>
          ),
        });
      }
    }

    if (currencyArray.length === 3) {
      setLatestData([
        {
          database: data1,
          currency: currencyArray[0],
          color: common.currencyColor(currencyArray[0]),
        },
        {
          database: data2,
          currency: currencyArray[1],
          color: common.currencyColor(currencyArray[1]),
        },
        {
          database: data3,
          currency: currencyArray[2],
          color: common.currencyColor(currencyArray[2]),
        },
      ]);
    } else if (currencyArray.length === 2) {
      setLatestData([
        {
          database: data1,
          currency: currencyArray[0],
          color: common.currencyColor(currencyArray[0]),
        },
        {
          database: data2,
          currency: currencyArray[1],
          color: common.currencyColor(currencyArray[1]),
        },
      ]);
    } else {
      setLatestData([
        {
          database: data1,
          currency: currencyArray[0],
          color: common.currencyColor(currencyArray[0]),
        },
      ]);
    }
  };

  const createBarChart = (barData: any) => {
    return barData.map((obj: any, index: number) => {
      return barChart(obj, index);
    });
  };

  const barChart = (obj: any, index: number) => {
    return (
      <View
        style={{
          alignItems: 'center',
          marginBottom: 20,
          borderBottomColor: '#FFFFFF86',
          borderBottomWidth: 3,
          paddingBottom: 20,
        }}
        key={index}>
        <Text style={{color: obj.color, fontSize: 20, fontWeight: '800'}}>
          {obj.currency}
        </Text>
        <View>
          <BarChart
            width={Dimensions.get('window').width - 100}
            data={obj.database}
            initialSpacing={13}
            barWidth={20}
            barBorderRadius={3}
            disablePress={true}
            spacing={30}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules={true}
            yAxisLabelSuffix={'千'}
            frontColor={obj.color}
            yAxisTextStyle={{
              color: '#ACB2FFCC',
              fontSize: 12,
              fontWeight: '600',
            }}
            yAxisLabelWidth={38}
            hideOrigin={true}
          />
        </View>
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
            <Text style={styles.promptText}>日均人數概況</Text>
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
        <View style={styles.contentSet}>
          <ScrollView>
            <View style={styles.contentBox}>
              <View style={{marginBottom: 15}}>
                <View style={styles.titleBox}>
                  <Text style={styles.titleText}>日均人數</Text>
                </View>
                <View>
                  <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    containerStyle={styles.containerStyle}
                    activeColor={'#ACB2FF'}
                    maxSelect={3}
                    data={data}
                    inside={true}
                    labelField="label"
                    valueField="value"
                    placeholder="至多只可選三個幣別"
                    value={selectedCurrency}
                    onChange={item => {
                      if (item.length >= 3 && selectedCurrency.length >= 3) {
                        Alert.alert('選項勿超過三個！');
                      }
                      setSelectedCurrency(item);
                    }}
                    alwaysRenderItemSelected={true}
                    selectedStyle={styles.selectedStyle}
                  />
                </View>
                <View>
                  <Pressable
                    style={styles.sendButton}
                    onPress={() => {
                      if (selectedCurrency.length <= 0) {
                        Alert.alert('沒有選擇項目');
                        return;
                      }
                      const result = allCurrency.filter(e => {
                        return selectedCurrency.indexOf(e) > -1;
                      });
                      // fetchLatest(selectedCurrency);
                      currencyClassify(latestAllData, result);
                      setShowData(true);
                      setSelectedCurrency([]);
                    }}>
                    <Text style={styles.titleText}>確認送出</Text>
                  </Pressable>
                </View>
              </View>

              <View style={{display: showData ? 'flex' : 'none'}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <View style={styles.horizontalStyle} />
                  <View style={styles.triangleStyle} />
                  <View style={{position: 'absolute', right: 5, bottom: -5}}>
                    <Text style={{color: '#FFFFFF95', fontSize: 12}}>
                      不重覆玩家
                    </Text>
                  </View>
                </View>

                <View>{createBarChart(latestData)}</View>
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
  contentBox: {
    paddingVertical: 10,
    paddingHorizontal: '5%',
    backgroundColor: '#1A1C2E',
    borderRadius: 10,
  },
  titleBox: {
    backgroundColor: '#515369',
    paddingVertical: 3,
    borderRadius: 20,
    alignItems: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#636DEA',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  dropdown: {
    borderColor: '#ACB2FF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  containerStyle: {
    backgroundColor: '#1A1C2E',
    borderColor: '#ACB2FF',
    padding: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF63',
    textAlign: 'center',
  },
  selectedStyle: {
    borderRadius: 12,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#FFFFFF',
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
  barChartText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    width: 60,
    height: 20,
    padding: 1,
    lineHeight: 20,
    textAlign: 'center',
  },
  barLableText: {
    color: '#FFFFFF',
    fontSize: 12,
    width: 35,
    height: 20,
    textAlign: 'center',
  },
  yAxisLabel: {
    color: '#FFFFFF',
  },
});

export default AverageDailyPlayerScreen;
