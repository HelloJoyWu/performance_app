import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';

export const loadView = (showView: boolean) => {
  return (
    <View style={[styles.loadBox, {display: showView ? 'flex' : 'none'}]}>
      <ActivityIndicator size="large" color="#000000" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#72727263',
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '30%',
  },
});
