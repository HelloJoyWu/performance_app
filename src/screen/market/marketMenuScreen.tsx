import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as common from '../../components/common';
import {Dropdown} from 'react-native-element-dropdown';
import {format} from 'date-fns';
import {AxiosContext} from '../../context/axiosContext';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';

interface marketMenuScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'MarketMenuScreen'>;
}

const MarketMenuScreen: React.FC<marketMenuScreenProps> = ({navigation}) => {
  const axiosContext = useContext(AxiosContext);

  const selectItems: any = [
    {value: 1, label: '整體累積碼量-產品別'},
    {value: 2, label: 'CQ9 10大幣別-半年走勢'},
    {value: 3, label: '整體累積碼量-CQ9各幣別'},
  ];
  const [selectValue, setSelectValue] = useState<any>();

  const [showViewALLBet, setShowViewALLBet] = useState<boolean>(false);
  const [showViewCQ9, setShowViewCQ9] = useState<boolean>(false);

  const [motivationData, setMotivationData] = useState<any[]>([]);
  const [gensportsData, setGensportsData] = useState<any[]>([]);
  const [legoData, setLegoData] = useState<any[]>([]);
  const [showDirections, setShowDirections] = useState<boolean>(false);

  const allBetSubItems: any[] = [motivationData, gensportsData, legoData];
  const [monthStr, setMonthStr] = useState<String>('last');
  //數字可能有變動 將依實際派彩時間為主
  const getMonthDate = () => {
    //取得當月&前月日期
    const toDay = new Date();
    var perMonthStr: string = '';
    var perYearStr: string = '';
    var yearStr = toDay.getFullYear();
    var perMonth = toDay.getMonth();

    perMonthStr = perMonth.toString();
    perYearStr = yearStr.toString();

    if (perMonth < 10) {
      perMonthStr = '0' + perMonth;
    }
    if (perMonth <= 0) {
      perMonthStr = '12';
      perYearStr = (yearStr - 1).toString();
    }

    const nowDateStr = format(toDay, 'yyyy-MM-dd');

    const perDateStr = perYearStr + '-' + perMonthStr + '-01';

    console.log(nowDateStr);
    console.log(perDateStr);

    return {nowDateStr, perDateStr};
  };

  const fetchMotivationLatest = useCallback(async () => {
    const motivationItems: String[] = ['all', 'cq9', '168', 'cl'];
    const gensportsItems: String[] = ['all', 'cq9', '168', 'champ'];
    const legoItems: String[] = ['all', 'QTech'];
    // const legoItems: String[] = ['all', 'QTech', 'hub88'];
    const allBetItems: String[] = ['Motivation', 'GenSports', 'lego']; //與後端名稱要一致
    const dataClassification = (data: any) => {
      //brand 品牌   project
      const motivationDataBase: any[] = [];
      const gensportsDataBase: any[] = [];
      const legoDataBase: any[] = [];

      for (var i = 0; i < allBetItems.length; i++) {
        if (allBetItems[i] === 'Motivation') {
          for (var a = 0; a < motivationItems.length; a++) {
            motivationDataBase.push({
              name: motivationItems[a],
              currencyBet: 0,
              previousBet: 0,
            });
          }
        } else if (allBetItems[i] === 'GenSports') {
          for (var b = 0; b < gensportsItems.length; b++) {
            gensportsDataBase.push({
              name: gensportsItems[b],
              currencyBet: 0,
              previousBet: 0,
            });
          }
        } else if (allBetItems[i] === 'lego') {
          for (var c = 0; c < legoItems.length; c++) {
            legoDataBase.push({
              name: legoItems[c],
              currencyBet: 0,
              previousBet: 0,
            });
          }
        }
      }

      for (var i = 0; i < data.length; i++) {
        const brandData = data[i];
        for (var a = 0; a < brandData.length; a++) {
          const database = brandData[a];
          const dateStr: string = judgeMonth(database.date);
          if (database.brand === 'cq9') {
            if (database.project === 'GenSports') {
              if (dateStr === 'current') {
                gensportsDataBase[1].currencyBet = database.bet;
                gensportsDataBase[0].currencyBet += database.bet;
              } else if (dateStr === 'previous') {
                gensportsDataBase[1].previousBet = database.bet;
                gensportsDataBase[0].previousBet += database.bet;
              }
            } else if (database.project === 'Motivation') {
              if (dateStr === 'current') {
                motivationDataBase[1].currencyBet = database.bet;
                motivationDataBase[0].currencyBet += database.bet;
              } else if (dateStr === 'previous') {
                motivationDataBase[1].previousBet = database.bet;
                motivationDataBase[0].previousBet += database.bet;
              }
            }
          } else if (database.brand === 'lego') {
            if (database.project === 'qt') {
              if (dateStr === 'current') {
                legoDataBase[1].currencyBet = database.bet;
                legoDataBase[0].currencyBet += database.bet;
              } else if (dateStr === 'previous') {
                legoDataBase[1].previousBet = database.bet;
                legoDataBase[0].previousBet += database.bet;
              }
            }
          } else if (database.brand === 'cl') {
            if (database.project === 'Motivation') {
              if (dateStr === 'current') {
                motivationDataBase[3].currencyBet = database.bet;
                motivationDataBase[0].currencyBet += database.bet;
              } else if (dateStr === 'previous') {
                motivationDataBase[3].previousBet = database.bet;
                motivationDataBase[0].previousBet += database.bet;
              }
            }
          } else if (database.brand === 'kimbaba') {
            if (database.project === 'GenSports') {
              if (dateStr === 'current') {
                gensportsDataBase[2].currencyBet = database.bet;
                gensportsDataBase[0].currencyBet += database.bet;
              } else if (dateStr === 'previous') {
                gensportsDataBase[2].previousBet = database.bet;
                gensportsDataBase[0].previousBet += database.bet;
              }
            } else if (database.project === 'Motivation') {
              if (dateStr === 'current') {
                motivationDataBase[2].currencyBet = database.bet;
                motivationDataBase[0].currencyBet += database.bet;
              } else if (dateStr === 'previous') {
                motivationDataBase[2].previousBet = database.bet;
                motivationDataBase[0].previousBet += database.bet;
              }
            }
          } else if (database.brand === 'champland') {
            if (database.project === 'GenSports') {
              if (dateStr === 'current') {
                gensportsDataBase[3].currencyBet = database.bet;
                gensportsDataBase[0].currencyBet += database.bet;
              } else if (dateStr === 'previous') {
                gensportsDataBase[3].previousBet = database.bet;
                gensportsDataBase[0].previousBet += database.bet;
              }
            }
          }
        }
      }

      setMotivationData(motivationDataBase);
      setGensportsData(gensportsDataBase);
      setLegoData(legoDataBase);
    };
    try {
      const {nowDateStr, perDateStr} = getMonthDate();
      const [respCq9, respKimbaba, respChampland] = await Promise.all([
        await axiosContext.authCq9Axios.get(
          '/api/v1/inquiry/sales/specify/project/month',
          {
            params: {
              from_date: perDateStr,
              to_date: nowDateStr,
            },
          },
        ),
        await axiosContext.authKimbabaAxios.get(
          '/api/v1/inquiry/sales/specify/project/month',
          {
            params: {
              from_date: perDateStr,
              to_date: nowDateStr,
            },
          },
        ),
        await axiosContext.authChamplandAxios.get(
          '/api/v1/inquiry/sales/specify/project/month',
          {
            params: {
              from_date: perDateStr,
              to_date: nowDateStr,
            },
          },
        ),
      ]);
      console.log('Loading champ latest currency performane success');
      // console.log('respCq9 show', respCq9.data);
      // console.log('respKimbaba show', respKimbaba.data);
      // console.log('respChampland show', respChampland.data);
      dataClassification([respCq9.data, respKimbaba.data, respChampland.data]);
    } catch (error: any) {
      const alertMsg = error.response.config.url
        ? `[${error.response.status}] ${error.response.data.message}`
        : `${error}`;
      console.error('Fetch latest currency failed', alertMsg);
    }
  }, [
    axiosContext.authChamplandAxios,
    axiosContext.authCq9Axios,
    axiosContext.authKimbabaAxios,
  ]);
  useEffect(() => {
    console.log('Loading champ latest currency performane');
    fetchMotivationLatest();
  }, [fetchMotivationLatest]);

  const judgeMonth = (date: string) => {
    //"2022-09-01T00:00:00+00:00"
    const nowMonthStr: any = new Date().getMonth() + 1;
    const getMonthStr: any = new Date(date).getMonth() + 1;

    if (nowMonthStr === getMonthStr) {
      return 'current';
    } else {
      return 'previous';
    }
  };

  const imgSet = () => {
    return (
      <View style={styles.buttonBoxRight}>
        <Image
          source={require('../../../res/arrow.png')}
          style={{
            transform: [{rotate: '-90deg'}],
          }}
        />
      </View>
    );
  };

  const createSubItems = (data: any[]) => {
    return data.map((obj: any, index: number) => {
      return (
        <View
          key={'subItems_' + index}
          style={[
            styles.subItemsView,
            {borderBottomWidth: index === data.length - 1 ? 0 : 1},
          ]}>
          <Text style={styles.font1}>{common.convertAgentName(obj.name)}</Text>
          <Text style={styles.font2}>
            {monthStr === 'now'
              ? common.thousandths(obj.currencyBet)
              : common.thousandths(obj.previousBet)}
          </Text>
        </View>
      );
    });
  };

  const itemImg = (name: String) => {
    if (name === 'GenSports') {
      return (
        <View>
          <View style={styles.itemImgView}>
            <Image
              source={require('../../../res/logo/bg_gensports.png')}
              style={styles.image1}
            />
          </View>
          <Text style={styles.font7}>
            *數字可能有變動 將依實際派彩時間為主*
          </Text>
        </View>
      );
    } else if (name === 'Motivation') {
      return (
        <View style={styles.itemImgView}>
          <Image
            source={require('../../../res/logo/bg_motivation.png')}
            style={styles.image1}
          />
        </View>
      );
    } else if (name === 'lego') {
      return (
        <View style={styles.itemImgView}>
          <Image
            source={require('../../../res/logo/bg_lego.png')}
            style={styles.image1}
          />
        </View>
      );
    }
  };

  const createAllBet = () => {
    const allBetItems: String[] = ['Motivation', 'GenSports', 'lego']; //與後端名稱要一致
    return allBetItems.map((obj: String, index: number) => {
      return (
        <View key={'allBet_' + index} style={{width: '100%'}}>
          {itemImg(obj)}
          {createSubItems(allBetSubItems[index])}
        </View>
      );
    });
  };

  const renderItem = (item: any, selecded: any) => {
    return (
      <View
        style={[
          styles.item,
          {backgroundColor: selecded ? '#ACB2FF' : '#1A1C2E'},
        ]}>
        <Text
          style={[styles.textItem, {color: selecded ? '#1A1C2E' : '#FFFFFF'}]}>
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bgImage/bg.png')}
        style={styles.backGroundSet}>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <Text style={styles.font5}>市場概況</Text>
          {LogoutTimer()}
        </View>
        <View style={{position: 'absolute', top: 10, left: 0}}>
          <Pressable
            onPress={() => navigation.pop()}
            style={styles.backButtonSet}>
            {common.backButton()}
          </Pressable>
        </View>

        <View style={styles.contentSet}>
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.font6}
              containerStyle={styles.containerStyle}
              activeColor={'#1A1C2E'}
              data={selectItems}
              labelField="label"
              valueField="value"
              value={selectValue}
              placeholder="請選擇查看項目"
              autoScroll={false}
              onChange={item => {
                setSelectValue(item);
                if (item.value === 1) {
                  setShowViewALLBet(true);
                  setShowViewCQ9(false);
                } else if (item.value === 2) {
                  setShowViewALLBet(false);
                  setShowViewCQ9(true);
                } else if (item.value === 3) {
                  setSelectValue('');
                  setShowViewALLBet(false);
                  setShowViewCQ9(false);
                  navigation.push('CQ9AllAccBetScreenScreen');
                }
              }}
              renderItem={renderItem}
            />
          </View>

          <ScrollView
            contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
            bounces={false}>
            <View
              style={[
                styles.diffBigView,
                {display: showViewALLBet ? 'flex' : 'none'},
              ]}>
              <View style={styles.showItemView}>
                <Text style={styles.font3}>請選按查看項目</Text>
                <View style={styles.showItemButtonView}>
                  <Pressable
                    onPress={() => {
                      setMonthStr('last');
                    }}
                    style={[
                      styles.showItemButton,
                      {
                        backgroundColor:
                          monthStr === 'last' ? '#ACB2FF' : '#1A1C2E',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.font4,
                        {color: monthStr === 'last' ? '#1A1C2E' : '#ACB2FF'},
                      ]}>
                      前月
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setMonthStr('now');
                    }}
                    style={[
                      styles.showItemButton,
                      {
                        backgroundColor:
                          monthStr === 'now' ? '#ACB2FF' : '#1A1C2E',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.font4,
                        {color: monthStr === 'now' ? '#1A1C2E' : '#ACB2FF'},
                      ]}>
                      當月
                    </Text>
                  </Pressable>
                </View>

                <View style={{width: '100%'}}>{createAllBet()}</View>
              </View>
              <View style={{position: 'absolute', top: 10, right: 10}}>
                <Pressable
                  onPress={() => {
                    setShowDirections(true);
                  }}>
                  <Image
                    source={require('../../../res/picture/info_yellow.png')}
                    style={{width: 26, height: 27, resizeMode: 'contain'}}
                  />
                </Pressable>
              </View>
            </View>

            <View
              style={[
                styles.diffBigView,
                {display: showViewCQ9 ? 'flex' : 'none'},
              ]}>
              <View style={styles.titleBigBox}>
                <View style={styles.titleBox}>
                  <Text style={{color: '#FFFFFF', fontSize: 18}}>
                    前10大幣別
                  </Text>
                </View>
                <View style={styles.triangleStyle} />
              </View>
              <View style={{width: '100%'}}>
                <Pressable
                  style={styles.buttonBox}
                  onPress={() => {
                    navigation.push('AverageDailyBetScreen');
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.buttonBoxLeft}>
                      <Text style={styles.font6}>日均碼量概況</Text>
                    </View>
                    {imgSet()}
                  </View>
                </Pressable>
                <Pressable
                  style={styles.buttonBox}
                  onPress={() => {
                    navigation.push('AverageDailyPlayerScreen');
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.buttonBoxLeft}>
                      <Text style={styles.font6}>日均人數概況</Text>
                    </View>
                    {imgSet()}
                  </View>
                </Pressable>
                <Pressable
                  style={styles.buttonBox}
                  onPress={() => {
                    navigation.push('OverviewGameTypesScreen');
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.buttonBoxLeft}>
                      <Text style={styles.font6}>遊戲種類概況</Text>
                    </View>
                    {imgSet()}
                  </View>
                </Pressable>
                {/* <Pressable
                style={styles.buttonBox}
                onPress={() => {
                  // Alert.alert('coming soon');
                  navigation.push('GroupComparisonScreen');
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.buttonBoxLeft}>
                    <Text style={styles.font6}>分群比較</Text>
                  </View>
                  {imgSet()}
                </View>
              </Pressable> */}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Text style={{color: '#FFFFFF', margin: 1}}>顯示幣別:CNY</Text>
          <Text style={{color: '#FFFFFF', margin: 1}}>
            每日更新時間為08:00(UTC+8)
          </Text>
        </View>

        <Pressable
          onPress={() => {
            setShowDirections(false);
          }}
          style={{
            display: showDirections ? 'flex' : 'none',
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#FCFFA7',
              padding: 5,
              width: '65%',
              position: 'absolute',
              top: 200,
              borderRadius: 15,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#707064',
                textAlign: 'center',
              }}>
              -說明-
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#443F3F',
                textAlign: 'left',
              }}>
              *前月:前一個月數據
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#443F3F',
                textAlign: 'left',
              }}>
              *當月:計算至前一個營業日
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#443F3F',
                textAlign: 'left',
              }}>
              (ex:查看日為12/10,則結算至12/9)
            </Text>
          </View>
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
    backgroundColor: '#9a92a9',
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentSet: {
    flex: 9,
  },
  restartButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 7,
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
  titleBox: {
    backgroundColor: '#242740',
    width: '100%',
    height: 34,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBigBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 3,
  },
  buttonBox: {
    backgroundColor: '#42445A',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginVertical: 5,
  },
  buttonBoxLeft: {
    width: '90%',
  },
  buttonBoxRight: {
    width: '10%',
    alignSelf: 'center',
  },
  dropdown: {
    borderColor: '#ACB2FF',
    backgroundColor: '#1A1C2E',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '90%',
  },
  containerStyle: {
    backgroundColor: '#1A1C2E',
    borderColor: '#CBE7FF',
    padding: 5,
  },
  placeholderStyle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#FFFFFF84',
    textAlign: 'left',
  },
  selectedTextStyle: {
    fontSize: 17,
    color: '#FFFFFF',
  },
  item: {
    paddingVertical: 5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  textItem: {
    width: '100%',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
  itemImgView: {
    backgroundColor: '#515369',
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  subItemsView: {
    borderBottomColor: '#767FD2',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diffBigView: {
    width: '90%',
    alignItems: 'center',
  },
  image1: {
    width: 150,
    height: 35,
    resizeMode: 'contain',
  },
  showItemView: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1A1C2E',
    borderRadius: 10,
    padding: 10,
  },
  showItemButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  showItemButton: {
    width: '48%',
    borderColor: '#ACB2FF',
    borderWidth: 3,
    borderRadius: 8,
    padding: 5,
  },

  font1: {color: '#FFFFFF', fontSize: 15},
  font2: {color: '#BFF2FF', fontSize: 17},
  font3: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
    paddingVertical: 5,
  },
  font4: {
    fontSize: 18,
    textAlign: 'center',
  },
  font5: {
    color: '#FFFFFF',
    fontWeight: '600',
    margin: 1,
    marginBottom: 10,
    fontSize: 30,
  },
  font6: {color: '#FFFFFF', fontSize: 18},
  font7: {
    color: '#FF0000',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
});

export default MarketMenuScreen;
