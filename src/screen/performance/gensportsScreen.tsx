import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import BackButton from '../../components/backButton';
import * as common from '../../components/common';
import {AxiosContext} from '../../context/axiosContext';
import {getUTCLatestDateRange} from '../../core/util';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';

interface gensportsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'GensportsScreen'>;
  route: RouteProp<RootStackParamList, 'GensportsScreen'>;
}

const GensportsScreen: React.FC<gensportsScreenProps> = ({
  route,
  navigation,
}) => {
  const axiosContext = useContext(AxiosContext);
  const keyProps: any = route.params.keyProps || ' ';

  const agentArray = ['all', 'cq9', '168', 'champ'];
  const presetLaterDataArray = common.presetDataArray(agentArray);
  const [latestTableData, setLatestTableData] = useState<any[]>([]);
  const [latesLineData, setLatesLineData] =
    useState<any[]>(presetLaterDataArray);

  const fetchLatest = useCallback(async () => {
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
      setLatestTableData([resp1.data[0], resp2.data[0], resp3.data[0]]);
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, []);

  const fetchLatest30Day = useCallback(async () => {
    try {
      const {utcNowDateStr, utcPreDateStr} = getUTCLatestDateRange(30);
      const [resp1, resp2, resp3] = await Promise.all([
        await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/sales/specify/project/date',
          {
            params: {
              from_date: utcPreDateStr,
              to_date: utcNowDateStr,
              by_brand: 'cq9',
              by_project: 'GenSports',
            },
          },
        ),
        await axiosContext.authChamplandAxios.get(
          '/api/v1/inquiry/sales/specify/project/date',
          {
            params: {
              from_date: utcPreDateStr,
              to_date: utcNowDateStr,
              by_brand: 'champland',
              by_project: 'GenSports',
            },
          },
        ),
        await axiosContext.authKimbabaAxios.get(
          '/api/v1/inquiry/sales/specify/project/date',
          {
            params: {
              from_date: utcPreDateStr,
              to_date: utcNowDateStr,
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
      const allData = common.overallTrend([resp1.data, resp2.data, resp3.data]);
      classificationDatabase([
        [allData, 'all'],
        [resp1.data, 'cq9'],
        [resp2.data, '168'],
        [resp3.data, 'champ'],
      ]);
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
    fetchLatest30Day();
  }, [fetchLatest, fetchLatest30Day]);

  const classificationDatabase = (data: any) => {
    const allagentData: any = latesLineData;

    for (var i = 0; i < data.length; i++) {
      const index = agentArray.indexOf(data[i][1]);
      if (index >= 0) {
        allagentData[index].bet = [];
        allagentData[index].player = [];
        allagentData[index].date = [];
        allagentData[index].betTot = 0;
        allagentData[index].playerTot = 0;
        for (var a = 0; a < data[i][0].length; a++) {
          allagentData[index].bet.unshift(data[i][0][a].bet);
          allagentData[index].player.unshift(data[i][0][a].player);
          allagentData[index].date.unshift(
            common.dateFormat(data[i][0][a].date),
          );
          allagentData[index].betTot += data[i][0][a].bet;
          allagentData[index].playerTot += data[i][0][a].player;
        }
      }
    }

    for (var o = 0; o < allagentData.length; o++) {
      if (allagentData[o].betTot > 0) {
        allagentData[o].average_bet =
          allagentData[o].betTot / allagentData[o].date.length;
      } else {
        allagentData[o].average_bet = 0;
      }

      if (allagentData[o].playerTot > 0) {
        allagentData[o].average_player =
          allagentData[o].playerTot / allagentData[o].date.length;
      } else {
        allagentData[o].average_player = 0;
      }
    }
    setLatesLineData(allagentData);
  };

  const createTopBox = () => {
    return (
      <View style={styles.todayDataBox}>
        <View style={styles.todayDataBoxDate}>
          <Text style={styles.font6}>{common.dateFormat(keyProps.date)}</Text>
          <Text style={styles.font7}>當日業績</Text>
        </View>
        <View style={styles.todayDataBoxDatabase}>
          <View style={styles.contentTextSet}>
            <Text style={styles.font8}>總碼量</Text>
            <Text style={styles.font9}>{common.thousandths(keyProps.bet)}</Text>
          </View>
          <View style={styles.contentTextSet}>
            <Text style={styles.font8}>總人數</Text>
            <Text style={styles.font10}>
              {common.thousandths(keyProps.player)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const createTableBox = (data: any) => {
    return data.map((obj: any, index: number) => {
      return (
        <View key={obj.brand + '_table'}>
          <View style={styles.tableBox}>
            <Text style={styles.font1}>
              {common.convertAgentName(obj.brand)}
            </Text>
          </View>
          <View style={styles.tableRowBigBox}>
            <View style={styles.tableRowBox}>
              <Text style={styles.font2}>總碼量</Text>
              <Text style={styles.font3}>{common.thousandths(obj.bet)}</Text>
            </View>
            <View style={styles.thinFrame} />
            <View style={styles.tableContent}>
              <Text style={styles.font2}>總人數(不重複)</Text>
              <Text style={styles.font4}>{obj.player}</Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const createBarChartBox = (data: any) => {
    return data.map((obj: any, index: number) => {
      return (
        <View key={obj.name + '_lineChart'} style={styles.lineChartBox}>
          <Pressable
            onPress={() => {
              obj.dispalyShow = !obj.dispalyShow;
            }}
            style={styles.lineChartBarBox}>
            <View style={styles.tableRowBigBox}>
              <Image
                source={require('../../../res/gameType/gensports_bar.png')}
                style={styles.imageSize}
              />
              <Text style={styles.font5}>{obj.name}</Text>
            </View>
            <Image
              source={require('../../../res/arrow.png')}
              style={{
                transform: [{rotate: obj.dispalyShow ? '0deg' : '-90deg'}],
              }}
            />
          </Pressable>
          <View
            style={{display: obj.dispalyShow ? 'flex' : 'none', marginTop: 15}}>
            <Text style={styles.lineChartTextPos}>換算幣別：CNY</Text>
            <View style={{padding: '5%'}}>
              <View>
                <Text style={styles.font3}>總碼量</Text>
                {common.chartsProps(
                  obj.date,
                  obj.bet,
                  obj.average_bet,
                  '#BFF2FF',
                  '總碼量',
                  true,
                )}
              </View>
              <View style={{height: 3, backgroundColor: '#FFFFFF41'}} />
              <View>
                <Text style={styles.font4}>總人數</Text>
                {common.chartsProps(
                  obj.date,
                  obj.player,
                  obj.average_player,
                  '#FFEFBF',
                  '總人數',
                  true,
                )}
              </View>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          <View style={{width: '100%'}}>
            <BackButton
              title={'gensports'}
              onPress={() => navigation.pop()}
              bgcolor={'#42445A'}
            />
          </View>
        </View>
        {LogoutTimer()}
        <View style={{flex: 8, width: '100%'}}>
          <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            {createTopBox()}
            <View style={styles.tableBigBox}>
              <Text style={styles.font11}>當日</Text>
              {createTableBox(latestTableData)}
              <Text style={styles.font12}>
                *數字可能有變動 將依實際派彩時間為主*
              </Text>
            </View>
            <View style={styles.allContentBox}>
              <View style={styles.horizontalStyle}>
                <Text style={styles.font5}>近30天走勢圖</Text>
              </View>
              <View style={styles.triangleStyle} />
            </View>
            <View style={styles.allContentBox}>
              {createBarChartBox(latesLineData)}
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
  imageSize: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  horizontalStyle: {
    backgroundColor: '#242740',
    width: '90%',
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  triangleStyle: {
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderTopColor: '#242740',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
  },
  tableBigBox: {
    backgroundColor: '#1A1C2E',
    width: '90%',
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
  },
  tableBox: {
    backgroundColor: '#515369',
    marginVertical: 3,
    borderRadius: 15,
    padding: 5,
  },
  tableRowBigBox: {flexDirection: 'row', alignItems: 'center'},
  tableRowBox: {
    flexDirection: 'row',
    width: '49.8%',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  thinFrame: {
    width: '0.4%',
    backgroundColor: '#D5D5D54F',
    height: '60%',
  },
  tableContent: {
    flexDirection: 'row',
    width: '49.8%',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  lineChartBox: {
    backgroundColor: '#1A1C2E',
    borderRadius: 15,
    marginBottom: 10,
    width: '90%',
  },
  lineChartBarBox: {
    backgroundColor: '#42445A',
    borderRadius: 15,
    flexDirection: 'row',
    padding: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineChartTextPos: {
    position: 'absolute',
    top: -10,
    right: 5,
    color: '#FFFFFF',
    fontSize: 12,
  },
  allContentBox: {width: '100%', alignItems: 'center'},
  font1: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
  font2: {color: '#D4D4D4', fontSize: 10},
  font3: {color: '#BFF2FF', fontSize: 15},
  font4: {color: '#FFEFBF', fontSize: 15},
  font5: {color: '#FFFFFF', fontSize: 20},
  font6: {color: '#FFFFFF', fontSize: 28, fontWeight: '500'},
  font7: {color: '#FFFFFF', fontWeight: '400', fontSize: 16},
  font8: {color: '#FFFFFF', fontSize: 15},
  font9: {color: '#BFF2FF', fontSize: 20, fontWeight: '500'},
  font10: {color: '#FFEFBF', fontSize: 20, fontWeight: '500'},
  font11: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  font12: {
    color: '#FF0000',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
});

export default GensportsScreen;
