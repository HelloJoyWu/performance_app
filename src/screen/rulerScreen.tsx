import React, {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, ImageBackground, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface rulerScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'RulerScreen'>;
}

const RulerScreen: React.FC<rulerScreenProps> = ({navigation}) => {
  const initialValue = 100;
  const [valueNumber, setValueNumber] = useState<number[]>([initialValue]);

  useEffect(() => {
    let valueTimer = setTimeout(() => {
      setValueNumber([initialValue]);
    }, 100);
    return () => {
      clearTimeout(valueTimer);
    };
  }, [valueNumber]);

  const createBar = (num: number[]) => {
    return (
      <View
        style={{
          position: 'absolute',
          left: '74%',
          top: '11.5%',
          width: '15%',
          height: '39%',
          // backgroundColor: '#FFFFFF',
        }}>
        <MultiSlider
          values={valueNumber}
          onValuesChangeFinish={value => {
            console.log('Ruler value', value);

            // slide-unlock 設定滑動解鎖範圍
            if (value[0] < 40 && value[0] > 25) {
              setValueNumber(value);
              navigation.navigate('CallScreen');
            } else {
              setValueNumber(value);
            }
          }}
          vertical={true}
          sliderLength={400}
          containerStyle={{height: 750}}
          // onValuesChange={value => {
          //   console.log(value);
          // }}
          // show-slide: Mark line 56-61 to reveal the secret
          trackStyle={{backgroundColor: '#FFFFFF00'}}
          selectedStyle={{backgroundColor: '#FFFFFF00'}}
          markerStyle={{
            backgroundColor: '#FFFFFF00',
            borderColor: '#FFFFFF00',
            height: 70,
          }}
          min={0}
          max={101}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/ruler.png')}
        style={styles.backGroundSet}
        resizeMode={'contain'}>
        <View style={{width: '100%', height: '100%'}}>
          {createBar(valueNumber)}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backGroundSet: {
    flex: 1,
    // width: '100%',
    // height: '100%',
    // resizeMode: 'contain',
    // padding: 20,
  },
});

export default RulerScreen;
