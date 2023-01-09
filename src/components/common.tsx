import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import {format} from 'date-fns';
import {LineChart} from 'react-native-gifted-charts';
import {AuthContext} from '../context/authContext';
import {Dropdown} from 'react-native-element-dropdown';
import exchangeCurrency from '../components/exchangeCurrency.json';

export const thousandths = (num: number) => {
  if (!num) {
    return '0';
  }
  if (num === 0) {
    return '0';
  }

  const num_back = Math.round(num).toString();
  const parts = num_back.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const decimalPoint = (num: number) => {
  // console.log(num);
  if (isNaN(num) || !isFinite(num)) {
    return '--';
  }

  if (!num) {
    return '0';
  }
  if (num === 0) {
    return '0';
  }

  if (num > 0) {
    return '+' + parseFloat(num.toFixed(2));
  } else {
    return parseFloat(num.toFixed(2));
  }
};

export const dateFormat = (date: string) => {
  //mm-dd
  const newDate = date.slice(5, 10);
  return newDate;
};

export const fullDateFormat = (date: string) => {
  //yyyy-mm-dd
  const newDate = date.slice(0, 10);
  return newDate;
};

export const pointerLabelFunction = (index: any) => {
  const leftPoint: number = -index.zindex * 2;
  const boxWidth: number =
    thousandths(index.dataBase).length * 10 + 25 < 90
      ? 100
      : thousandths(index.dataBase).length * 10 + 25;
  return (
    <View
      style={{
        width: boxWidth,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 5,
        position: 'absolute',
        top: 33,
        left: leftPoint,
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 16, color: '#000000'}}>{index.label}</Text>
      <Text style={{fontSize: 12, color: '#000000'}}>{index.typeString}</Text>
      <Text style={{fontSize: 20, color: '#000000'}}>
        {thousandths(index.dataBase)}
      </Text>
    </View>
  );
};

export const convertName = (name: string) => {
  if (name === 'bet') {
    return '總碼量';
  } else if (name === 'player') {
    return '總人數';
  } else if (name === 'registered_player') {
    return '註冊人數';
  } else if (name === 'played_registered_player') {
    return '註冊且遊玩人數';
  } else if (name === 'actualBet') {
    return '實際碼量';
  } else if (name === 'pointBet') {
    return '點數碼量(1:130)';
  } else {
    return name;
  }
};

export const convertGameTypeName = (name: string) => {
  if (name === 'slot') {
    return '老虎機';
  } else if (name === 'arcade') {
    return '街機';
  } else if (name === 'fish') {
    return '漁機';
  } else if (name === 'lotto') {
    return '彩票';
  } else if (name === 'sport') {
    return '體育';
  } else if (name === 'table') {
    return '棋牌';
  } else if (name === 'live') {
    return '真人';
  } else if (name === 'ALL') {
    return '整體';
  } else {
    return name;
  }
};

export const convertSportsTypeName = (name: string) => {
  if (name === 'basketball') {
    return '籃球';
  } else if (name === 'baseball') {
    return '棒球';
  } else if (name === 'esport') {
    return '電競';
  } else if (name === 'soccer') {
    return '足球';
  } else if (name === 'electronic') {
    return '電子';
  } else if (name === 'fantasy') {
    return '夢幻體育';
  } else if (name === 'all') {
    return '整體';
  } else if (name === 'superSports') {
    return 'Super體育';
  } else if (name === '真人百家') {
    return '真人百家(未含在當日業績裡)';
  } else {
    return name;
  }
};

export const convertAgentName = (name: string) => {
  if (name === 'all') {
    return '整體';
  } else if (name === 'cq9') {
    return 'CQ9';
  } else if (name === '168' || name === 'kimbaba') {
    return '168';
  } else if (name === 'cl') {
    return '日韓';
  } else if (name === 'champland' || name === 'champ') {
    return 'champ';
  } else {
    return name;
  }
};

export const cram30Day = (data: any[]) => {
  const nowDate = new Date();

  for (var i = 1; i <= 30; i++) {
    const preDay = new Date(new Date().setDate(nowDate.getDate() - i));
    const dateStr = format(preDay, 'yyyy-MM-dd');
    var dataDateStr = '';
    if (i <= data.length) {
      dataDateStr = format(new Date(data[i - 1].date), 'yyyy-MM-dd');
    }
    if (dataDateStr !== dateStr) {
      const database = {bet: 0, date: dateStr, player: 0};
      data.splice(i - 1, 0, database);
    }
  }
  return data;
};

export const overallTrend = (data: any) => {
  for (var i = 0; i < data.length; i++) {
    if (data[i].length < 30) {
      data[i] = cram30Day(data[i]);
    }
  }

  const allDataBase: any[] = [];
  for (var n = 0; n < 30; n++) {
    var betNum = 0;
    var playerNum = 0;
    for (var m = 0; m < data.length; m++) {
      betNum += data[m][n].bet;
      playerNum += data[m][n].player;
    }

    allDataBase.push({date: data[0][n].date, bet: betNum, player: playerNum});
  }

  return allDataBase;
};

export const presetDataArray = (agentArray: any[]) => {
  const allagentData: any[] = [];
  for (var a = 0; a < agentArray.length; a++) {
    allagentData.push({
      name: convertAgentName(agentArray[a]),
      bet: [],
      player: [],
      date: [],
      betTot: 0,
      playerTot: 0,
      dispalyShow: false,
      average_bet: 0,
      average_player: 0,
    });
  }
  return allagentData;
};

const customLabel = (dateArray: any, index: number, showColor: string) => {
  if (index === 0 || index === 29) {
    return (
      <View style={{width: 50, top: -10}}>
        <Text style={{color: showColor}}>{dateArray[index]}</Text>
      </View>
    );
  } else {
    null;
  }
};

/**
 * 正規化數列，正規化後數值＋５，參考:
 * https://www.statology.org/normalize-data-between-0-and-100/
 * @param array 數列
 * @param average 該數列平均數
 * @returns [正規化數列, 正規化平均數]
 */
export const normalizeValue = (
  array: number[],
  average: number,
): [number[], number] => {
  const minValue = Math.min(...array);
  const maxValue = Math.max(...array);

  const normalizeArray = [];
  const ageNormalize = ((average - minValue) / (maxValue - minValue)) * 100 + 5;
  for (var i = 0; i < array.length; i++) {
    const num = ((array[i] - minValue) / (maxValue - minValue)) * 100 + 5;
    normalizeArray.push(Number(num.toFixed(2)));
  }
  return [normalizeArray, ageNormalize];
};

/**
 *
 * @param date 日期陣列
 * @param database 走勢圖陣列
 * @param showColor
 * @param type 顯示在label的文字
 * @returns
 */
export const returnData = (
  date: any,
  database: any,
  showColor: string,
  type: string,
  databaseNormalize: any,
) => {
  const dateBase = [];

  for (var i = 0; i < date.length; i++) {
    const queue_index = i;
    // console.log(database[i] / 100000);

    dateBase.push({
      label: date[i],
      value: databaseNormalize[i],
      dataBase: database[i],
      labelComponent: () => customLabel(date, queue_index, showColor),
      customDataPoint: () => {},
      zindex: queue_index,
      typeString: type,
    });
  }
  return dateBase;
};

export const symbolFormat = (numFormat: string, num: number) => {
  if (num > 0) {
    return '+' + numFormat;
  } else if (num < 0) {
    return numFormat;
  } else if (num === 0) {
    return '-';
  }
};

export const lastThirtyDays = (dateArray: any) => {
  if (!dateArray) {
    return;
  }
  if (dateArray.length >= 30) {
    return dateArray;
  }

  const yearStr = new Date().getFullYear();
  const fullDate: any = yearStr + '-' + dateArray[dateArray.length - 1];

  const lastThirtyDaysArray: string[] = [];
  for (var i = 29; i >= 0; i--) {
    var firstDay = new Date(fullDate);
    const lastDate = firstDay.setDate(firstDay.getDate() - i);

    const dayStr = format(lastDate, 'MM-dd');
    lastThirtyDaysArray.push(dayStr);
  }

  return lastThirtyDaysArray;
};

/**
 *
 * @param date 30天日期
 * @param database 走勢圖資料
 * @param average
 * @param showColor
 * @param typeName
 * @param normalizeBoolen 是否要正規化
 * @returns
 */
export const chartsProps = (
  date: any,
  database: any,
  average: number,
  showColor: string,
  typeName: string,
  normalizeBoolen: boolean,
) => {
  var averageNormalize: number, databaseNormalize;
  if (normalizeBoolen) {
    const normalize = normalizeValue(database, average);
    databaseNormalize = normalize[0];
    averageNormalize = Number(normalize[1]);
  } else {
    averageNormalize = average;
    databaseNormalize = database;
  }
  return (
    <View>
      <LineChart
        data={returnData(
          date,
          database,
          showColor,
          typeName,
          databaseNormalize,
        )}
        width={Dimensions.get('window').width}
        height={200}
        yAxisLabelWidth={0.1}
        disableScroll={true}
        showReferenceLine1={true}
        referenceLine1Position={averageNormalize}
        referenceLine1Config={{
          thickness: 1,
          width: 285,
          color: '#FFFFFF',
          type: 'dash',
          dashWidth: 5,
          dashGap: 5,
          labelText: thousandths(average),
          labelTextStyle: {
            color: '#FFFFFF',
            fontWeight: '600',
            right: 10,
            top: -20,
            fontSize: 16,
          },
        }}
        initialSpacing={20}
        spacing={9}
        xAxisColor="none"
        yAxisColor="#41414100"
        hideRules={true}
        color={showColor}
        areaChart
        startFillColor={showColor}
        endFillColor={showColor}
        startOpacity={0.8}
        endOpacity={0.1}
        pointerConfig={{
          height: 10,
          width: 10,
          radius: 5,
          color: showColor,
          showPointerStrip: false,
          pointerStripColor: '#FFFFFF',
          pointerStripUptoDataPoint: false,
          pointerLabelComponent: pointerLabelFunction,
          pointerLabelWidth: 200,
        }}
      />
    </View>
  );
};

export const chartsDataarrange = (data: any[], owner: string) => {
  const dateArray: string[] = [];
  const betArray: number[] = [];
  const playerArray: number[] = [];
  const registeredArray: number[] = [];
  const played_registeredArray: number[] = [];
  const pointBetArray: number[] = [];
  var bet_age: number = 0;
  var player_age: number = 0;
  var registered_age: number = 0;
  var played_registered_age: number = 0;

  for (var i = 0; i < data.length; i++) {
    const obj = data[i];
    dateArray.unshift(dateFormat(obj.date));
    betArray.unshift(obj.bet);
    pointBetArray.unshift(obj.bet * 130);
    playerArray.unshift(obj.player);
    registeredArray.unshift(obj.registered_player);
    played_registeredArray.unshift(obj.played_registered_player);
    bet_age += obj.bet;
    player_age += obj.player;
    registered_age += obj.registered_player;
    played_registered_age += obj.played_registered_player;
  }

  const lastThirtyDaysArray = lastThirtyDays(dateArray);

  bet_age = bet_age / data.length;
  player_age = player_age / data.length;
  registered_age = registered_age / data.length;
  played_registered_age = played_registered_age / data.length;

  for (var a = 0; a < lastThirtyDaysArray.length; a++) {
    if (lastThirtyDaysArray[a] !== dateArray[a]) {
      const mainDate = new Date(lastThirtyDaysArray[a]);
      const minorDate = new Date(dateArray[a]);

      if (mainDate.getTime() < minorDate.getTime()) {
        dateArray.splice(a, 0, lastThirtyDaysArray[a]);
        betArray.splice(a, 0, 0);
        playerArray.splice(a, 0, 0);
        pointBetArray.splice(a, 0, 0);
        registeredArray.splice(a, 0, 0);
        played_registeredArray.splice(a, 0, 0);
      }
    }
  }

  if (owner === 'kimbaba') {
    const allDataBase = [
      {
        name: 'pointBet',
        average: bet_age * 130,
        data: pointBetArray,
      },
      {
        name: 'actualBet',
        average: bet_age,
        data: betArray,
      },
      {
        name: 'player',
        average: player_age,
        data: playerArray,
      },
      {
        name: 'registered_player',
        average: registered_age,
        data: registeredArray,
      },
      {
        name: 'played_registered_player',
        average: played_registered_age,
        data: played_registeredArray,
      },
    ];
    return allDataBase;
  } else if (owner === 'CQ9') {
    const allDataBase = {
      name: 'ALL',
      date: lastThirtyDaysArray,
      bet: betArray,
      player: playerArray,
      bet_age: bet_age,
      player_age: player_age,
    };
    return allDataBase;
  } else {
    const allDataBase = [
      {
        name: 'bet',
        average: bet_age,
        data: betArray,
        date: lastThirtyDaysArray,
      },
      {
        name: 'player',
        average: player_age,
        data: playerArray,
        date: lastThirtyDaysArray,
      },
      {
        name: 'registered_player',
        average: registered_age,
        data: registeredArray,
        date: lastThirtyDaysArray,
      },
      {
        name: 'played_registered_player',
        average: played_registered_age,
        data: played_registeredArray,
        date: lastThirtyDaysArray,
      },
    ];
    return allDataBase;
  }
};

export const tableDataSore = (data: any[]) => {
  data = data.sort(function (a, b) {
    if (a.bet === b.bet) {
      return a.gametype < b.gametype ? 1 : -1;
    }
    return a.bet < b.bet ? 1 : -1;
  });
  return data;
};

export const tableDataTextColor = (bet: number) => {
  if (isNaN(bet) || !isFinite(bet)) {
    return '#FFFFFF';
  }

  if (bet < 0) {
    return '#FF7778';
  } else if (bet > 0) {
    return '#4BFFCA';
  } else {
    return '#FFFFFF';
  }
};

export const LogoutTimerView = (inactiveTimeInSeconds: number = 300) => {
  const authContext = useContext(AuthContext);
  const [logoutTimer, setLogoutTimer] = useState(inactiveTimeInSeconds * 1000);
  const logoutTimerRef = useRef(logoutTimer);
  const timerRedWarn = 100;

  useEffect(() => {
    const timerId = setInterval(async () => {
      logoutTimerRef.current -= 1;
      if (logoutTimerRef.current < 0) {
        clearInterval(timerId);
        authContext.logout();
      } else {
        setLogoutTimer(logoutTimerRef.current);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [authContext]);

  return (
    <View
      style={{
        margin: 5,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
        backgroundColor: logoutTimer < timerRedWarn ? 'red' : '#FFE41F',
      }}>
      <Text
        style={{
          color: logoutTimer < timerRedWarn ? '#FFFFFF' : '#60477B',
          fontWeight: '500',
        }}>
        登出倒數:{logoutTimer}秒
      </Text>
    </View>
  );
};

//export const logoutTimerView = (inactiveTimeInSeconds: number = 300) => {

export const judgmentDate = (date: Date) => {
  //8 am new day
  if (date.getHours() > 8) {
    return date;
  } else {
    const yesterDay = new Date(
      new Date().setDate(new Date(date).getDate() - 1),
    );
    const yesterDayStr = format(yesterDay, 'yyyy-MM-dd');
    return new Date(yesterDayStr);
  }
};

export const burgerMenu = (navigation: any) => {
  return (
    <View style={{position: 'absolute', top: 7, right: 0}}>
      <Pressable
        onPress={() => navigation.push('SettingScreen')}
        style={{margin: 10}}>
        <View>
          <Image
            source={require('../../res/button/setting.png')}
            style={{width: 35, height: 30}}
            resizeMode="contain"
          />
        </View>
      </Pressable>
    </View>
  );
};

export const currencyColor = (currency: string) => {
  const currencyArray = [
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
    'ALL',
  ];
  const colorArray = [
    '#FF5555',
    '#B9D6DE',
    '#50FA7B',
    '#FFBDB6',
    '#F1FA8C',
    '#BD93F9',
    '#BCFF65',
    '#FFB86C',
    '#4790FF',
    '#FF79C6',
    '#FFFFFF',
  ];

  const index = currencyArray.indexOf(currency);
  const color = colorArray[index];
  if (color) {
    return color;
  } else {
    return '#000000';
  }
};

export const getSixMonthDate = (range: number) => {
  //2022-02-01、2022-08-01
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentMonthStr = currentMonth < 10 ? '0' + currentMonth : currentMonth;
  const utcNowMonthStr: string = currentYear + '-' + currentMonthStr + '-01';
  var utcPreMonthStr: string = '';
  if (currentMonth - 6 <= 0) {
    const preMonth = 12 + (currentMonth - range);
    const preMonthStr = preMonth < 10 ? '0' + preMonth : preMonth;
    utcPreMonthStr = currentYear - 1 + '-' + preMonthStr + '-01';
  } else {
    const rangeMonth = currentMonth - range;
    const preMonth = rangeMonth < 10 ? '0' + rangeMonth : rangeMonth;
    utcPreMonthStr = currentYear + '-' + preMonth + '-01';
  }

  return {utcPreMonthStr, utcNowMonthStr};
};

export const exchangeRate = (currency: any, bet: number) => {
  const rate = exchangeCurrency[currency as keyof typeof exchangeCurrency];
  let orangeBet = bet * rate;
  return orangeBet;
};

export const dropdownBox = (
  items: any,
  setSelected: any,
  selected: any,
  placeholderText: string,
) => {
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
    <View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.selectedTextStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.containerStyle}
        inputSearchStyle={styles.selectedTextStyle}
        activeColor={'#1A1C2E'}
        data={items}
        labelField="label"
        valueField="value"
        search
        searchPlaceholder={'請輸入關鍵字'}
        value={selected}
        placeholder={placeholderText}
        autoScroll={false}
        onChange={itme => {
          setSelected(itme);
        }}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderColor: '#ACB2FF',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  containerStyle: {
    backgroundColor: '#1A1C2E',
    borderColor: '#ACB2FF',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  item: {
    paddingVertical: 5,
    margin: 5,
  },
  textItem: {
    width: '100%',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export const backButton = () => {
  return (
    <View>
      <Image
        source={require('../../res/backBtn.png')}
        style={{width: 17, height: 31, resizeMode: 'contain'}}
      />
    </View>
  );
};
