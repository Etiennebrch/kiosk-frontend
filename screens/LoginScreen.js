import React, { useEffect, useCallback, useState } from "react";
import { connect } from "react-redux";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Button, ButtonText } from "../components/Buttons";
import { useForm } from "react-hook-form";
import { Input, Image } from "react-native-elements";

import { REACT_APP_IPSERVER } from "@env";

import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = (props) => {
  const [isLogin, setIsLogin] = useState(false),
    [signInErrorMessage, setSignInErrorMessage] = useState(false);
  const { handleSubmit, setValue } = useForm();
  const onSubmit = useCallback(async (formData) => {
// console.log(formData);
    if (formData.email.length > 0 && formData.password.length > 0) {
      let user = await fetch(`http://${REACT_APP_IPSERVER}/users/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${formData.email}&password=${formData.password}`,
      });
      let res = await user.json();
      if (res.result) {
// console.log("found");
        setIsLogin(true);
        props.storeUser(res.user);
        AsyncStorage.setItem("user", JSON.stringify(res.user));
        props.navigation.navigate("TabNavigation");
      } else {
// console.log("not found");
        setSignInErrorMessage(res.message);
      }
    } else {
      let error = [];
      if (signInEmail.length === 0) {
        error.push("email");
      }
      if (signInPassword.length === 0) {
        error.push("password");
      }
      setSignInErrorMessage(error.join(", ") + " missing");
    }
  }, []);
  const onChangeField = useCallback(
    (name) => (text) => {
      setValue(name, text);
    },
    []
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "space-between",
    },
    logoContainer: {
      alignItems: "center",
    },
    buttonContainer: {
      alignItems: "center",
      marginBottom: 33,
    },
    logo: {
      width: 200,
      height: 34.9,
      marginTop: 114,
    },
    form: {
      alignItems: "center",
      marginHorizontal: 45,
    },
    input: {
      borderBottomColor: "#FAF0E6",
    },
    inputText: {
      color: "#fff",
    },
    label: {
      color: "#fff",
      fontWeight: "normal",
    },
    text: {
      color: "white",
      fontSize: 22,
      lineHeight: 32,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 60,
    },
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background-login.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo-light-2.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.text}>Connexion</Text>
          <Input
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="Votre email pro"
            onChangeText={onChangeField("email")}
            inputStyle={styles.inputText}
            label="Adresse email pro"
            inputContainerStyle={styles.input}
            labelStyle={styles.label}
            placeholderTextColor="#DCDCDC"
          />
          <Input
            secureTextEntry
            autoCompleteType="password"
            placeholder="Entrez votre mot de passe"
            onChangeText={onChangeField("password")}
            label="Mot de passe"
            inputStyle={styles.inputText}
            inputContainerStyle={styles.input}
            labelStyle={styles.label}
            placeholderTextColor="#DCDCDC"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            size="md"
            color="primary"
            title="Connexion"
            onPress={handleSubmit(onSubmit)}
          />
          <ButtonText
            color="light"
            title="Annuler"
            onPress={() => props.navigation.navigate("Bienvenue")}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    storeUser: function (user) {
      dispatch({ type: "storeUser", user });
    },
  };
}

export default connect(null, mapDispatchToProps)(LoginScreen);
