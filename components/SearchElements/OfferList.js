import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, ListItem, Avatar } from "react-native-elements";

import { connect } from "react-redux";

import { REACT_APP_IPSERVER } from "@env";

import OfferCardMain from "../OfferCardMain";
//import OfferCardLight from "../OfferCardLight";
import { ScrollView } from "react-native-gesture-handler";

const OfferList = (props) => {
  var categoryId = props.categoryChosenData;
  var subCategoryId = props.subCategoryChosenData;

  const [offerList, setOfferList] = useState([]);
  //var offerList;

  useEffect(async () => {
    var recherche;
    if (props.recherche) {
      recherche = props.recherche;
    } else if (
      props.categoryChosenData.categoryName ==
      props.subCategoryChosenData.subCategoryName
    ) {
      recherche = props.categoryChosenData.categoryName;
    } else {
      recherche = props.subCategoryChosenData.subCategoryName;
    }

    var listOfferID;
    var listOffer;
    const dataListOfferIDraw = await fetch(
      `http://${REACT_APP_IPSERVER}/recherche/rechercheListOffer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `recherche=${recherche}`,
      }
    );
    var data = await dataListOfferIDraw.json();

    listOfferID = data.listOfferID;
    if (data.result === true) {
      var listOfferIDStringify = JSON.stringify(listOfferID);
      const dataListOfferraw = await fetch(
        `http://${REACT_APP_IPSERVER}/recherche/recherche`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `listOfferId=${listOfferIDStringify}`,
        }
      );
      var data = await dataListOfferraw.json();
      listOffer = data.offerList;

      setOfferList(listOffer);
    } else {
      setOfferList(undefined);
    }
  }, [props.recherche, props.categoryChosenData, props.subCategoryChosenData]);

  //Si on trouve des offre, on appelle le composant OfferCardMain en lui passant les propriétés de la liste

  if (offerList === undefined) {
    var listOfferCard = <Text>Pas d'offre</Text>;
  } else {
    var listOfferCard = offerList.map((e, i) => {
      return (
        <OfferCardMain
          key={i}
          dataOffre={e}
          navigation={props.navigation}
        ></OfferCardMain>
      );
    });
  }

  return <ScrollView showsVerticalScrollIndicator={false}>{listOfferCard}</ScrollView>;
};

function mapStateToProps(state) {
  return {
    categoryChosenData: state.categoryChosenData,
    subCategoryChosenData: state.subCategoryChosenData,
    recherche: state.recherche,
  };
}

export default connect(mapStateToProps, null)(OfferList);
