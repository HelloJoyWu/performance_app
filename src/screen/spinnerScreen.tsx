import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type SpinnerScreenProps = {
  doSpin: boolean;
  children: React.ReactNode;
};

const SpinnerScreen: React.FC<SpinnerScreenProps> = ({doSpin = false}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000000',
      }}>
      <ImageBackground
        source={require('../../res/bgImage/blackBg.png')}
        style={styles.backGroundSet}>
        <View style={styles.container}>
          {/* <Image
            source={require('../../res/logo.png')}
            style={{
              width: 63,
              height: 63,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          /> */}
          {doSpin ? <ActivityIndicator size="large" color="#007aff" /> : null}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default SpinnerScreen;
