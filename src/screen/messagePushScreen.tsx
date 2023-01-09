import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as common from '../components/common';
import * as notifyStorage from '../core/notify';
import {AuthContext} from '../context/authContext';
import messaging from '@react-native-firebase/messaging';
import {LogoutTimer, ExtensionTime} from '../components/logoutTimer';

interface messagePushScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'MessagePushScreen'>;
}

const renderFlatList = (messages: notifyAlarmMsg[]) => {
  if (messages.length === 0) {
    return (
      <View style={{alignItems: 'center', top: '35%'}}>
        <Image
          style={{
            width: 59.18,
            height: 51.25,
            resizeMode: 'contain',
            marginBottom: 5,
          }}
          source={require('../../res/picture/exclamationPoint.png')}
        />
        <Text style={{color: '#FFE41F', fontSize: 25, fontWeight: '400'}}>
          尚未有最新推撥
        </Text>
      </View>
    );
  }
  return (
    <FlatList
      data={messages}
      renderItem={({item}) => (
        <View
          style={{
            width: '90%',
            backgroundColor: '#242740',
            marginVertical: 10,
            borderRadius: 10,
            marginHorizontal: '5%',
            height: 70,
            padding: 10,
            justifyContent: 'space-around',
          }}>
          <View
            key={item.msgid + 'view1'}
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: '#FFFFFF', fontSize: 15, fontWeight: '700'}}>
              {item.title}
            </Text>
            <Text style={{color: '#FFFFFF', fontSize: 12}}>
              {common.fullDateFormat(item.date)}
            </Text>
          </View>
          <View key={item.msgid + 'view2'} style={{flexDirection: 'row'}}>
            <Text style={{color: '#FFFFFF', fontSize: 15, fontWeight: '700'}}>
              {item.message}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const MessagePushScreen: React.FC<messagePushScreenProps> = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const [messageData, setMessageData] = useState<notifyAlarmMsg[]>([]);
  const [doRefresh, setDoRefresh] = useState<number>(0);

  useEffect(() => {
    const loadMessage = async () => {
      const notifyMessage = await notifyStorage.load();
      setMessageData(notifyMessage);
    };
    loadMessage();
    // The foolowing subscriptions should be the same as APP.tsx:92
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'Push a new FCM message arrived!',
        JSON.stringify(remoteMessage),
      );
      let msgData = remoteMessage.data;
      if (msgData) {
        let action = msgData.action;
        let deactivateUser = msgData.user;
        if (
          action === 'deactive' &&
          deactivateUser === authContext.authInfo.username
        ) {
          if (authContext.authState) {
            authContext.logout();
          }
        }
        if (action === 'TestSalesAlarm') {
          if (remoteMessage.messageId) {
            msgData.msgid = remoteMessage.messageId;
            await notifyStorage.store(remoteMessage.messageId, msgData);
            loadMessage();
          }
        }
      }
    });
    return unsubscribe;
  }, [authContext, doRefresh]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bgImage/bg.png')}
        style={styles.backGroundSet}
        resizeMode={'cover'}>
        <View>
          <View style={{marginTop: 10, marginBottom: 10}}>
            <Text
              style={styles.promptText}
              onLongPress={() => {
                Alert.alert('請確認是否清空訊息', '', [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      return;
                    },
                  },
                  {
                    text: 'OK',
                    onPress: async () => {
                      await notifyStorage.clear();
                      setDoRefresh(doRefresh + 1);
                    },
                  },
                ]);
              }}>
              訊息推播
            </Text>
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
        <View
          style={{
            width: '100%',
            flex: 12,
          }}>
          {renderFlatList(messageData)}
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
});

export default MessagePushScreen;
