import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
} from "react-native";
// Import des composants Button customisés
import { Button, ButtonText } from "../components/Buttons";
// Import du Carousel
import CarouselCards from "../components/carousel/CarouselCards";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { REACT_APP_IPSERVER } from "@env";

const WelcomeScreen = (props) => {
  // variables gestion affichage responsive :
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const isFocused = useIsFocused();
  if (isFocused) {
    //console.log("props.user", props.user);
  }

  useEffect(() => {
    async function getUSerdata(userData) {
      let data = await fetch(`http://${REACT_APP_IPSERVER}/users/getUserData`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${userData.token}`,
      });
      let res = await data.json();
      // console.log("user", res.user);
      props.storeUser(res.user);
      props.navigation.navigate("TabNavigation");
    }

    AsyncStorage.getItem("user", function (error, data) {
      if (data) {
        var userData = JSON.parse(data);
        getUSerdata(userData);
      }
    });
  }, []);

  return (
    <ImageBackground
      source={require("../assets/welcomebackground2.png")}
      style={styles.container}
    >
      <Image
        source={require("../assets/logo-light-2.png")}
        style={styles.image}
      />

      <CarouselCards />

      <View style={{ alignItems: "center" }}>
        <Button
          style={{ marginBottom: 10 }}
          size="md"
          color="primary"
          title="S'inscrire"
          onPress={() =>
            props.navigation.navigate("Inscription", { clientType: "client" })
          }
        />
        <ButtonText
          color="light"
          title="Vous avez déjà un compte ?"
          onPress={() => props.navigation.navigate("Connexion")}
        />
        <Button
          style={{ marginTop: 30, marginBottom: 20 }}
          buttonStyle={styles.button}
          size="md"
          color="secondary"
          title="Je suis un prestataire"
          onPress={() =>
            props.navigation.navigate("Inscription", { clientType: "partner" })
          }
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  image: {
    width: 200,
    height: 34.9,
    marginTop: 114,
    alignSelf: "center",
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeUser: function (user) {
      dispatch({ type: "storeUser", user });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
