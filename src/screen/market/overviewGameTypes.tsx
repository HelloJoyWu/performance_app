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
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as common from '../../components/common';
import {PieChart} from 'react-native-gifted-charts';
import {AxiosContext} from '../../context/axiosContext';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';

interface overviewGameTypesScreenProps {
  navigation: StackNavigationProp<
    RootStackParamList,
    'OverviewGameTypesScreen'
  >;
}

const OverviewGameTypes: React.FC<overviewGameTypesScreenProps> = ({
  navigation,
}) => {
  const [displayArray, setDisplayArray] = useState<Boolean[]>([]);
  const axiosContext = useContext(AxiosContext);
  const ref = React.useRef<any>(null);

  const [latestData, setLatestData] = useState<any[]>([]);
  const fetchLatest = useCallback(async () => {
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
    const currencyClassify = (data: any) => {
      const dataRank = tableDataRank(data);
      const currencyData: any[] = [];
      const displayArrat: boolean[] = [];
      const allBet: number[] = [];

      for (var a = 0; a < allCurrency.length; a++) {
        currencyData.push({
          currency: allCurrency[a],
          bet: [],
        });
        displayArrat.push(false);
        allBet.push(0);
      }

      for (var n = 0; n < dataRank.length; n++) {
        const index = allCurrency.indexOf(dataRank[n].currency);
        allBet[index] += dataRank[n].bets;
      }

      for (var i = 0; i < dataRank.length; i++) {
        const index = allCurrency.indexOf(dataRank[i].currency);
        var betPro = 0;
        if (allBet[index] !== 0) {
          betPro = (dataRank[i].bets / allBet[index]) * 100;
        }

        const betNum = Number(betPro.toFixed(2));
        var textStr = '';
        var shiftTextYNum = 0;
        if (betNum > 1) {
          textStr = betNum + '%';
          shiftTextYNum = -9 * currencyData[index].bet.length;
        }

        currencyData[index].bet.push({
          value: betNum,
          label: dataRank[i].gametype,
          text: textStr,
          color: gameConvertToColor(dataRank[i].gametype),
          shiftTextX: -10,
          shiftTextY: shiftTextYNum,
          bet: dataRank[i].bets,
        });
      }

      setLatestData(currencyData);
      setDisplayArray(displayArrat);
    };

    try {
      const [resp1] = await Promise.all([
        await axiosContext.authCq9Axios.get(
          //是一個api可以要到三種幣別(全部要到自己分)或是一個一個要
          // `/api/v1/inquiry/sales/performance/gametype/latest`,
          '/api/v1/inquiry/currency/premonth/gametype/bet',
        ),
      ]);
      if (typeof resp1.data !== 'object') {
        console.error('Fetch currency nothing');
      }
      console.log('Loading latest currency performane success');
      currencyClassify(resp1.data);
      // console.log(resp1.data);
    } catch (error: any) {
      const alertMsg = error.response.config.baseURL
        ? `${error.response.data.message} under host ${error.response.config.baseURL}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, [axiosContext.authCq9Axios]);

  useEffect(() => {
    console.log('Loading champ latest currency performane');
    fetchLatest();
  }, [fetchLatest]);

  const tableDataRank = (data: any[]) => {
    data = data.sort(function (a, b) {
      return a.bets < b.bets ? 1 : -1;
    });
    return data;
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

  const gameConvertToColor = (name: string) => {
    if (name === 'slot') {
      return '#F8AB02';
    } else if (name === 'arcade') {
      return '#FF7F83';
    } else if (name === 'fish') {
      return '#61DBF1';
    } else if (name === 'sport') {
      return '#FFACFF';
    } else if (name === 'table') {
      return '#B1D398';
    } else if (name === 'live') {
      return '#92A7FF';
    } else {
      return '#FFFFFF';
    }
  };

  const createBetDount = (data: any) => {
    const dountRadius = 100;
    return (
      <View style={{alignSelf: 'center', width: dountRadius * 2, margin: 10}}>
        <PieChart
          data={data}
          textColor="#42445A"
          fontWeight="600"
          radius={dountRadius}
          textSize={12}
          showText
        />
      </View>
    );
  };

  const createTable = (data: any) => {
    return data.map((obj: any, index: number) => {
      return (
        <View
          key={obj.label + index + '1'}
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            paddingVertical: 10,
            borderBottomColor: '#707070',
            borderBottomWidth: 1,
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '30%'}}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: gameConvertToColor(obj.label),
              }}
            />
            <Text style={{color: '#FFFFFF'}}>
              {common.convertGameTypeName(obj.label)}
            </Text>
          </View>
          <Text style={{color: '#FFFFFF', width: '30%', textAlign: 'right'}}>
            {obj.value}%
          </Text>
          <Text style={{color: '#FFFFFF', width: '40%', textAlign: 'right'}}>
            {common.thousandths(obj.bet)}
          </Text>
        </View>
      );
    });
  };

  const createBarContent = (data: any) => {
    return (
      <View key={data.currency + '_allBar'}>
        {createBetDount(data.bet)}
        {createTable(data.bet)}
      </View>
    );
  };

  const createBar = (data: any) => {
    return data.map((obj: any, index: number) => {
      if (obj.bet.length <= 0) {
        return null;
      }
      return (
        <View
          key={obj.currency + index}
          style={{
            backgroundColor: '#1A1C2E',
            width: '100%',
            marginVertical: 10,
            borderRadius: 10,
          }}>
          <Pressable
            onPress={() => {
              displayArray[index] = !displayArray[index];
            }}
            style={{
              backgroundColor: '#42445A',
              flexDirection: 'row',
              borderRadius: 10,
              height: 55,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {currencyImage(obj.currency)}
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 18,
                  fontWeight: '500',
                  marginLeft: 10,
                }}>
                {obj.currency}
              </Text>
            </View>
            <Image
              source={require('../../../res/arrow.png')}
              style={{
                transform: [{rotate: displayArray[index] ? '0deg' : '-90deg'}],
              }}
            />
          </Pressable>
          <View style={{display: displayArray[index] ? 'flex' : 'none'}}>
            {createBarContent(obj)}
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
        <View style={{backgroundColor: '#42445A'}}>
          <View style={{marginTop: 10, marginBottom: 10}}>
            <Text style={styles.promptText}>遊戲種類概況</Text>
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
          <ScrollView ref={ref}>{createBar(latestData)}</ScrollView>
        </View>
        <Pressable
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}
          onPress={() => {
            for (var i = 0; i < displayArray.length; i++) {
              displayArray[i] = false;
            }
            ref.current.scrollTo({x: 0, y: 0, animated: true});
          }}>
          <Image
            source={require('../../../res/btn_Top.png')}
            style={{width: 35, height: 35}}
          />
        </Pressable>
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
  imageSize: {
    width: 40,
    height: 40,
  },
});

export default OverviewGameTypes;
