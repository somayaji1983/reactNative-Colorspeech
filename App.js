
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Switch
} from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import {messages} from './config/constants';
import colorTiny from 'tinycolor2'

export default class ColorSpeech extends Component {

  constructor(props) {
      super();

      this.state = {
        results : [],
        speakState : 0,
        finalcolors : [],
        notifyUrl : null,
        switchvalue : false,
      }

     Voice.onSpeechStart = this.onSpeechStart.bind(this);
     Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
     Voice.onSpeechResults = this.onSpeechResults.bind(this);
     this.parseResults = this.parseResults.bind(this);
     this.sendData = this.sendData.bind(this);

  }

  componentDidMount(){
    //Tts.speak(messages.VOICE_MSG_WELCOME);
  }
  
  componentWillUnmount(){
    Voice.destroy().then(Voice.removeAllListeners);
    Tts.stop();
  }


  talkTheText() {
    Tts.speak(messages.VOICE_MSG_WELCOME);
  }

  sendData() {

    var finalUrl = this.state.notifyUrl.concat(this.state.finalcolors);
    console.log(finalUrl)

    fetch(finalUrl,{
        method: 'GET',
        body: null,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log("response  ",response.status);

      }).catch((error) => {
        console.log("error  ",error);
        
      });
  }


  async _startRecognizing(input) {
    
    this.setState({
      results: [],
    });
    try {

      await Voice.start('en-IN');
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(input) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(input) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  //setting speaking on
  onSpeechStart(e){
      
    this.setState({
        speakState : 1
      });
  }

  //setting speaking off at the end
  onSpeechEnd(e){   
    this.setState({
      speakState : 0
    }); 
    Voice.stop();
  }

  //function will result
  onSpeechResults(e){
    this.setState ({
      results : e.value
    });
    
    this.parseResults();

  }

  parseResults(params){
    var localcolors=[];
    this.state.results[0].split(' ').map( (item,index) => {
      var colour = colorTiny(item);
      if(colour.isValid())
      {
        localcolors.push(item.toLowerCase());
      }
    });

    this.setState({
      finalcolors : localcolors
    });

    if(this.state.switchvalue){
      this.sendData();
    }
  }

  render() {
      return (
          <View style={styles.container}>
              <View style={styles.TitleContainer}>
                <Text style={styles.TileText}> * Say Your Color * </Text>
              </View>
              <View style={styles.headerContainer}>
                <Button style={styles.headerButton} title="Speak" onPress={this._startRecognizing.bind(this)}/>
                <View style={styles.headerMessage}>
                  <Text style={styles.headerMessageText}>{this.state.results[0]}</Text>
                </View>
              </View>
              <View style={styles.resultsContainer}>
                {this.state.finalcolors.map( (itemcolor,index) => {
                    return(
                      <View key={index} style={ [styles.resultsContainer,{backgroundColor : itemcolor }]}></View>
                    );
                  })}
              </View>
              <View style={styles.footerContainer}>
                  <Switch value={this.state.switchvalue} onValueChange = {(value) => {
                    this.setState({
                      switchvalue : value,
                      notifyUrl : "http://192.168.1.106:8080/color/"
                    });
                  }} />
                  
                  <TextInput style={styles.footerUrl}
                      value={this.state.notifyUrl}
                      placeholder="Enter LED Notification URL"
                      onChangeText={(text) => this.setState({notifyUrl : text})}
                      editable={this.state.switchvalue}
                  />
              </View>
          </View>
      );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#d6d7da',
  },
  TitleContainer : {
    flex: 1,
    backgroundColor : "white",
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#d6d7da',
  },
  TileText : {
    color : 'blue',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  headerContainer : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#d6d7da',
  },
  headerButton: {
    flex: 2,
  },
  headerMessage: {
    flex: 10,
    alignItems: 'center',
    justifyContent : 'center'
  },
  headerMessageText : {
    fontSize: 12,
    fontFamily: 'serif',
  },
  resultsContainer: {
    flex: 10,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#d6d7da',
  },
  footerContainer: {
    flex: 1.5,
    flexDirection: 'row',
    //backgroundColor: '#ffc04d',
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#d6d7da',
  },
  footerSwitch: {
    flex: 1,
  },
  footerUrl: {
    flex: 10,
  },

});