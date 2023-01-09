import React, {useState, useCallback, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import BackButton from '../components/backButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import * as common from '../components/common';
import {AxiosContext} from '../context/axiosContext';
import {getUTCLatestDateRange} from '../core/util';

interface kimbabaScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'KimbabaScreen'>;
  route: RouteProp<RootStackParamList, 'KimbabaScreen'>;
}

const KimbabaScreen: React.FC<kimbabaScreenProps> = ({route, navigation}) => {
  const axiosContext = useContext(AxiosContext);
  const keyProps: any = route.params.keyProps || ' ';

  const [chartsDataBase, setChartsDataBase] = useState<any[]>([]);
  const [topTableDataBase, setTopTableDataBase] = useState<any[]>([]);
  const [gameTableDataBase, setGameTableDataBase] = useState<any[]>([]);
  // const lastThirtyDaysArray = common.lastThirtyDays();
  const colorArray = ['#BFF2FF', '#FFCB64', '#FFEFBF', '#F1C6C1', '#7D86FF'];

  const fetchLatest = useCallback(async () => {
    try {
      const {utcNowDateStr, utcPreDateStr} = getUTCLatestDateRange(30);
      const [respChart, respGame, respTop] = await Promise.all([
        await axiosContext.authKimbabaAxios.get(
          // `/api/v1/inquiry/sales/performance/currency/date/${keyProps.brand}`,
          `/api/v1/inquiry/sales/performance/date`,
          {
            params: {
              from_date: utcPreDateStr,
              to_date: utcNowDateStr,
            },
          },
        ),
        await axiosContext.authKimbabaAxios.get(
          `/api/v1/inquiry/sales/performance/gametype/latest/${keyProps.brand}`,
          // `/api/v1/inquiry/sales/performance/gametype/latest/cq9`,
          {
            params: {by_currency: 'TWD'},
          },
        ),
        await axiosContext.authKimbabaAxios.get(
          `/api/v1/inquiry/sales/performance/top/bet/latest/${keyProps.brand}`,
          // `/api/v1/inquiry/sales/performance/top/bet/latest/cq9`,
          {
            params: {by_currency: 'TWD'},
          },
        ),
      ]);
      if (typeof respChart.data != 'object') {
        console.error('Fetch currency nothing');
      }
      console.log('Loading latest currency performane success');
      setchartsDataarrange(respChart.data);
      console.log('Kimbaba chart', respChart.data);
      setTopTableDataBase(common.tableDataSore(respTop.data));
      setGameTableDataBase(common.tableDataSore(respGame.data));
      // console.log('Kimbaba game', respGame.data);
      // console.log('Kimbaba agent', respTop.data);
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, []);

  useEffect(() => {
    console.log('Loading latest currency performane');
    fetchLatest();
  }, [fetchLatest]);

  const setchartsDataarrange = (data: []) => {
    const allDataBase = common.chartsDataarrange(data, true);
    setChartsDataBase(allDataBase);
  };

  const createCharts = (database: any) => {
    if (database.length === 0) {
      return null;
    }

    return database.map((obj: any, index: number) => {
      const showColor: string = colorArray[index];
      const typeName: string = common.convertName(obj.name);

      return (
        <View style={styles.boxborderBottom} key={obj.name}>
          <View>
            <Text
              style={{
                color: showColor,
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 5,
              }}>
              {common.convertName(obj.name)}
            </Text>
          </View>
          <View>
            {common.chartsProps(
              obj,
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

  const createTableBox = (database: any, quantity: number) => {
    if (database.length < quantity) {
      for (var i = 0; i < quantity; i++) {
        if (!database[i]) {
          database.push({name: '-'});
        }
      }
    }

    return database.map((obj: any, index: number) => {
      const name = obj.name
        ? obj.name
        : common.convertGameTypeName(obj.gametype);
      return (
        <View key={obj + index}>
          <View
            style={{
              borderRadius: 20,
              backgroundColor: '#646464',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
            }}>
            <Text style={styles.tableTitleText}>
              {index + 1}. {name}
            </Text>
            <Text style={styles.tableTitleText}>
              {common.thousandths(obj.bet) === '0'
                ? '-'
                : common.thousandths(obj.bet)}{' '}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              alignItems: 'flex-end',
            }}>
            <View style={styles.tableNumTextBox}>
              <Text style={{color: '#FFFFFF', opacity: 0.6, fontSize: 12}}>
                前日差
              </Text>
              <Text
                style={[
                  {color: common.tableDataTextColor(obj.bet_day_diff)},
                  styles.tableNumText,
                ]}>
                {common.symbolFormat(
                  common.thousandths(obj.bet_day_diff),
                  obj.bet_day_diff,
                )}
              </Text>
            </View>
            <View style={styles.tableNumTextBox}>
              <Text style={{color: '#FFFFFF', opacity: 0.6, fontSize: 12}}>
                上月日均差
              </Text>
              <Text
                style={[
                  {color: common.tableDataTextColor(obj.bet_month_avg_diff)},
                  styles.tableNumText,
                ]}>
                {common.symbolFormat(
                  common.thousandths(obj.bet_month_avg_diff),
                  obj.bet_month_avg_diff,
                )}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          <View style={{width: '100%'}}>
            <BackButton
              title={'kimbaba'}
              onPress={() => navigation.pop()}
              bgcolor={'#FFC10B'}
              name={keyProps.userName}
            />
          </View>
        </View>
        {common.LogoutTimerView()}

        <View style={styles.todayDataBox}>
          <View style={styles.todayDataBoxDate}>
            <Text style={{color: '#FFFFFF', fontSize: 28, fontWeight: '500'}}>
              {common.dateFormat(keyProps.date)}
            </Text>
            <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: '400'}}>
              當日業績
            </Text>
          </View>
          <View style={styles.todayDataBoxDatabase}>
            <View style={styles.contentTextSet}>
              <Text style={{color: '#FFFFFF', fontSize: 15}}>點數碼量</Text>
              <Text style={{color: '#BFF2FF', fontSize: 20, fontWeight: '500'}}>
                {common.thousandths(keyProps.bet * 130)}
              </Text>
            </View>
            <View style={styles.contentTextSet}>
              <Text style={{color: '#FFFFFF', fontSize: 15}}>實際碼量</Text>
              <Text style={{color: '#FFCB64', fontSize: 20, fontWeight: '500'}}>
                {common.thousandths(keyProps.bet)}
              </Text>
            </View>
            <View style={styles.contentTextSet}>
              <Text style={{color: '#FFFFFF', fontSize: 15}}>總人數</Text>
              <Text style={{color: '#FFEFBF', fontSize: 20, fontWeight: '500'}}>
                {common.thousandths(keyProps.player)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{flex: 8, width: '100%', marginTop: 15}}>
          <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#313131',
                borderRadius: 15,
                marginVertical: 5,
                width: '90%',
              }}>
              <View
                style={{
                  backgroundColor: '#686868',
                  borderRadius: 15,
                  padding: 15,
                  alignItems: 'center',
                }}>
                <Text style={{color: '#FFFFFF', fontSize: 18}}>
                  近30天走勢圖
                </Text>
              </View>
              <View>
                <View
                  style={{
                    height: 50,
                    alignItems: 'flex-end',
                    padding: 10,
                  }}>
                  <Text style={{color: '#FFFFFF', fontSize: 14}}>
                    幣別：CNY
                  </Text>
                </View>
                {createCharts(chartsDataBase)}
                <View style={styles.boxborderBottom}>
                  <Text style={styles.tableBigTitleText}>Top 5 包網商碼量</Text>
                  {createTableBox(topTableDataBase, 5)}
                </View>
                <View style={{margin: 10}}>
                  <Text style={styles.tableBigTitleText}>遊戲種類碼量</Text>
                  {createTableBox(gameTableDataBase, gameTableDataBase.length)}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC10B',
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
    margin: 3,
  },
  titleBox: {
    flex: 1.4,
    flexDirection: 'row',
  },
  todayDataBox: {
    flexDirection: 'row',
    backgroundColor: '#474747',
    borderRadius: 15,
    padding: 10,
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
    borderLeftColor: '#FFFFFF',
    borderLeftWidth: 1,
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tableBigTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    marginBottom: 10,
  },
  tableTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  tableNumTextBox: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
  },
  tableNumText: {
    paddingRight: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  boxborderBottom: {
    padding: 10,
    borderColor: '#FFFFFF48',
    borderBottomWidth: 4,
    margin: 10,
  },
});
export default KimbabaScreen;
