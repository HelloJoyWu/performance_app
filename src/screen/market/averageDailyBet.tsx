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
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as common from '../../components/common';
import {MultiSelect} from 'react-native-element-dropdown';
import {LineChart} from 'react-native-gifted-charts';
import {format} from 'date-fns';
import {AxiosContext} from '../../context/axiosContext';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';

interface averageDailyBetScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'AverageDailyBetScreen'>;
}

const AverageDailyBetScreen: React.FC<averageDailyBetScreenProps> = ({
  navigation,
}) => {
  //這邊要問Peter是固定還是會有資料
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

  const [allDateArray, setAllDateArray] = useState<string[]>([]);
  const axiosContext = useContext(AxiosContext);

  const [latestAllData, setLatesAllData] = useState<any[]>([]);
  const [latestChartData, setLatestChartData] = useState<any[]>([]);

  const [selected, setSelected] = useState<any[]>([]);
  const [showData, setShowData] = useState<Boolean>(false);

  const [buttonIndex, setButtonIndex] = useState<number>(0);

  const fetchLatest = useCallback(async () => {
    try {
      const {utcPreMonthStr, utcNowMonthStr} = common.getSixMonthDate(6);

      const [resp1] = await Promise.all([
        await axiosContext.authCq9Axios.get(
          //是一個api可以要到三種幣別(全部要到自己分)或是一個一個要
          '/api/v1/inquiry/currency/month/avg/bet',
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
      setLatesAllData(resp1.data);
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

  const createLineChart = (lineData: any) => {
    if (!lineData || lineData.length <= 0) {
      return null;
    }
    return (
      <View>
        <LineChart
          data={lineData[0].database}
          data2={lineData[1].database}
          data3={lineData[2].database}
          color1={lineData[0].color}
          color2={lineData[1].color}
          color3={lineData[2].color}
          dataPointsColor2={lineData[1].color}
          dataPointsColor1={lineData[0].color}
          dataPointsColor3={lineData[2].color}
          width={Dimensions.get('window').width - 50}
          hideRules={true}
          initialSpacing={10}
          yAxisLabelWidth={45}
          spacing={50}
          noOfSections={4}
          disableScroll={true}
          yAxisTextStyle={{color: '#ACB2FF', fontSize: 11}}
          xAxisColor="#41414100"
          yAxisColor="#41414100"
          yAxisLabelSuffix={'百萬'}
          roundToDigits={0}
          thickness={2}
          pressEnabled={true}
          showStripOnPress={true}
          showTextOnPress={true}
          onPress={(item: any, index: any) => {
            setButtonIndex(index);
          }}
          stripHeight={500}
          stripWidth={2}
          stripColor={'#C0C0C08B'}
          unFocusOnPressOut={true}
          focusedDataPointRadius={5}
        />
      </View>
    );
  };

  const currencyClassify = (dataBase: any, currencyArray: any[]) => {
    const data1: any[] = [];
    const data2: any[] = [];
    const data3: any[] = [];
    const data1Value: number[] = [];
    const data2Value: number[] = [];
    const data3Value: number[] = [];

    const dateArray: string[] = [];
    const digitsNum: number = 1000000;

    for (var i = 0; i < dataBase.length; i++) {
      const month = Number(format(new Date(dataBase[i].date), 'MM')).toString();
      if (dataBase[i].currency === currencyArray[0]) {
        dateArray.push(month);
        data1Value.push(dataBase[i].avg_bet);
        data1.push({
          value: dataBase[i].avg_bet / digitsNum,
          label: month,
          labelComponent: () => (
            <Text style={{color: '#FFFFFF', fontSize: 10, paddingLeft: 15}}>
              {month}月
            </Text>
          ),
        });
      } else if (dataBase[i].currency === currencyArray[1]) {
        data2Value.push(dataBase[i].avg_bet);
        data2.push({
          value: dataBase[i].avg_bet / digitsNum,
          label: month,
        });
      } else if (dataBase[i].currency === currencyArray[2]) {
        data3Value.push(dataBase[i].avg_bet);
        data3.push({
          value: dataBase[i].avg_bet / digitsNum,
          label: month,
        });
      }
    }

    if (currencyArray.length === 3) {
      setLatestChartData([
        {
          database: data1,
          dataValue: data1Value,
          currency: currencyArray[0],
          color: common.currencyColor(currencyArray[0]),
        },
        {
          database: data2,
          dataValue: data2Value,
          currency: currencyArray[1],
          color: common.currencyColor(currencyArray[1]),
        },
        {
          database: data3,
          dataValue: data3Value,
          currency: currencyArray[2],
          color: common.currencyColor(currencyArray[2]),
        },
      ]);
    } else if (currencyArray.length === 2) {
      setLatestChartData([
        {
          database: data1,
          currency: currencyArray[0],
          dataValue: data1Value,
          color: common.currencyColor(currencyArray[0]),
        },
        {
          database: data2,
          currency: currencyArray[1],
          dataValue: data2Value,
          color: common.currencyColor(currencyArray[1]),
        },
        {
          database: [],
          currency: '',
          color: '',
          dataValue: [],
        },
      ]);
    } else {
      setLatestChartData([
        {
          database: data1,
          currency: currencyArray[0],
          dataValue: data1Value,
          color: common.currencyColor(currencyArray[0]),
        },
        {
          database: [],
          currency: '',
          color: '',
          dataValue: [],
        },
        {
          database: [],
          currency: '',
          color: '',
          dataValue: [],
        },
      ]);
    }
    setAllDateArray(dateArray);
  };

  const createTableButton = (tableData: any) => {
    if (tableData.length === 0) {
      return null;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'space-around',
        }}>
        {createButton(tableData)}
      </View>
    );
  };

  const triangle = (array: any) => {
    if (array.length <= 0 || !array) {
      return null;
    }

    return array.map((obj: any, index: number) => {
      return (
        <View
          key={'triangle_' + index}
          style={{
            marginHorizontal: 3,
            paddingHorizontal: 13,
          }}>
          <View
            style={[
              styles.triangleStyle,
              {
                borderRightWidth: 6,
                borderLeftWidth: 6,
                borderTopColor: index === buttonIndex ? '#ACB2FF' : '#FFFFFF00',
              },
            ]}
          />
        </View>
      );
    });
  };

  const createButton = (array: string[]) => {
    if (!array || array.length <= 0) {
      return null;
    }

    return array.map((obj: any, index: number) => {
      return (
        <View
          key={'date_' + index}
          style={{
            marginHorizontal: 3,
            borderRadius: 20,
            backgroundColor: index === buttonIndex ? '#ACB2FF' : '#FFFFFF00',
            paddingHorizontal: 13,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              color: index === buttonIndex ? '#000000' : '#FFFFFF',
              fontSize: 12,
            }}>
            {obj.substr(-2, 2)}月
          </Text>
        </View>
      );
    });
  };

  const createLineLegend = (legendData: any) => {
    return legendData.map((obj: any, index: number) => {
      return (
        <View
          key={obj.currency + index + '_legend'}
          style={{
            flexDirection: 'row',
            marginHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 20,
              backgroundColor: obj.color,
              marginHorizontal: 2,
            }}
          />
          <Text style={{color: '#FFFFFF'}}>{obj.currency}</Text>
        </View>
      );
    });
  };

  const createTabeData = (tabelData: any) => {
    return tabelData.map((obj: any, index: number) => {
      return (
        <View
          key={obj.currency + index}
          style={{
            flexDirection: 'row',
            marginTop: 5,
            display: obj.dataValue[buttonIndex] ? 'flex' : 'none',
          }}>
          <View
            style={{
              width: '10%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: common.currencyColor(obj.currency),
                width: 10,
                height: 10,
                borderRadius: 10,
              }}
            />
          </View>
          <View
            style={{
              marginVertical: 1,
              width: '90%',
              flexDirection: 'row',
              paddingHorizontal: 10,
              paddingVertical: 1,
              justifyContent: 'space-between',
              borderBottomColor: '#707070',
              borderBottomWidth: index === 2 ? 0 : 1,
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 17}}>{obj.currency}</Text>
            <Text style={{color: '#FFFFFF', fontSize: 17}}>
              {common.thousandths(obj.dataValue[buttonIndex])}
            </Text>
          </View>
        </View>
      );
    });
  };

  const rederItem = (item: any) => {
    return (
      <View>
        <Text style={{color: '#000000'}}>{item.lable}</Text>
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
            <Text style={styles.promptText}>日均碼量概況</Text>
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
                  <Text style={styles.titleText}>日均碼量</Text>
                </View>
                <View>
                  <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    containerStyle={styles.containerStyle}
                    selectedStyle={styles.selectedStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    activeColor={'#8D94F9'}
                    maxSelect={3}
                    data={data}
                    inside={true}
                    labelField="label"
                    valueField="value"
                    placeholder="至多只可選三個幣別"
                    value={selected}
                    onChange={item => {
                      if (item.length >= 3 && selected.length >= 3) {
                        Alert.alert('選項勿超過三個！');
                      }
                      setSelected(item);
                    }}
                    alwaysRenderItemSelected={true}
                    // renderItem={rederItem}
                    // renderSelectedItem={rederItem}
                  />
                </View>
                <View>
                  <Pressable
                    style={styles.sendButton}
                    onPress={() => {
                      if (selected.length <= 0) {
                        Alert.alert('沒有選擇項目');
                        return;
                      }
                      const result = allCurrency.filter(e => {
                        return selected.indexOf(e) > -1;
                      });

                      // fetchLatest(result);
                      currencyClassify(latestAllData, result);
                      setShowData(true);
                      setSelected([]);
                    }}>
                    <Text style={styles.titleText}>確認送出</Text>
                  </Pressable>
                </View>
              </View>

              <View style={{display: showData ? 'flex' : 'none'}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <View style={styles.horizontalStyle} />
                  <View style={styles.triangleStyle} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  {createLineLegend(latestChartData)}
                </View>
                <View>{createLineChart(latestChartData)}</View>
                <View
                  style={{
                    width: '100%',
                    height: 3,
                    backgroundColor: '#FFFFFF71',
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                />

                <View>
                  <View
                    style={[
                      styles.titleBox,
                      {paddingBottom: 0, marginBottom: 5},
                    ]}>
                    <Text style={styles.titleText}>日均碼量數值表</Text>
                    {createTableButton(allDateArray)}
                  </View>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-around',
                    }}>
                    {triangle(allDateArray)}
                  </View> */}
                  {createTabeData(latestChartData)}
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
    // marginLeft: 10,
    // display:
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
});

export default AverageDailyBetScreen;
