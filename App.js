/**Birdwatching project for CGI Future Talent
 *by Lassi Valtari*/

import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, FlatList, ScrollView, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';
import { ListItem } from "react-native-elements";
import Dialog from "react-native-dialog";


//Array of observations in Home screen Bird list
var observationArray = new Array();

/**
 * Home screen
 */
class HomeScreen extends React.Component {

  //Navigation bar text
  static navigationOptions = {
    title: 'BIRDCASE',
  };

  //CONSTRUCTOR for HomeScreen
  constructor(props) {
    super(props);

    this.state = {
      //Data contains items rendered in the Bird list
      data: [],
      //Tracks if screen is being refreshed
      refreshing: false,
      //Seed to ensure state change is noticed by refresher
      seed: 0,
    };
  }

  async getKeys() {
    await AsyncStorage.getAllKeys().then((foundKeys) => {
      return foundKeys;
    })
  }

async getItem(key) {
  await AsyncStorage.getItem(key).then((item) => {
    try
    {
      observation = JSON.parse(item);
      Alert.alert(observation.toString());
      var name = observation.rarity;
      observationArray.push(observation);
    }
    catch(error)
    {
      console.log("not valid object");
    }
  })
}

  //Upon entering the HomeScreen (starting App)
  //saved Observation are to be loaded
  componentDidMount() {

    let keys = this.getKeys();

    for(key in keys) {
      this.getItem(key);
    }

    this.setState({
      //observations reference added to data key
      data: observationArray,
    })
  }


  //Refreshing HomeScreen
  onRefresh = () => {

    let keys = this.getKeys();

    for(key in keys) {
      this.getItem(key);
    }

    this.setState({
      //Inform we're refreshing
      refreshing: true,
      //Seed to make sure refreshing works?
      //[TODO]:[Figure out why this is needed?]
      seed: this.state.seed + 1,
      
    },
      //After refreshing inform it's done.
      //[TODO]:[Why does this need to be separate?]
      function () {
        this.setState({
          refreshing: false,
        });
      });
  }

  //Actions when navigating back to HomeScreen
  handleOnNavigateBack = () => {
    //Refresh screen
    this.onRefresh();
  }

  //HomeScreen RENDER
  render() {

    //BIRDLIST - Start
    //In separate variable to make things cleaner
    var currentList = (this.state.loading) ? <View /> :
      //If caught middle of loading empty View is shown, otherwise Flatlist:
      <FlatList
        //Every observations is given a key to identify
        //Here I used time in milliseconds [TODO]:[Throws warning -> fix]
        keyExtractor={item => { item }}
        //Flat list uses ObservationsList behind data-key
        data={this.state.data}

        //Refresh options
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}

        //Actually handling items in the BirdList
        renderItem={({ item: observation }) => (
          <ListItem
            //Name of the Bird Species
            title={<View style={{ flex: 1, height: 30 }}>
              <Text style={{ fontSize: 20 }}>
                {observation.name}
              </Text>
            </View>}
            //Date, Rarity and Notes
            subtitle={<View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {/**Date and time */}
                <View style={{ flex: 1 }}>
                  <Text>
                    {observation.time}
                  </Text>
                </View>
                {/**Rarity */}
                <View style={{ flex: 1 }}>
                  <Text>
                    {observation.rarity}
                  </Text>
                </View>
                {/**Notes */}
              </View>
              <View style={{ flex: 2 }}>
                <Text>
                  {observation.notes}
                </Text>
              </View>
            </View>
            }
          />
        )}
      ></FlatList>
    //BIRDLIST - End

    return (

      /**HomeScreen uses homescreen styles */
      <View style={{ flex: 1 }}>
        {/**List of all the birds*/}
        <View style={{ flex: 1, backgroundColor: 'whitesmoke', }}>
          <ScrollView>
            {/**This is where BIRDLIST resides*/}
            {currentList}
          </ScrollView>
        </View>
        {/*Button to add new bird in the list*/}
        <View style={{ height: 35, }}>
          <Button
            title="+ ADD NEW"
            color='#a7364f'
            //Navigates to add form Screen
            onPress={() => this.props.navigation.navigate('AddForm',
              { onNavigateBack: this.handleOnNavigateBack })}
          />
        </View>
      </View>
    );
  }
}

/**
 * New observation form
 */
class AddFormScreen extends React.Component {
  //Navigation bar text
  static navigationOptions = {
    title: 'Add new observation',
  };

  //CONSTRUCTOR for AddFormScreen
  constructor(props) {
    super(props)

    this.state = {
      //Name, rarity and Notes hold info entered by user.
      //At save they're added to new observation
      name: 'None',
      rarity: 'Common',
      notes: 'None',
      //Rarity is entered via Dialog
      //This determines whethever it will be visible
      rarityDialogVisible: false,
      //State of Refreshing
      refreshing: false,
      //Seed to mix things up
      seed: 0,
    }

  }

  //Refreshing AddFormScreen basicly same as in HomeScreen
  onRefresh = () => {
    this.setState({
      //Inform we're refreshing
      refreshing: true,
      seed: this.state.seed + 1,
    },
      //And that we're out [TODO]:[Check HomeScreen -> onRefresh()]
      function () {
        this.setState({
          refreshing: false,
        })
      }
    );
  };

  createKey() {
    //Create 9 digits long integer
    var newKey = Math.floor(Math.random() * 10 ** 9);

    //Compare to each existing key. Create new if same
    observationArray.forEach((observation) => {
      if (parseInt(observation.key) == newKey) {
        newKey = createKey();
      }
    });

    //Return new key
    return newKey.toString();
  }

  //AddFormScreen RENDER
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {/**Inputs are here */}
        <View style={{ flex: 1, padding: 40, paddingTop: 20, justifyContent: 'space-between' }}>
          <ScrollView >
            {/**NAME of the Species */}
            <TextInput
              onChangeText={(text) => { this.setState({ name: text }) }}
              style={{ height: 40, borderBottomWidth: 1, borderColor: 'grey' }}
              placeholder="Name of the species"
            ></TextInput>

            {/**Space around button */}
            <View style={{ height: 10 }} />

            {/**RARITY selection button */}
            <Button
              title="Select rarity"
              padding={5}
              color='#a7364f'
              /**on press show dialog */
              onPress={() => {
                this.setState({
                  rarityDialogVisible: true,
                })
              }}
            ></Button>

            {/**Space around button */}
            <View style={{ height: 10 }} />

            {/**DIALOG to select rarity */}
            <Dialog.Container
              visible={this.state.rarityDialogVisible}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}>
              <Dialog.Title>Choose observation rarity:</Dialog.Title>

              {/**Three buttons to choose RARITY */}
              {/**COMMON */}
              <Dialog.Button label="Common"
                onPress={() => {
                  this.setState({
                    rarity: 'Common',
                    rarityDialogVisible: false,
                  })
                }} />
              {/**RARE */}
              <Dialog.Button label="Rare"
                onPress={() => {
                  this.setState({
                    rarity: 'Rare',
                    rarityDialogVisible: false,
                  })
                }} />
              {/**EXTREMELY RARE */}
              <Dialog.Button label="Extremely rare"
                onPress={() => {
                  this.setState({
                    rarity: 'Extremely rare',
                    rarityDialogVisible: false,
                  })
                }} />

            </Dialog.Container>

            {/**NOTES writing section */}
            <TextInput
              onChangeText={(text) => { this.setState({ notes: text }) }}
              multiline={true}
              style={{ borderBottomWidth: 1, borderColor: 'grey' }}
              placeholder="Notes"
            ></TextInput>

          </ScrollView>
        </View>

        {/**Save button */}
        <View style={{ height: 35 }}>
          <Button
            color='#a7364f'
            title="SAVE"

            /**Save clicked*/
            onPress={() => {
              this.setState({
                seed: this.state.seed + 1,
              });
              let thisMoment = new Date();
              let thisTime = thisMoment.getHours() + ":"
                + thisMoment.getMinutes() + " "
                + thisMoment.toLocaleDateString();
              let obsKey = this.createKey();
              //Add observation to the Array
              var newObs = {
                name: this.state.name,
                rarity: this.state.rarity,
                notes: this.state.notes,
                timeAsInt: thisMoment.getTime().toString(),
                time: thisTime,
                key: obsKey,
              }
              //Save to file and BirdList before quiting
              AsyncStorage.setItem(newObs.key, JSON.stringify(newObs));
              observationArray.push(newObs)
              //Go back to main and call onNavigateBack to refresh list
              this.props.navigation.state.params.onNavigateBack()
              this.props.navigation.goBack()
            }}
          />
        </View>
      </View>
    );
  }
}

/**
 * App Navigator
 * takes care of moving between screens
 */
const AppNavigator = createStackNavigator(
  {
    /**Home screen address */
    Home: HomeScreen,
    /**New observation form address */
    AddForm: AddFormScreen,
  },
  {
    /**App starts on Home screen */
    initialRouteName: "Home",

    /**Header styles */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#336419',
      },
      headerTintColor: 'whitesmoke',
    },
  }
);
const AppContainer = createAppContainer(AppNavigator);

//App component to run the show [start app]
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
