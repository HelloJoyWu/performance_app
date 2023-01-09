import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';

/**
 * tltle: show title
 * onPress: button trigger event
 */
interface Props {
  title: string;
  onPress: () => void;
  bgcolor: string;
}
const backButton: React.FC<Props> = props => {
  const returnUrl = (name: string) => {
    if (name === 'cq9') {
      return (
        <Image
          source={require('../../res/logo/bg_cq9.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'kimbaba') {
      return (
        <Image
          source={require('../../res/logo/bg_kimbaba.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'champland') {
      return (
        <Image
          source={require('../../res/logo/bg_champland.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'lego') {
      return (
        <Image
          source={require('../../res/logo/bg_lego.png')}
          style={styles.imageSize}
        />
      );
    } else if (name === 'motivation') {
      return (
        <Image
          source={require('../../res/logo/bg_motivation.png')}
          style={{height: 30, resizeMode: 'contain'}}
        />
      );
    } else if (name === 'gensports') {
      return (
        <Image
          source={require('../../res/logo/bg_gensports.png')}
          style={styles.imageSize}
        />
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: props.bgcolor,
        height: '100%',
        justifyContent: 'center',
      }}>
      <View style={styles.titleBoxText}>{returnUrl(props.title)}</View>
      <View style={styles.titleBox}>
        <Pressable onPress={props.onPress}>
          <View
            style={{
              alignItems: 'center',
              margin: 10,
            }}>
            <Image
              source={require('../../res/backBtn.png')}
              style={{width: 17, height: 31, resizeMode: 'contain'}}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBox: {
    color: '#4B6984',
    fontWeight: '500',
    fontSize: 30,
  },
  titleBoxText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameImgBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 5,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  nameImg: {
    backgroundColor: '#656CA5',
    borderColor: '#FFFFFF',
    borderWidth: 1.2,
    width: 55,
    height: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  imageSize: {
    height: 60,
    resizeMode: 'contain',
  },
});

export default backButton;
