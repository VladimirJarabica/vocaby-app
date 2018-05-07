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

  // TODO: move to services
  signInWithGoogleAsync = () =>
    Expo.Google.logInAsync({
      androidClientId: config.androidClientId,
      iosClientId: config.iosClientId,
      scopes: ["profile", "email"],
    });

  login = async () => {
    // const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await this.signInWithGoogleAsync();
      console.log("provider", result);

      if (result.type === "success") {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken,
          result.accessToken,
        );
        firebase
          .auth()
          .signInWithCredential(credential)
          .catch(error => {
            // Handle Errors here.
            console.log("error", error);
          });
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  logout = () => {
    firebase.auth().signOut();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.user && this.state.user.uid}</Text>
        <Button onPress={this.login} title="Login" />
        <Button onPress={this.logout} title="Logout" />
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
