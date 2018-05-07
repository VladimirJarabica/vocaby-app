import React from "react";
import Expo from "expo";
import { StyleSheet, Text, View, Button } from "react-native";

import * as firebase from "firebase";

import config from "./config";

export default class App extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(user => {
      console.log("onAuthStateChanged", user);
      this.setState({
        user,
      });
    });
  }

  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: config.androidClientId,
        iosClientId: config.iosClientId,
        scopes: ["profile", "email"],
      });
      return result;

      // if (result.type === 'success') {
      //   return result.accessToken;
      // } else {
      //   return {cancelled: true};
      // }
    } catch (e) {
      return { error: e };
    }
  }

  login = async () => {
    // const provider = new firebase.auth.GoogleAuthProvider();
    const result = await this.signInWithGoogleAsync();
    console.log("provider", result);

    if (result.type === "success") {
      const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
      firebase.auth().signInWithCredential(credential).catch((error) => {
        // Handle Errors here.
        console.log("error", error)
      });
    }
    // firebase
    //   .auth()
    //   .signInWithPopup(provider)
    //   .then(result => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     var token = result.credential.accessToken;
    //     // The signed-in user info.
    //     this.setState({ user: result.user });
    //   });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.user && this.state.user.uid}</Text>
        <Text>Open up App.js to start working on your app!</Text>
        <Button onPress={this.login} title="Hi">
          Login
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
