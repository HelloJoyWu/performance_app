import React, {useState} from 'react';
import {Image, Text, Pressable, StyleSheet, View} from 'react-native';

interface Props {
  date: string;
  totBet: number;
  totPlayer: number;
  imgUrl: string;
  displayShow: boolean;
  buttonDisabled: boolean;
  onPress: () => void;
}

const menuOptionButton: React.FC<Props> = props => {
  const thousandths = (num: any) => {
    if (num === 0) {
      return '0';
    }
    if (typeof num === 'string') {
      return '*****';
    }
    if (isNaN(num)) {
      return '*****';
    }

    // const num_back = num.toFixed(0).replace(/\.?0+$/, '');
    const num_back = Math.round(num).toString();
    const parts = num_back.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  var showKibaba = false;
  const pointBet =
    typeof props.totBet === 'number' ? props.totBet * 130 : '******';

  const decideImgUrl = (urlText: string) => {
    if (urlText === 'cq9') {
      return (
        <Image
          source={require('../../res/logo/cq9.png')}
          style={styles.imageSize}
        />
      );
    } else if (urlText === 'kimbaba') {
      showKibaba = true;
      return (
        <Image
          source={require('../../res/logo/kimbaba.png')}
          style={styles.imageSize}
        />
      );
    } else if (urlText === 'champland') {
      return (
        <Image
          source={require('../../res/logo/ball.png')}
          style={styles.imageSize}
        />
      );
    } else if (urlText === 'lego') {
      return (
        <Image
          source={require('../../res/logo/logo.png')}
          style={styles.imageSize}
        />
      );
    } else if (urlText === 'motivation') {
      return (
        <Image
          source={require('../../res/logo/motivation.png')}
          style={styles.imageSize}
        />
      );
    } else if (urlText === 'gensports') {
      return (
        <Image
          source={require('../../res/logo/gensports.png')}
          style={styles.imageSize}
        />
      );
    } else {
      return (
        <View
          style={[
            styles.imageSize,
            {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000000',
              borderRadius: 50,
            },
          ]}>
          <Text style={{color: '#FFFFFF', fontSize: 16}}>{urlText}</Text>
        </View>
      );
    }
  };

  return (
    <Pressable
      onPress={props.onPress}
      // disabled={props.buttonDisabled}
      // activeOpacity={props.buttonDisabled ? 1 : 0.5}
      style={[
        props.buttonDisabled ? styles.notDataTouchBox : styles.touchBox,
        {display: props.displayShow ? 'flex' : 'none'},
      ]}>
      <View
        style={{
          borderColor: '#FFC10B',
          borderRadius: 50,
          borderWidth: 1,
          marginRight: 12,
          opacity: props.buttonDisabled ? 0.5 : 1,
        }}>
        {decideImgUrl(props.imgUrl)}
      </View>
      <View style={{width: '70%', justifyContent: 'space-between'}}>
        <View style={[styles.contentTextSet, {marginBottom: 7}]}>
          <Text style={{color: '#FFFFFF', fontSize: 14}}>{props.date}</Text>
          <View
            style={{
              width: '15%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../res/arrow.png')}
              style={{transform: [{rotate: '-90deg'}]}}
            />
          </View>
        </View>
        <View
          style={[
            styles.contentTextSet,
            {display: showKibaba ? 'none' : 'flex'},
          ]}>
          <Text style={{color: '#FFFFFF', fontSize: 15}}>總碼量</Text>
          <Text style={{color: '#BFF2FF', fontSize: 18, fontWeight: '500'}}>
            {thousandths(props.totBet)}
          </Text>
        </View>
        <View
          style={[
            styles.contentTextSet,
            {display: showKibaba ? 'flex' : 'none'},
          ]}>
          <Text style={{color: '#FFFFFF', fontSize: 15}}>點數碼量</Text>
          <Text style={{color: '#BFF2FF', fontSize: 18, fontWeight: '500'}}>
            {thousandths(pointBet)}
          </Text>
        </View>
        <View
          style={[
            styles.contentTextSet,
            {display: showKibaba ? 'flex' : 'none'},
          ]}>
          <Text style={{color: '#FFFFFF', fontSize: 15}}>實際碼量</Text>
          <Text style={{color: '#FFCB64', fontSize: 18, fontWeight: '500'}}>
            {thousandths(props.totBet)}
          </Text>
        </View>
        <View style={styles.contentTextSet}>
          <Text style={{color: '#FFFFFF', fontSize: 15}}>總人數</Text>
          <Text style={{color: '#FFEFBF', fontSize: 18, fontWeight: '500'}}>
            {thousandths(props.totPlayer)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  touchBox: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: '#242740',
    padding: 15,
    borderRadius: 10,
    elevation: 1.5,
    shadowColor: '#00000029',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    margin: 10,
  },
  notDataTouchBox: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: '#797979',
    padding: 15,
    borderRadius: 10,
    elevation: 1.5,
    shadowColor: '#00000029',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    margin: 10,
  },
  contentTextSet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageSize: {
    width: 84,
    height: 84,
  },
});

export default menuOptionButton;
