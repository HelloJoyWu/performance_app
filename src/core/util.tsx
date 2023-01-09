export const capitalizeFirstLetter = (theString: string) => {
  return theString.charAt(0).toUpperCase() + theString.slice(1);
};

export const getUTCLatestDateRange = (
  range: number,
): { utcNowDateStr: string; utcPreDateStr: string } => {
  const nowDate = new Date();
  const preDate = new Date(new Date().setDate(nowDate.getDate() - range));

  const utcNowDateStr = getUTCDateString(nowDate);
  const utcPreDateStr = getUTCDateString(preDate);

  return { utcNowDateStr, utcPreDateStr };
};

export const getUTCDateString = (theDate: Date) => {
  let utcMonthStr = '';
  if (theDate.getUTCMonth() + 1 > 9) {
    utcMonthStr = String(theDate.getUTCMonth() + 1);
  } else {
    utcMonthStr = '0' + String(theDate.getUTCMonth() + 1);
  }
  let utcDayStr = '';
  if (theDate.getUTCDate() > 9) {
    utcDayStr = String(theDate.getUTCDate());
  } else {
    utcDayStr = '0' + String(theDate.getUTCDate());
  }

  return theDate.getFullYear() + '-' + utcMonthStr + '-' + utcDayStr;
};

export const objToQueryString = (obj: {
  [k: string]: string | number | boolean | null | undefined;
}) => {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(key + '=' + obj[key]);
  }
  return keyValuePairs.join('&');
};
