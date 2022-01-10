import { REACT_APP_IPSERVER } from "@env"; // mettre à la place de notre url d'ip avec http:// devant = varibale d'environnement
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Image, ListItem, Overlay } from "react-native-elements";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

import Text from "../components/Text";
import { ButtonText, Button } from "../components/Buttons";
import { HeaderBar } from "../components/Header";
import OfferCardLight from "../components/OfferCardLight";

import LottieView from "lottie-react-native";
import * as ImagePicker from "expo-image-picker";

const CompanyScreen = (props) => {
  // ?????
  const animation = useRef(null);
  // variables de display :
  var displayCieImg;
  var displayDescCie;
  var displayLabels;
  var displayRatings;
  var displayOffers;
  // états infos Cie :
  const [company, setCompany] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [companyId, setCompanyId] = useState(
    props.route.params && props.route.params.companyId
      ? props.route.params.companyId
      : null
  );
  const [token, setToken] = useState("");
  const [image, setImage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  // état labels :
  const [labels, setLabels] = useState([]);
  // états overlay :
  const [visible, setVisible] = useState(false);
  const [visibleLabel, setVisibleLabel] = useState(false);
  const [inputOverlay, setInputOverlay] = useState("");
  const [valueToChange, setValueToChange] = useState(null);

  //console.log("ratings", ratings);
  // useEffect d'initialisation de la page Company :
  useEffect(() => {
    // DANS USE : fonction chargement des infos de la compagnie loggée :
    async function loadDataCie() {
      // appel route put pour modifier données company
      var rawDataCie = await fetch(
        `http://${REACT_APP_IPSERVER}/companies/${companyId}/${props.user.token}`
      ); // (`adresseIPserveur/route appelée/req.params?req.query`)
      var dataCie = await rawDataCie.json();
      // console.log("dataCie", dataCie);
      if (dataCie.result) {
        setCompany(dataCie.company); // set état company avec toutes data
        setRatings(dataCie.ratings); // set état ratings avec toutes data
        setImage(dataCie.company.companyImage);
        setToken(dataCie.company.token);
      }
    }
    loadDataCie();

    // DANS USE : fonction chargement des labels à choisir :
    async function loadDataLabels() {
      // appel route get pour récupérer données labels DB
      var rawDataLabels = await fetch(
        `http://${REACT_APP_IPSERVER}/companies/labels`
      );
      var dataLabels = await rawDataLabels.json();
      // console.log("rawDataLabels", rawDataLabels);
      // console.log("dataLabels.labels", dataLabels);
      setLabels(dataLabels.dataLabels);
      // console.log("dataLabels from Fetch", dataLabels.dataLabels);
      // console.log("état", labels);
    }
    loadDataLabels();

    // get like status in store user
    var user = props.user;
    var userLikes = user.favorites;
    setIsLiked(userLikes.some((e) => e.companyId && e.companyId === companyId));
  }, []);

  // Demande de l'autorisation d'accéder à la galerie d'image de l'utilisateur
  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return; // arrête la fonction
    }

    // on récupère l'uri de l'image et on la stocke dans un état
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.uri) {
      // url stockage tel
      setImage(pickerResult.uri);
      var data = new FormData();
      data.append("image", {
        uri: pickerResult.uri,
        type: "image/jpeg",
        name: "image_header.jpg",
      });
      // requête pour héberger l'image de profil
      let resUpload = await fetch(`http://${REACT_APP_IPSERVER}/image`, {
        method: "post",
        body: data,
      });
      resUpload = await resUpload.json();

      // on ajoute l'url de l'image héberger au body de la prochaine requête
      if (resUpload.result) {
        let body = `token=${token}=${resUpload.url}`; // url cloudinary
        const dataRaw = await fetch(
          `http://${REACT_APP_IPSERVER}/companies/${companyId}`,
          {
            // renvoie jsute result, donc true ou flase
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body,
          }
        );
        var res = await dataRaw.json(); // true ou false
        if (res.result) {
          setCompany(res.dataCieFull);
        }
      }
    }
  };

  // fonction gestion labels :
  var handleSubmitLabels = async (labelId) => {
    const dataRawLab = await fetch(
      `http://${REACT_APP_IPSERVER}/companies/${companyId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `labelId=${labelId}&token=${token}`,
      }
    );
    var resLab = await dataRawLab.json();
    // console.log("resLab", resLab);
    // console.log("resLab.dataCieFull.labels", resLab.dataCieFull.labels);
    setCompany(resLab.dataCieFull); // les labels sont dans company
    setVisibleLabel(false);
  };

  // fonction suprression labels :
  var handleDeleteLabels = async (labelId) => {
    const newCieLabels = await fetch(
      `http://${REACT_APP_IPSERVER}/companies/labels/${companyId}/${labelId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // body: `labelId=${labelId}&token=YvbAvDg256hw2t5HfW_stG2yOt9BySaK`
      }
    );
    var resLab = await newCieLabels.json();
    setCompany(resLab.dataLabelsCieUpdated);
  };

  // fonction pour overlay description + offers :
  const toggleOverlay = (value) => {
    setVisible(!visible);
    setValueToChange(value);
    if (value === "description") {
      company.description && setInputOverlay(company.description);
    }
    if (value === "offre") {
      setInputOverlay("");
    }
  };

  // fonction pour overlay labels :
  const toggleOverlayLabel = () => {
    setVisibleLabel(!visibleLabel);
  };

  //overlay :
  const handleOverlaySubmit = async () => {
    setVisible(!visible);
    let body = `token=${token}`;
    if (valueToChange === "description") {
      body += `&description=${inputOverlay}`;
    }
    if (valueToChange === "offre") {
      body += `&offerName=${inputOverlay}`;
    }
    const dataRaw = await fetch(
      `http://${REACT_APP_IPSERVER}/companies/${companyId}`,
      {
        // renvoie jsute result, donc true ou flase
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      }
    );
    var res = await dataRaw.json(); // true ou false
    if (res.result) {
      // console.log('offerSaved', res.offerSaved);
      if (valueToChange == "offre" && res.offerSaved) {
        props.navigation.navigate("OfferPage", { offerId: res.offerSaved._id });
      }
      setCompany(res.dataCieFull);
    }
  };

  const handleLikeClick = async () => {
    animation.current.reset();
    !isLiked ? animation.current.play(0, 40) : animation.current.play(40, 75);
    let body = `token=${token}&companyId=${companyId}&userId=${props.user._id}`;
    const dataRaw = await fetch(`http://${REACT_APP_IPSERVER}/companies/like`, {
      // renvoie jsute result, donc true ou flase
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    });
    var res = await dataRaw.json(); // true ou false
    if (res.result) {
      props.storeUser(res.user);
    }
  };

  // console.log(props.user.type);

  // gestion displays selon data / !data :
  if (company && company.companyImage) {
    displayCieImg = (
      <ImageBackground source={{ uri: image }} style={{ height: 200 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            position: "absolute",
            top: "37%",
            right: 10,
            zIndex: 10,
            width: 56,
            height: 56,
            borderRadius: 50,
            shadowColor: "rgba(0,0,0,0.4)",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => handleLikeClick()}
        >
          <LottieView
            ref={animation}
            loop={false}
            progress={isLiked ? 0.5 : 0}
            style={[{ marginTop: 2, backgroundColor: "transparent" }]}
            source={require("../assets/like.json")}
            // OR find more Lottie files @ https://lottiefiles.com/featured
            // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
          />
        </TouchableOpacity>
        {props.user.type === "partner" && (
          <View
            style={{
              position: "absolute",
              bottom: "5%",
              right: "5%",
              marginRight: 15,
            }}
          >
            <ButtonText
              color="light"
              title="Modifier"
              onPress={() => openImagePickerAsync()}
            />
          </View>
        )}
      </ImageBackground>
    );
  } else {
    displayCieImg = (
      <ImageBackground
        source={require("../assets/image_company_blank.png")}
        style={{ height: 200 }}
      >
        {props.user.type === "partner" && (
          <View style={{ position: "absolute", bottom: "5%", right: "5%" }}>
            <ButtonText
              color="light"
              title="Ajouter"
              onPress={() => openImagePickerAsync()}
            />
          </View>
        )}
      </ImageBackground>
    );
  }

  if (company && company.description) {
    displayDescCie = (
      <Card key={1} containerStyle={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            left: 5,
            marginRight: 15,
          }}
        >
          <Card.Title style={{ marginHorizontal: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Qui sommes-nous ?</Text>
          </Card.Title>
          {props.user.type === "partner" && (
            <ButtonText
              color="secondary"
              title="Modifier"
              onPress={() => toggleOverlay("description")}
            />
          )}
        </View>
        <Text style={{ marginHorizontal: 10, marginBottom: 10 }}>
          {company.description}
        </Text>
      </Card>
    );
  } else {
    displayDescCie = (
      <Card key={1} containerStyle={styles.container}>
        <Card.Title style={{ marginHorizontal: 10, textAlign: "left" }}>
          <Text style={{ fontWeight: "bold" }}>Qui sommes-nous ?</Text>
        </Card.Title>
        {props.user.type === "partner" && (
          <View
            style={{
              backgroundColor: "#FAF0E6",
              height: 160,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonText
              color="secondary"
              title="Ajouter"
              onPress={() => toggleOverlay("description")}
            />
          </View>
        )}
      </Card>
    );
  }

  if (company && company.labels.length > 0) {
    displayLabels = (
      <Card key={1} containerStyle={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            left: 5,
            marginRight: 15,
          }}
        >
          <Card.Title style={{ marginHorizontal: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Nos labels</Text>
          </Card.Title>
          {props.user.type === "partner" && (
            <ButtonText
              color="secondary"
              title="Ajouter"
              onPress={() => toggleOverlayLabel()}
            />
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {company.labels.map((label, i) => (
              <View style={{ alignItems: "center" }} key={i}>
                <View style={{ marginBottom: 10, paddingHorizontal: 10 }}>
                  <Image
                    source={{
                      uri: `http://${REACT_APP_IPSERVER}/images/assets/${label.logo}`,
                    }}
                    style={{ width: 100, height: 100, resizeMode: "contain" }}
                  ></Image>
                </View>
                {props.user.type === "partner" && (
                  <ButtonText
                    color="secondary"
                    title="Supprimer"
                    onPress={() => handleDeleteLabels(label._id)}
                  />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </Card>
    );
  } else {
    displayLabels = (
      <Card key={1} containerStyle={styles.container}>
        <Card.Title style={{ marginHorizontal: 10, textAlign: "left" }}>
          <Text style={{ fontWeight: "bold" }}>Nos labels</Text>
        </Card.Title>
        {props.user.type === "partner" && (
          <View
            style={{
              backgroundColor: "#FAF0E6",
              height: 260,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}
            >
              Avez-vous des labels ?
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1, width: 300, height: 400 }}>
                {labels.map((label, i) => {
                  // console.log("label.logo", label.logo);
                  return (
                    <ListItem key={i} bottomDivider>
                      <Image
                        source={{
                          uri: `http://${REACT_APP_IPSERVER}/images/assets/${label.logo}`,
                        }}
                        style={{ width: 50, height: 50, resizeMode: "contain" }}
                      />
                      <ListItem.Content style={{ flexDirection: "row" }}>
                        <View>
                          <ListItem.Title
                            style={{
                              right: 10,
                              flexShrink: 1,
                              left: 10,
                            }}
                          >
                            {label.labelName}
                          </ListItem.Title>
                        </View>
                      </ListItem.Content>
                      <ButtonText
                        color="secondary"
                        title="Ajouter"
                        onPress={() => handleSubmitLabels(label._id)}
                      />
                    </ListItem>
                  );
                })}
              </View>
            </ScrollView>
            <Text></Text>
          </View>
        )}
      </Card>
    );
  }

  if (ratings && ratings.length > 0) {
    displayRatings = (
      <Card key={1} containerStyle={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            left: 5,
            marginRight: 15,
          }}
        >
          <Card.Title style={{ marginHorizontal: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Ils nous font confiance</Text>
          </Card.Title>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {ratings.map((rating, i) => (
              <View style={{ alignItems: "center" }} key={i}>
                <View
                  style={{
                    margin: 10,
                    borderRadius: 50,
                    width: 90,
                    height: 90,
                    backgroundColor: "#fff",
                    shadowColor: "rgba(0,0,0,0.4)",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: rating.clientId.logo }}
                    style={{
                      width: 70,
                      height: 70,
                      resizeMode: "contain",
                      borderRadius: 50,
                    }}
                  ></Image>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={{ alignItems: "center" }}>
          <ButtonText
            color="secondary"
            title="Voir tous les avis"
            onPress={() =>
              props.navigation.navigate("Rating", { companyId: companyId })
            }
          />
        </View>
      </Card>
    );
  }

  if (company && company.offers) {
    displayOffers = (
      <Card key={1} containerStyle={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            left: 5,
            marginRight: 15,
          }}
        >
          <Card.Title style={{ marginHorizontal: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Nos offres</Text>
          </Card.Title>
          {props.user.type === "partner" && (
            <ButtonText
              color="secondary"
              title="Ajouter"
              onPress={() => toggleOverlay("offre")}
            />
          )}
        </View>
        <View>
          {company.offers.map((offer, i) => (
            <OfferCardLight
              key={i}
              dataOffre={offer}
              navigation={props.navigation}
            />
          ))}
        </View>
      </Card>
    );
  } else {
    displayOffers = (
      <Card key={1} containerStyle={styles.container}>
        <Card.Title style={{ marginHorizontal: 10, textAlign: "left" }}>
          <Text style={{ fontWeight: "bold" }}>Nos offres</Text>
        </Card.Title>
        {props.user.type === "partner" && (
          <View
            style={{
              backgroundColor: "#FAF0E6",
              height: 160,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Veuillez ajouter une offre
            </Text>
            <Text>{"\n"}</Text>
            <ButtonText
              color="secondary"
              title="Ajouter"
              onPress={() => toggleOverlay("offre")}
            />
          </View>
        )}
      </Card>
    );
  }

  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}
    >
      {/* OVERLAY description : */}
      <Overlay
        overlayStyle={{ width: "80%", padding: 30, borderRadius: 20 }}
        isVisible={visible}
        onBackdropPress={() => toggleOverlay()}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TextInput
            placeholder={"Entrez votre " + valueToChange}
            value={inputOverlay}
            multiline={true}
            onChangeText={(value) => setInputOverlay(value)}
            style={{ marginVertical: 30 }}
          />
          <View style={{ alignItems: "center" }}>
            <Button
              color="primary"
              size="md"
              title="Valider"
              onPress={() => handleOverlaySubmit()}
            />
          </View>
        </KeyboardAvoidingView>
      </Overlay>

      {/* OVERLAY labels : */}
      <Overlay
        overlayStyle={{
          width: "80%",
          paddingVertical: 30,
          paddingHorizontal: 10,
          borderRadius: 20,
        }}
        isVisible={visibleLabel}
        onBackdropPress={() => toggleOverlayLabel()}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView showsVerticalScrollIndicator={false} style={{ height: 500 }}>
            <View style={{ flex: 1 }}>
              {labels.map((label, i) => {
                // console.log("label.logo", label.logo);
                return (
                  <ListItem key={i} bottomDivider>
                    <Image
                      source={{
                        uri: `http://${REACT_APP_IPSERVER}/images/assets/${label.logo}`,
                      }}
                      style={{ width: 50, height: 50, resizeMode: "contain" }}
                    />
                    <ListItem.Content style={{ flexDirection: "row" }}>
                      <View>
                        <ListItem.Title
                          style={{ right: 10, flexShrink: 1, left: 10 }}
                        >
                          {label.labelName}
                        </ListItem.Title>
                      </View>
                    </ListItem.Content>
                    <ButtonText
                      color="secondary"
                      title="Ajouter"
                      onPress={() => handleSubmitLabels(label._id)}
                    />
                  </ListItem>
                );
              })}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Overlay>

      <HeaderBar
        title={company ? company.companyName : "Entreprise"}
        onBackPress={() => props.navigation.goBack()}
        leftComponent
        locationIndication
        location={
          company && company.offices.length > 0
            ? company.offices[0].postalCode +
              " " +
              company.offices[0].city +
              ", " +
              company.offices[0].country
            : "Entreprise"
        }
        navigation={props.navigation}
        user={props.user}
      ></HeaderBar>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE ENTREPRISE */}
        <View style={{ paddingVertical: 10 }}>{displayCieImg}</View>

        {/* CARD INFOS COMPANY */}
        <View style={{ flex: 1, paddingVertical: 10 }}>{displayDescCie}</View>

        {/* CARD LABELS COMPANY */}
        <View style={{ flex: 1, paddingVertical: 10 }}>{displayLabels}</View>

        {/* CARD LABELS COMPANY */}
        <View style={{ flex: 1, paddingVertical: 10 }}>{displayRatings}</View>

        {/* CARD OFFRES COMPANY */}
        <View style={{ flex: 1, paddingVertical: 10 }}>{displayOffers}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowColor: "rgba(0,0,0, 0.0)", // Remove Shadow for iOS
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Remove Shadow for Android
    margin: 0,
    width: "100%",
  },
});

// on récupère le user stocké dans le store :
function mapStateToProps(state) {
  return { user: state.user };
}

function mapDispatchToProps(dispatch) {
  return {
    storeUser: function (user) {
      dispatch({ type: "storeUser", user });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyScreen);
