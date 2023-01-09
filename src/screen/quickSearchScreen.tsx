import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as common from '../components/common';
import {AxiosContext} from '../context/axiosContext';
import * as StorageHelper from '../helpers/storageHelper';
import {loadView} from '../components/loadImage';
import {LogoutTimer, ExtensionTime} from '../components/logoutTimer';

interface quickSearchScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'QuickSearchScreen'>;
}

const QuickSearchScreen: React.FC<quickSearchScreenProps> = ({navigation}) => {
  const axiosContext = useContext(AxiosContext);

  const [latestData, setLatestData] = useState<any[]>([]);
  const [latestDetails, setLatestDetails] = useState<any[]>([]);
  const [currencyBtnDisabled, setCurrencyBtnDisabled] = useState<boolean[]>([]);
  const [contentDisplay, setContentDisplay] = useState<boolean>(false);
  const [loadingDisplay, setLoadingDisplay] = useState<boolean>(false);

  const [ownerArray, setOwnerArray] = useState<any[]>();
  const [selectedOwner, setSelectedOwner] = useState<any>();
  const [oid, setOid] = useState<number>();

  const fetchLatest = useCallback(
    async (selectOid: number) => {
      try {
        const resp1 = await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/agent/owner/top/currency',
          {
            params: {
              owner_id: selectOid,
            },
          },
        );
        if (typeof resp1.data !== 'object') {
          console.error('Fetch currency nothing');
        }
        console.log('Loading latest currency performane success');
        console.log(resp1.data);
        setOid(selectOid);
        currencyClassify(resp1.data);
        setContentDisplay(true);
        setLoadingDisplay(false);
      } catch (error: any) {
        const alertMsg = error.response.config.url
          ? `[${error.response.status}] ${error.response.data.message}`
          : `${error}`;
        console.error('Fetch latest currency failed', alertMsg);
      }
    },
    [axiosContext.authCq9Axios],
  );

  const fetchCurrencyData = useCallback(
    async (currencyString: string, storeOid: any, currencyIndex: number) => {
      const convertArray = (objdata: {}) => {
        let result = Object.entries(objdata).sort(
          (a: any, b: any) => a[1].bet - b[1].bet,
        );
        // console.log(result);

        return result.reverse();
      };

      try {
        const resp1 = await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/agent/currency/gametype/summary',
          {
            params: {
              agent_type: 'owner',
              agent_id: storeOid,
              currency: currencyString,
            },
          },
        );
        if (typeof resp1.data !== 'object') {
          console.error('Fetch currency nothing');
        }
        console.log('Loading latest currency performane success');
        console.log(currencyString, resp1.data);
        const index = latestData.findIndex(x => x.currency === currencyString);
        const newLastDetails = latestDetails;
        newLastDetails[index] = convertArray(resp1.data);
        const newArray = currencyBtnDisabled;
        newArray[currencyIndex] = false;
        setCurrencyBtnDisabled(newArray);
        setLatestDetails(newLastDetails);
      } catch (error: any) {
        const alertMsg = error.response.config.url
          ? `[${error.response.status}] ${error.response.data.message}`
          : `${error}`;
        console.error('Fetch latest currency failed', alertMsg);
      }
    },
    [axiosContext.authCq9Axios, latestData, latestDetails, currencyBtnDisabled],
  );

  const getStorageItem = async () => {
    const owner_list = await StorageHelper.getOwnerList('ownerList');
    setOwnerArray(owner_list);
  };

  useEffect(() => {
    console.log('Loading champ latest currency performane');
    getStorageItem();
  }, []);

  const currencyClassify = (data: any[]) => {
    if (data.length <= 0) {
      setLatestData([]);
      return;
    }
    const allCurrencyData: any[] = [];
    const allCurrencyDetails: any[] = [];
    const allCurrencyBtn: boolean[] = [];

    for (var i = 0; i < data.length; i++) {
      allCurrencyData.push({
        currency: data[i].currency,
        totBet: data[i].bets,
      });
      allCurrencyDetails.push([]);
      allCurrencyBtn.push(false);
    }

    const allDataRank = allCurrencyData.sort(function (first, second) {
      return first.totBet < second.totBet ? 1 : -1;
    });

    setLatestData(allDataRank);
    setLatestDetails(allCurrencyDetails);
    setCurrencyBtnDisabled(allCurrencyBtn);
  };

  const currencyImage = (name: string) => {
    if (name === 'CNY') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/CNY.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'KRW') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/KRW.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'THB') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/THB.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'VND') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/VND.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'IDR') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/IDR.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'PHP') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/PHP.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'HKD') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/HKD.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'USD') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/USD.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'MMK') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/MMK.png')}
            style={styles.imageSize}
          />
        </View>
      );
    } else if (name === 'MYR') {
      return (
        <View style={styles.imageBox}>
          <Image
            source={require('../../res/currency/MYR.png')}
            style={styles.imageSize}
          />
        </View>
      );
    }
  };

  const typeNameLine = (name: string) => {
    var nameArray = common.convertGameTypeName(name).split('');
    return nameArray.map((str: any, index: number) => {
      return (
        <Text style={styles.font5} key={name + '_str_' + index}>
          {str}
        </Text>
      );
    });
  };

  const oneCurrencybox = (data: any[], currency: string) => {
    if (!data || data.length <= 0) {
      return null;
    }

    return data.map((obj: any, index: number) => {
      const average_bet = obj[1].bet / obj[1].players;
      const average_time = parseFloat(
        (obj[1].playtime_sec / 60 / obj[1].players).toFixed(2),
      );

      let rtp = '';
      if (obj[1].bet > 0) {
        rtp =
          parseFloat(((1 - obj[1].net_win / obj[1].bet) * 100).toFixed(2)) +
          '%';
      } else if (obj[1].bet === 0) {
        rtp = '無資料';
      } else {
        rtp = '0%';
      }

      return (
        <View
          key={'top_currency_' + index}
          style={[styles.currencyTable, {borderTopWidth: index === 0 ? 0 : 4}]}>
          <View style={styles.gameTypeName}>{typeNameLine(obj[0])}</View>
          <View style={{width: '90%'}}>
            <View style={styles.gameTypeTable}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.font6}>總碼量</Text>
                <Text
                  style={[
                    styles.font6,
                    {display: currency === 'CNY' ? 'none' : 'flex'},
                  ]}>
                  (CNY)
                </Text>
              </View>
              <Text style={[styles.font7, {color: '#BFF2FF'}]}>
                {common.thousandths(obj[1].bet)}
              </Text>
            </View>
            <View
              style={[
                styles.gameTypeTable,
                {display: currency === 'CNY' ? 'none' : 'flex'},
              ]}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.font6}>總碼量</Text>
                <Text style={styles.font6}>({currency})</Text>
              </View>
              <Text style={[styles.font7, {color: '#BFF2FF'}]}>
                {common.thousandths(common.exchangeRate(currency, obj[1].bet))}
              </Text>
            </View>
            <View style={styles.gameTypeTable}>
              <Text style={styles.font6}>總人數</Text>
              <Text style={[styles.font7, {color: '#FFEFBF'}]}>
                {common.thousandths(obj[1].players)}
              </Text>
            </View>
            <View style={styles.gameTypeTable}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.font6}>人均投注</Text>
                <Text
                  style={[
                    styles.font6,
                    {display: currency === 'CNY' ? 'none' : 'flex'},
                  ]}>
                  (CNY)
                </Text>
              </View>
              <Text style={[styles.font7, {color: '#F1C6C1'}]}>
                {common.thousandths(average_bet)}
              </Text>
            </View>
            <View
              style={[
                styles.gameTypeTable,
                {display: currency === 'CNY' ? 'none' : 'flex'},
              ]}>
              <Text style={styles.font6}>人均投注({currency})</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.font7, {color: '#F1C6C1'}]}>
                  {common.thousandths(
                    common.exchangeRate(currency, average_bet),
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.gameTypeTable}>
              <Text style={styles.font6}>月人均遊玩(分鐘)</Text>
              <Text style={[styles.font7, {color: '#99FFCD'}]}>
                {average_time}
              </Text>
            </View>
            <View style={styles.gameTypeTable}>
              <Text style={styles.font6}>RTP</Text>
              <Text style={styles.font6}>{rtp}</Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const createContent = (data: any[]) => {
    return data.map((obj: any, index: number) => {
      return (
        <View
          key={obj.currency + '_box'}
          style={{width: '100%', marginVertical: 5}}>
          <Pressable
            style={styles.contentInside}
            disabled={currencyBtnDisabled[index]}
            onPress={() => {
              fetchCurrencyData(obj.currency, oid, index);
              const newArray = currencyBtnDisabled;
              newArray[index] = true;
              setCurrencyBtnDisabled(newArray);
            }}>
            {currencyImage(obj.currency)}
            <Text
              style={[
                styles.font4,
                {textAlign: currencyImage(obj.currency) ? 'left' : 'center'},
              ]}>
              {obj.currency}
            </Text>
          </Pressable>
          <View
            style={[
              styles.loadingBox,
              {display: currencyBtnDisabled[index] ? 'flex' : 'none'},
            ]}>
            <ActivityIndicator size="large" color="#A1A1A1" />
          </View>
          <View>{oneCurrencybox(latestDetails[index], obj.currency)}</View>
        </View>
      );
    });
  };

  const createContentBox = (data: any[]) => {
    if (data.length <= 0) {
      return (
        <View
          style={[
            styles.contentBox,
            {minHeight: '100%', justifyContent: 'center'},
          ]}>
          <Image
            source={require('../../res/picture/info_purple.png')}
            style={styles.contentInfoImg}
            resizeMode="contain"
          />
          <Text style={styles.font2}>近一個月無資料</Text>
        </View>
      );
    } else {
      const getLastMonth = new Date().getMonth(); //get last month
      const getMonthStr = getLastMonth === 0 ? 12 : getLastMonth;
      return (
        <View style={styles.contentBox}>
          <Text style={styles.font3}>{getMonthStr}月 TOP3資料</Text>
          <View style={styles.horizontalStyle} />
          <View style={styles.triangleStyle} />
          <View style={{width: '100%'}}>{createContent(data)}</View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bgImage/bg.png')}
        style={styles.backGroundSet}
        resizeMode={'cover'}>
        <View>
          <View style={{marginTop: 10, marginBottom: 10}}>
            <Text style={styles.promptText}>快速查詢</Text>
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
        <ScrollView style={{width: '100%'}}>
          <View style={styles.outSideBox}>
            <View style={{width: '80%'}}>
              {common.dropdownBox(
                ownerArray,
                setSelectedOwner,
                selectedOwner,
                '請選擇總代',
              )}
            </View>
            <Pressable
              style={styles.sendButton}
              onPress={() => {
                if (selectedOwner) {
                  fetchLatest(selectedOwner.value);
                  setLatestData([]);
                  setContentDisplay(false);
                  setLoadingDisplay(true);
                } else {
                  Alert.alert('請選擇總代');
                }
              }}>
              <Text style={styles.font1}>確認送出</Text>
            </Pressable>
            <View
              style={[
                {display: contentDisplay ? 'flex' : 'none'},
                styles.outSideBox,
              ]}>
              {createContentBox(latestData)}
            </View>
          </View>
        </ScrollView>
        <View style={{marginBottom: 10}}>
          <Text style={styles.font8}>顯示幣別:CNY(除原幣別外)</Text>
        </View>
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
    backgroundColor: '#666DC1',
    padding: 7,
    paddingLeft: 20,
    paddingRight: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  horizontalStyle: {
    backgroundColor: '#ACB2FF',
    width: '100%',
    height: 5,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
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
    marginBottom: 5,
  },
  imageSize: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  outSideBox: {
    width: '100%',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#636DEA',
    width: '80%',
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  contentBox: {
    backgroundColor: '#1A1C2E',
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
  },
  contentInfoImg: {
    marginBottom: 20,
    width: 40,
    height: 40,
  },
  contentInside: {
    backgroundColor: '#42445A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 15,
    width: '100%',
  },
  currencyTable: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#FFFFFF3D',
  },
  gameTypeName: {
    width: '10%',
    backgroundColor: '#ACB2FF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTypeTable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginVertical: 3,
  },
  loadingBox: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  font1: {color: '#FFFFFF', fontSize: 18, fontWeight: '600'},
  font2: {color: '#ACB2FF', fontSize: 20},
  font3: {color: '#FFFFFF', fontSize: 20, foUSDTntWeight: '600'},
  font4: {
    color: '#FFFFFF',
    fontSize: 20,
    marginHorizontal: 5,
    width: 100,
  },
  font5: {color: '#000000', fontSize: 14},
  font6: {color: '#FFFFFF', fontSize: 14},
  font7: {textAlign: 'right', fontSize: 14},
  font8: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  imageBox: {width: 100, alignItems: 'flex-end'},
});

export default QuickSearchScreen;
