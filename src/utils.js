import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

const times = [
  60000, // minute
  3600000, // hour
  86400000, // day
  604800000, // week
  2629800000, // month
  31557600000, // year
];

const past = (value, units) => (`${value} ${units} ago`);

past.f = 'just now';

const singleValue = time => (time === 'hour' ? 'an' : 'a');

let thisUserData = {};
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const getRelativeTime = (time) => {
  const now = new Date();
  const diff = now.getTime() - time.getTime();
  let i = 0;
  let units;
  let value;
  const iMax = times.length;
  for (; i < iMax; i += 1) {
    value = times[i];
    const prev = times[i - 1];
    if (diff < value) {
      switch (i) {
        case 0:
          return past.f;
        case 1:
          units = 'minute';
          break;
        case 2:
          units = 'hour';
          break;
        case 3:
          units = 'day';
          break;
        case 4:
          units = 'week';
          break;
        case 5:
          units = 'month';
          break;
        default:
          break;
      }
      value = Math.floor(diff / prev);
      break;
    } else if (i === 5) {
      units = 'year';
      value = Math.floor(diff / times[i]);
    }
  }
  return value === 1 ? past(singleValue(value), units) : past(value, `${units}s`);
};

export const parseAndFindURLs = (summary) => {
  // Can only add one link per event description using this method
  const re = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  let url = summary ? summary.match(re) : '';
  let link = ''; // in event url does not start with https://
  if (url) {
    url = url[0].trim();
    link = url;
    const prefix = 'https://';
    if (url.substr(0, prefix.length) !== prefix) { link = prefix + link; }
  }
  if (url !== '') {
    const text = summary.split(url);
    return ([text[0], link, text[1]]);
  }
  return ([summary, '', '']);
};


export const saveToken = (token) => {
  AsyncStorage.setItem('token', token);
  const user = firebase.auth().currentUser;
  if (user && user._user) {
    const { _user: { uid } } = user;
    const userRef = firebase.firestore().collection('users').doc(uid);
    userRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const userData = snapshot.data();
          const currentTokens = userData.tokens;
          if (!currentTokens || !currentTokens.includes(token)) {
            userRef.update({
              tokens: firebase.firestore.FieldValue.arrayUnion(token)
            });
          }
        }
      }).catch(e => console.log(e));
  }
};

export const signOut = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    const user = firebase.auth().currentUser;
    if (user && user._user) {
      const { _user: { uid } } = user;

      const userRef = firebase.firestore().collection('users').doc(uid);
      try {
        const snapshot = await userRef.get();
        if (snapshot.exists) {
          const userData = snapshot.data();
          const currentTokens = userData.tokens;
          if (currentTokens && currentTokens.includes(token)) {
            await userRef.update({
              tokens: firebase.firestore.FieldValue.arrayRemove(token)
            });
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    AsyncStorage.removeItem('token');
  }
  firebase.notifications().setBadge(0);
  firebase.auth().signOut();
};

export const clamp = (value, min, max) => (min < max
  ? (value < min ? min : value > max ? max : value)
  : (value < max ? max : value > min ? min : value));

export const setCurrentUserData = (data) => {
  thisUserData = data;
};

export const updateCurrentUserData = (data) => {
  thisUserData = Object.assign(thisUserData, data);
};

export const getCurrentUserData = () => thisUserData;
