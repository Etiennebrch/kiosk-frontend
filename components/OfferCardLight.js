import React from "react";
import { View } from "react-native";
import { Card } from "react-native-elements";
import { Button } from "../components/Buttons";

import Text from "./Text";

export default function OfferCardLight(props) {
  // boucle pour renplir la list des commitments
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
        source={{ uri: props.dataOffre.offerImage ? props.dataOffre.offerImage : "https://images.unsplash.com/photo-1551836022-8b2858c9c69b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" }}
      ></Card.Image>
      {/* Titre + description courte */}
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
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{props.dataOffre.offerName}</Text>
        </Card.Title>
        <Text>{props.dataOffre.shortDescription}</Text>
      </View>
      {/*bouton */}
      <View
        style={{
          margin: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <View>
          <Button
            size="md"
            containerStyle={{ width: 100 }}
            color="primary"
            title="Voir l'offre"
            onPress={() => props.navigation.navigate("OfferPage", { offerId: props.dataOffre._id })}
          />
        </View>
      </View>
    </Card>
  );
}
