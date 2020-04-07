import React, { Component } from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import firebase from 'react-native-firebase';
import { Screen } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu } from '../../icons';

import AllRides from './allRides';
import MyRide from './myRide';
import RidesSignup from './rideSignup';

export default class RidesTab extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'RIDES',
    headerLeft: (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: (
      <View />
    ),
    headerStyle: {
      backgroundColor: '#fff',
      ...Platform.select({
        ios: { marginTop: 0, paddingTop: 20 },
        android: {
          elevation: 0,
          height: 43,
        },
      }),
      borderBottomWidth: 1,
      borderBottomColor: '#fff',
    },
    headerTitleStyle: {
      fontWeight: 'normal',
      alignSelf: 'center',
      fontFamily: 'Akkurat',
      fontSize: 15,
      color: '#222222',
      paddingTop: 4,
      lineHeight: 14,
      textAlign: 'center',
      flex: 1,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRidesUp: false
    };
    this.ref = firebase.firestore().collection('rides').doc('current_rides').collection('cars');
    this.unsubscribe = null;
  }

  componentDidMount() { this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate); }

  componentWillUnmount() { this.unsubscribe(); }

  onCollectionUpdate = (querySnapshot) => {
    if (querySnapshot.empty) {
      this.setState({
        isRidesUp: false,
        loading: false,
      });
    } else {
      this.setState({
        isRidesUp: true,
        loading: false
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const { isRidesUp, loading } = this.state;
    if (loading) {
      return (
        <Screen>
          <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
        </Screen>
      );
    }
    if (!isRidesUp) {
      return (
        <RidesSignup />
      );
    }
    return (
      <ScrollableTabView
        tabBarBackgroundColor="#fff"
        tabBarTextStyle={{
          paddingTop: 10,
          fontFamily: 'Akkurat',
          fontSize: 13,
          color: '#222222',
          lineHeight: 15
        }}
        tabBarUnderlineStyle={{ height: 2, backgroundColor: '#539ab9' }}
      >
        <MyRide navigation={navigation} tabLabel="My Ride" />
        <AllRides tabLabel="All Rides" />
        <RidesSignup tabLabel="Signup" />
      </ScrollableTabView>
    );
  }
}
