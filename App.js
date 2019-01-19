/**Birdwatching project for CGI Future Talent
*by Lassi Valtari*/

import React, { Component } from 'react';
import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';
import { List, ListItem } from "react-native-elements";
import Dialog from "react-native-dialog";

/**
*Styles of the components:
*Main menu in 3 parts: title, list and add-button
*Add form: TODO
*/
const styles = StyleSheet.create({
  /*Main menu components*/
  mainmenu: {
    flex: 1,
  },

  //Header styles in const AppNavigator

  _appTitle: {
    color: 'whitesmoke',
    fontSize: 20,
  },

  //List of Observations
  _birdListBackground: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  _birdList: {

  },

  //Add button on the bottom of screen
  _addButton: {
    height: 35,
  },

  /*Add form components*/
  //TODO
})

//Array of ongoing observations
var observationArray = new Array();

/**Home screen*/
class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'BIRDCASE',
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      refreshing: false,
      loading: false,
      seed: 0,
    };
  }

  sortObservations(list, by) {
    var sortedList = new Array();
    if(by == 'Date') {
      while(list.length > 0) {
        var index = 0;
        for(var i = 0; i < list.length; ++i) {
          if(list[i].time.getTime() > list[index].time.getTime()) {
            list[index] = list[i];
            index = i;
          }
        }
        sortedList.push(list[index]);
        list.splice(index, 1)
      }
    };
    list = sortedList;
    return list;
  }

  componentDidMount() {
    this.getTheData(function (json) {
      observationArray = json;
      observationArray = this.sortObservations(observationArray, 'Date'),
      this.setState({
        data: observationArray,
        refreshing: false,
        loading: false,
      });
    }.bind(this));
  }

  getTheData(callback) {
    this.setState({
      refreshing: false,
    });
    callback(
      [
        {
          name: 'Birdie',
          rarity: 'Common',
          notes: 'No notes',
          time: new Date(),
        }
      ]
    );
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      seed: this.state.seed + 1,
    },
      function () {
        this.setState({
          refreshing: false,
        })
      }
    );
  };

  handleOnNavigateBack = () => {
    this.onRefresh()
  }

  render() {

    var currentList = (this.state.loading) ? <View /> :
      <FlatList
        keyExtractor={observation => { observation.time.getTime().toString() }}
        data={this.state.data}
        refreshing={this.state.refreshing}

        onRefresh={this.onRefresh}

        renderItem={({ item: observation }) => (
          <ListItem
            component={View}
            title={<View style={{ flex: 1, height: 30 }}>
              <View style={{ flex: 1 }}><Text style={{ fontSize: 20 }}>{observation.name}</Text></View>

            </View>}
            subtitle={<View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}><Text>{observation.time.getHours() + ":"
                  + observation.time.getMinutes() + " "
                  + observation.time.toLocaleDateString()}</Text></View>
                <View style={{ flex: 1 }}><Text>{observation.rarity}</Text></View>
              </View>
              <View style={{ flex: 2 }}><Text>{observation.notes}</Text></View>
            </View>

            }
          />
        )}
      ></FlatList>

    return (

      /**Home screen uses mainmenu styles */
      <View style={styles.mainmenu}>
        {/**List of all the birds*/}
        <View style={styles._birdListBackground}>
          <ScrollView>
            {currentList}
          </ScrollView>
        </View>
        {/*Button to add new bird in the list*/}
        <View style={styles._addButton}>
          <Button
            color='#a7364f'
            onPress={() => this.props.navigation.navigate('AddForm', { onNavigateBack: this.handleOnNavigateBack })}
            title="+ ADD NEW"
          />
        </View>
      </View>
    );
  }
}

/**Handles observation adding form as seperate class - TODO*/
class AddFormScreen extends React.Component {
  static navigationOptions = {
    title: 'Add new observation',
  };

  constructor(props) {
    super(props)

    this.state = {
      name: 'None',
      rarity: 'Common',
      notes: 'None',
      rarityDialogVisible: false,
      refreshing: false,
      seed: 0,
    }

  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      seed: this.state.seed + 1,
    },
      function () {
        this.setState({
          refreshing: false,
        })
      }
    );
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 1, padding: 40, paddingTop: 20, justifyContent: 'space-between'}}>
          <ScrollView >
            <TextInput
              onChangeText={(text) => { this.setState({ name: text }) }}
              style={{ height: 40, borderBottomWidth: 1, borderColor: 'grey' }}
              placeholder="Name of the species"
            ></TextInput>
            <View style={{height: 10}}/>
            <Button
              title="Select rarity"
              padding={5}
              color='#a7364f'
              onPress={() => {this.setState({
                rarityDialogVisible: true,
              })}}
            ></Button>
            <View style={{height: 10}}/>
            <Dialog.Container 
              visible={this.state.rarityDialogVisible}
              refreshing = {this.state.refreshing}
              onRefresh={this.onRefresh}>
              <Dialog.Title>Choose observation rarity:</Dialog.Title>
              <Dialog.Button label="Common"
                onPress={() => {
                  this.setState({
                    rarity: 'Common',
                    rarityDialogVisible: false,
                  })
                }} />
              <Dialog.Button label="Rare"
                onPress={() => {
                  this.setState({
                    rarity: 'Rare',
                    rarityDialogVisible: false,
                  })
                }} />
              <Dialog.Button label="Extremely rare"
                onPress={() => {
                  this.setState({
                    rarity: 'Extremely rare',
                    rarityDialogVisible: false,
                  })
                }} />
            </Dialog.Container>
            <TextInput
              onChangeText={(text) => { this.setState({ notes: text }) }}
              multiline={true}
              style={{ borderBottomWidth: 1, borderColor: 'grey' }}
              placeholder="Notes"
            ></TextInput>
          </ScrollView>
        </View>
        <View style={styles._addButton}>
          {/**Save button */}
          <Button
            color='#a7364f'

            /**Save clicked*/
            onPress={() => {
              //Add observation to the Array
              newObs = {
                name: this.state.name,
                rarity: this.state.rarity,
                notes: this.state.notes,
                time: new Date(),
              }
              observationArray.push(newObs)
              //Go back to main
              this.props.navigation.state.params.onNavigateBack()
              this.props.navigation.goBack()
            }}
            title="SAVE"
          />
        </View>
      </View>
    );
  }
}

/**App Navigator - takes care of moving between screens */
const AppNavigator = createStackNavigator(
  {
    /**Home screen address */
    Home: HomeScreen,
    /**Add form screen address */
    AddForm: AddFormScreen,
  },
  {
    /**App starts on Home page */
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

/**App component to run the show [start app]*/
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
