/*Birdwatching project for CGI Future Talent
by Lassi Valtari*/

import React, {Component} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Text, View} from 'react-native';

/*
Styles of the components:
Main menu in 3 parts: title, list and add-button
Add form: TODO
*/
const styles = StyleSheet.create ({
  /*Main menu components*/
  mainmenu: {
    flex: 1,
  },

  //Title and it's container
  _appTitleContainer:{
    height: 50,
    alignItems: 'center',
    backgroundColor: '#336419',
    padding: (50 - 20)/2, 
  },
  _appTitle: {
    color: 'whitesmoke',
    fontSize: 20,
  },

  //List of Observations
  _birdList: {
    flex:1,
    backgroundColor: 'whitesmoke',
  },

  //Add button on the bottom of screen
  _addButton: {
    height: 35,
  },

  /*Add form components*/
  //TODO
})

/*Handles observation adding form as seperate class - TODO*/
class ObservationForm extends Component {
  render() {
    return (
      <View>
        <Text>"You're in form view!"</Text>
      </View>
    );
  }
}

/*Core app including main menu */
export default class App extends Component {
  _openForm() {
    Alert.alert('Creating form...');
  }

  render() {
    return (
      <View style={styles.mainmenu}>
        <View id="Title" style={styles._appTitleContainer}>
          <Text style={styles._appTitle}>BIRDCASE</Text>
        </View>
        <View id="BirdsList" style={styles._birdList}>
          <ScrollView>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
            <Text style={{fontSize: 30}}>List of birds here!</Text>
          </ScrollView>
        </View>
        <View id="AddNewButton" style={styles._addButton}>
          <Button
          color='#a7364f'
          onPress={this._openForm}
          title="+ ADD NEW"
          />
        </View>
      </View>
    );
  }
}
