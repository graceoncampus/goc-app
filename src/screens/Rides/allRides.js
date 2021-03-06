import React, { Component, Fragment } from 'react';
import {
  TouchableOpacity, View, ActivityIndicator, ScrollView, FlatList
} from 'react-native';
import firebase from 'react-native-firebase';
import { Screen, Text, Divider } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu } from '../../icons';

function renderRide(ride) {
  const { car } = ride.item;
  const riderNames = car.riders.map(c => c.name);
  return (
    <Fragment>
      <View
        style={[
          globalStyles.horizontal,
          globalStyles.vhStart,
          globalStyles.spaceBetween,
          { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#fff', borderWidth: 0, shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOpacity: 0.4, shadowOffset: { height: 2.5 }, shadowRadius: 2, borderRadius: 8, marginBottom: 12, marginHorizontal: 8,
          ...Platform.select({ android: { elevation: 3, },})
         }]
        }
        key={ride.key}
      >
        <Text styleName="paragraph bold" style={{ textAlign: 'right' }}>{car.driver.name}</Text>
        <Text styleName="paragraph" style={{ textAlign: 'right' }}>{riderNames.join('\n')}</Text>
      </View>
    </Fragment>
  );
}
export default class AllRides extends Component {
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'AllRides',
    }),
    title: 'ALL RIDES',
    headerLeft: (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: (
      <View />
    ),
    ...headerStyles,
  })

  constructor(props) {
    super(props);
    this.state = {
      rides: [],
      loading: true,
      isRidesUp: null,
    };
    this.ref = firebase.firestore().collection('rides').doc('current_rides').collection('cars');
    this.unsubscribe = null;
  }

  componentDidMount() { this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate); }

  componentWillUnmount() { this.unsubscribe(); }

  onCollectionUpdate = (querySnapshot) => {
    const rides = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((ride) => {
        const car = ride.data();
        rides.push({
          key: ride.id,
          car
        });
      });
      const idx = rides.findIndex(r => r.car.driver.name === 'IN PROGRESS');
      if (idx > -1) rides.splice(0, 0, rides.splice(idx, 1)[0]);
      this.setState({
        rides,
        loading: false,
        isRidesUp: true,
      });
    } else {
      this.setState({
        isRidesUp: false,
        loading: false,
      });
    }
  }

  render() {
    const { loading, isRidesUp, rides } = this.state;
    if (!loading && isRidesUp) {
      return (
        <Screen safeViewDisabled>
          <Divider type="sectionHeader" style={{ paddingHorizontal: 15, paddingBottom: 5, backgroundColor: '#f9f9f9' }}>
            <Text styleName="subtitle">Driver</Text>
            <Text styleName="subtitle">Riders</Text>
          </Divider>
          <ScrollView style={{backgroundColor: '#f9f9f9', paddingTop: 5}}>
            <FlatList data={rides} renderItem={renderRide} style={{ paddingBottom: 30 }} />
          </ScrollView>
        </Screen>
      );
    }
    if (!loading && !isRidesUp) {
      return (
        <Screen>
          <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1, marginTop: -50 }]}>
            <Text styleName="center subtitle" style={{ paddingHorizontal: 50 }}>Rides for this Sunday are not up yet!</Text>
          </View>
        </Screen>
      );
    }
    return (
      <Screen>
        <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1 }]}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }
}
