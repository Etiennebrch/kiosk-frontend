import React from "react";
import { TouchableOpacity } from "react-native";
import Text from "./Text";

// Import du module qui facilite la création de gradient
import { LinearGradient } from "expo-linear-gradient";

const Button = (props) => {

  // Style utilisé pour le container du bouton
  let containerStyle = {
    borderRadius: 15,
  };

  if(props.style) {
    containerStyle = {
      ...containerStyle,
      ...props.style
    }
  }

  // Condition pour définir la taille du bouton
  let btnStyle;
  let fontStyle;
  if (props.size === "md") {
    btnStyle = {
      paddingHorizontal: 15,
      paddingVertical: 10,
    };
    fontStyle = {
      color: "#FFFFFF",
      fontSize: 16
    };
  } else {
    btnStyle = {
      paddingHorizontal: 15,
      paddingVertical: 5,
    };
    fontStyle = {
      color: "#FFFFFF",
      fontSize: 14
    };
  }

  // Condition pour définir la couleur du bouton
  let bgColor;
  if (props.color === "primary") {
    bgColor = ["#F47805", "#F24444"];
  } else {
    bgColor = ["#A1C181", "#619B8A"];
  }

  // Récupération de la fonction onPress envoyée par le parent
  const { onPress } = props;

  return (
    <LinearGradient
      style={containerStyle}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={bgColor}
    >
      <TouchableOpacity style={btnStyle} onPress={() => onPress()}>
        <Text style={fontStyle}>{props.title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const ButtonText = (props) => {
  // Style commun du texte
  let textStyle = {
    fontSize: 14,
    textDecorationLine: "underline",
  };

  // Condition pour définir la couleur du text
  if (props.color === "primary") {
    textStyle = { ...textStyle, color: "#F4592B" };
  } else if (props.color === "secondary") {
    textStyle = { ...textStyle, color: "#69A08A" };
  } else if (props.color === "light") {
    textStyle = { ...textStyle, color: "#FFFFFF" };
  } else {
    textStyle = { ...textStyle, color: "#1A0842" };
  }

  // Récupération de la fonction onPress envoyée par le parent
  const { onPress } = props;

  return (
    <TouchableOpacity onPress={() => onPress()}>
      <Text style={textStyle}>{props.title}</Text>
    </TouchableOpacity>
  );
};

// Export des composants
export { Button, ButtonText };
