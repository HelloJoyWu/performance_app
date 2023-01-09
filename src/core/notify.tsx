import AsyncStorage from '@react-native-async-storage/async-storage';

const _KEY = 'performanceNotify';
const _expires = 1000 * 3600 * 24 * 7; // 7 days

const _getKey = (val: string): string => {
  return _KEY + '@' + val;
};

export const clear = async () => {
  const storedIdJSON = await AsyncStorage.getItem(_KEY);
  console.log('Clear storedIdJSON', storedIdJSON);
  if (!storedIdJSON || storedIdJSON === '[]') {
    return;
  }
  const processStoredIds = JSON.parse(storedIdJSON);
  let delKeys = processStoredIds.map((val: string) => {
    return _getKey(val);
  });
  await AsyncStorage.multiRemove(delKeys);
  await AsyncStorage.removeItem(_KEY);
};

const _storeWithId = async (id: string, dataJSON: string): Promise<void> => {
  const storedIds = [];
  const storedIdJSON = await AsyncStorage.getItem(_KEY);
  if (storedIdJSON && storedIdJSON !== '[]') {
    storedIds.push(...JSON.parse(storedIdJSON));
  }
  storedIds.push(id);
  await AsyncStorage.setItem(_KEY, JSON.stringify(storedIds));
  await AsyncStorage.setItem(_getKey(id), dataJSON);
};

export const store = async (
  messageid: string,
  data: notifyAlarmMsg | {[key: string]: string},
): Promise<void> => {
  let now = Date.now();
  let data2Store = {data: data, expireAt: now + _expires};
  try {
    await _storeWithId(messageid, JSON.stringify(data2Store));
    console.log('notify store success');
  } catch (e) {
    console.log('notify store error', e);
  }
  // let storedKeys = await AsyncStorage.getAllKeys();
  // console.log('storedKeys', storedKeys);
};

const _loadNoExpired = async (): Promise<notifyAlarmMsg[]> => {
  const storedIdJSON = await AsyncStorage.getItem(_KEY);
  console.log('storedIdJSON', storedIdJSON);
  if (!storedIdJSON || storedIdJSON === '[]') {
    return [];
  }
  const processStoredIds = JSON.parse(storedIdJSON);
  // console.log('processStoredIds', JSON.stringify(processStoredIds));
  let mapStoredIds = processStoredIds
    .map((val: string) => {
      return _getKey(val);
    })
    .reverse();
  const storedDatas = await AsyncStorage.multiGet(mapStoredIds);
  const now = Date.now();
  const delMapIds = [];
  const returnData = [];
  // Get data and record expired key
  for (var [mapKey, dataJSON] of storedDatas) {
    if (dataJSON) {
      let data = JSON.parse(dataJSON);
      if (data.expireAt < now) {
        delMapIds.push(mapKey);
        var id = mapKey.split('@')[1];
        var _i = processStoredIds.indexOf(id);
        processStoredIds.splice(_i, 1);
      } else {
        returnData.push(data.data);
      }
    } else {
      delMapIds.push(mapKey);
      var id = mapKey.split('@')[1];
      var _i = processStoredIds.indexOf(id);
      processStoredIds.splice(_i, 1);
    }
  }
  // console.log('Final processStoredIds', JSON.stringify(processStoredIds));
  await AsyncStorage.setItem(_KEY, JSON.stringify(processStoredIds));
  await AsyncStorage.multiRemove(delMapIds);
  return returnData;
};

export const load = async (): Promise<notifyAlarmMsg[]> => {
  try {
    return await _loadNoExpired();
  } catch (error) {
    console.error('notify load error', error);
    return [];
  }
};
