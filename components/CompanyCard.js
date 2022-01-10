import React from "react";
import { View, Image } from "react-native";
import { Card, AirbnbRating } from "react-native-elements";
import { Button } from "../components/Buttons";
import Text from "./Text";

export default function CompanyCard(props) {
if (props.dataCompany) {
  return (
    <Card
      containerStyle={{
        marginBottom: 10,
        padding: 0,
        borderWidth: 0,
        borderRadius: 20,
        shadowColor: "rgba(0,0,0,0.4)",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
      }}
    >
      {/* Image offre */}
      <Card.Image
        style={{
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          alignItems: "flex-end",
        }}
        source={{ uri: props.dataCompany.companyImage ? props.dataCompany.companyImage : "https://images.unsplash.com/photo-1551836022-8b2858c9c69b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" }}
      >
        {/* Partie rating */}
        <View
          style={{
            backgroundColor: "white",
            margin: 10,
            borderRadius: 20,
            padding: 6,
          }}
        >
          <AirbnbRating
            type="custom"
            selectedColor="#F47805"
            unSelectedColor="#F4780533"
            reviewColor="#F47805"
            defaultRating={Math.floor(Math.random() * (6 - 3) + 3)} //changer avec rating
            isDisabled
            count={5}
            size={20}
            showRating={false}
          />
        </View>
      </Card.Image>
      {/* Logo entreprise : la View est pardessus les autres éléments grace au zindex. Elle est positionner par rapport à la Card*/}
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 50,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          zIndex: 2,
          top: 115,
          left: "77%",
          shadowColor: "rgba(0,0,0,0.4)",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image
          style={{ width: 70, height: 70, borderRadius: 50, resizeMode: 'contain' }}
          source={{ uri: props.dataCompany.logo ? props.dataCompany.logo : 'https://www.laguilde.quebec/wp-content/uploads/2020/05/logo-placeholder.jpg' }}
          // source={require("../assets/logo.png")} // a changer avec la recherche BDD
        />
      </View>
      {/* Titre + location + description  */}
      <View
        style={{
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        <Card.Title
          style={{
            textAlign: "left",
            marginBottom: 0,
            zIndex: 1,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{props.dataCompany.companyName}</Text>
        </Card.Title>
        <Text
          style={{
            textAlign: "left",
            marginBottom: 10,
          }}
        >
          {props.dataCompany.offices.length > 0 &&
            props.dataCompany.offices[0].city +
              ", " +
              props.dataCompany.offices[0].country}
        </Text>
        <Text>{props.dataCompany.shortDescription}</Text>
      </View>
      {/* Commitments + bouton */}
      <View
        style={{
          margin: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Button
            size="md"
            containerStyle={{ width: 100 }}
            color="primary"
            title="Plus de détails"
            onPress={() =>
              props.navigation.navigate("CompanyPage", {
                companyId: props.dataCompany._id,
              })
            }
          />
        </View>
      </View>
    </Card>
  );
}}