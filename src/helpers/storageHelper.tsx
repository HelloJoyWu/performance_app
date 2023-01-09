import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Record the user's locally stored password
 * key:password
 * @param value (key:string,value:string)
 */
export const storeRulerPassword = async (value: any) => {
  try {
    const jsonValue = JSON.stringify(value.passwordStr);
    console.log('資料返序列化', jsonValue);

    await AsyncStorage.setItem(value.key, jsonValue);
  } catch (e) {
    console.log('save error', e);
  }
};

/**
 *
 * @param key
 * @returns password
 */
export const getRulerPassword = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (e) {
    console.log('reading error', e);
  }
};

export const storeOwnerList = async (value: any) => {
  //key:ownerList
  try {
    const jsonValue = JSON.stringify(value.list);
    await AsyncStorage.setItem(value.key, jsonValue);
  } catch (e) {
    console.log('save error', e);
  }
};

export const getOwnerList = async (key: string) => {
  //key:ownerList
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (e) {
    console.log('reading error', e);
  }
};
