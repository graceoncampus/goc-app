import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {
  TouchableOpacity, ActivityIndicator, Text, FlatList, View
} from 'react-native';
import SearchBar from 'react-native-search-bar';
import firebase from 'react-native-firebase';

import globalStyles, { headerStyles } from '../theme';
import Player from '../components/Player';
import { Menu } from '../icons';
import { Screen } from '../components';
import store from '../store';

export default class Sermons extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'SERMONS',
    headerLeft: (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: <View />,
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

  constructor() {
    super();
    this.currentPage = 1;
    this.pageSize = 25;
    this.ref = firebase
      .firestore()
      .collection('sermons')
      .orderBy('date', 'desc');
    this.state = {
      loading: true,
      feed: [],
      searchText: '',
      searchResults: [],
      ...store.getState()
    };
  }

  componentDidMount() {
    this.loadPage();
    TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
      ]
    });
    this.unsubscribe = store.subscribe((state) => {
      this.setState({
        ...state
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  loadPage = () => {
    this.ref
      .limit(this.pageSize * this.currentPage)
      .get()
      .then((querySnapshot) => {
        const sermons = [];
        querySnapshot.forEach((doc) => {
          const {
            URI: url, title, speaker: artist, passage, date
          } = doc.data();
          sermons.push({
            key: doc.id,
            id: doc.id,
            url,
            title,
            artist,
            passage,
            date,
            artwork: 'https://res.cloudinary.com/goc/image/upload/v1552010238/icon_eryqac.png'
          });
        });
        this.currentPage += 1;
        TrackPlayer.add(sermons).then(() => this.setState({
          loading: false,
          feed: sermons
        }));
      });
  };

  togglePlayback = async () => {
    const { playbackState } = store.getState();
    if (playbackState === 'playing' || playbackState === 3) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  play = async (id) => {
    await TrackPlayer.skip(id);
    TrackPlayer.play();
  };

  skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
      TrackPlayer.play();
    } catch (_) {
      TrackPlayer.reset();
    }
  };

  skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      TrackPlayer.play();
    } catch (err) {
      console.log(err);
    }
  };

  updateSearch = async searchText => {
    this.setState(prevState => ({
      searchText: searchText,
      searchResults: prevState.feed.filter(({ title, artist, passage }) => title.toLowerCase().includes(searchText.toLowerCase()) || artist.toLowerCase().includes(searchText.toLowerCase()) || passage.toLowerCase().includes(searchText.toLowerCase())),
    }));
  };

  renderSermon = (row) => {
    const sermon = row.item;
    const date = new Date(sermon.date.toDate());
    return (
      <TouchableOpacity onPress={() => this.play(sermon.id)}>
        <View style={[{ paddingBottom: 15 }, globalStyles.row]}>
          <View style={[globalStyles.vertical]}>
            <View style={[globalStyles.horizontal, globalStyles.hvCenter]}>
              <View style={globalStyles.vertical}>
                <Text style={[globalStyles.small2]}>{sermon.title}</Text>
                {sermon.date && (
                  <Text style={[globalStyles.caption, { marginTop: 4 , fontSize: 13}]}>
                    {`${date.getMonth()}/${date.getDate()}/${date.getFullYear()} | ${
                      sermon.passage
                    } | ${sermon.artist}`}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation } = this.props;
    const { loading, feed, searchText, searchResults } = this.state;
    if (!loading) {
      return (
        <Screen>
          <SearchBar
            ref="searchBar"
            placeholder="Search sermon title, speaker, or verse"
            onChangeText={this.updateSearch}
          />
          <FlatList
            data={searchText ? searchResults : feed}
            renderItem={this.renderSermon}
            onEndReached={this.loadPage}
          />
          <Player navigation={navigation} onTogglePlayback={this.togglePlayback} />
        </Screen>
      );
    }
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }
}
