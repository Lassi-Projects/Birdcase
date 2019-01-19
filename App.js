/**Birdwatching project for CGI Future Talent
*by Lassi Valtari*/

import React, {Component} from 'react';
import {Alert, Button, FlatList, ListView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';

/**
*Styles of the components:
*Main menu in 3 parts: title, list and add-button
*Add form: TODO
*/
const styles = StyleSheet.create ({
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
    flex:1,
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
    var dataSource = new ListView.DataSource({rowHasChanged:(rowSt, rowNd) => rowSt.guid != rowNd.guid});
    
    this.state = {
      dataSource: dataSource.cloneWithRows(observationArray),
      loading: false,
    }
  }

  componentDidMount() {
    this.getTheData(function(json) {
      observationArray = json;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(observationArray),
        loading: false,
      });
    }.bind(this));
  }

  getTheData(callback) {
    callback(
      [{
        name: 'Testi Tikka',
        rarity: 'Common',
        notes: 'None',
      },
      {
        name: 'Testi2 Tikka',
        rarity: 'Common',
        notes: 'None',
      }]
    )
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <View>
        <Text numberOfLines={1}>{rowData.name} | {rowData.rarity} | {rowData.notes}</Text>
      </View>
    );
  }

  render() {

    var currentList =(this.state.loading)?<View/>:<ListView
      dataSource = {this.state.dataSource}
      renderRow= {this.renderRow.bind(this)
      }></ListView>

    return (
      /**Home screen uses mainmenu styles */
      <View style={styles.mainmenu}>
        {/**List of all the birds*/}
        <View id="BirdsList" style={styles._birdListBackground}>
          <ScrollView>
            {currentList}
          </ScrollView>
        </View>
        {/*Button to add new bird in the list*/}
        <View id="AddNewButton" style={styles._addButton}>
          <Button
          color='#a7364f'
          onPress={() => this.props.navigation.navigate('AddForm')}
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

  constructor(props){
    super(props)

    this.state = {
      name: 'None',
      rarity: 'Common',
      notes: 'None',
    }
  }

  render() {
    return (
      <View>
        <View>
          <TextInput
            style={{height: 40}}
            placeholder = "Name of the species"
          ></TextInput>
        </View>
        <View id="AddNewButton" style={styles._addButton}>
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
          }
          observationArray.push(newObs)
          //Go back to main
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
