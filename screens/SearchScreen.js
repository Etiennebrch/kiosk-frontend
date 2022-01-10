import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, ListItem, Avatar } from "react-native-elements";
import CateGoriesList from "../components/SearchElements/CategoriesList";
import SubCategoriesList from "../components/SearchElements/SubCategoriesList";
import OfferList from "../components/SearchElements/OfferList";

import { connect } from "react-redux";

import Searchbar from "../components/SearchBar";
import { HeaderBar } from "../components/Header";

const SearchScreen = (props) => {
  const [menuToShow, setMenuToShow] = useState(
    <CateGoriesList></CateGoriesList>
  );

  const [headerBar, setHeaderBar] = useState(
    <HeaderBar
      title="Recherche"
      navigation={props.navigation}
      user={props.user}
    ></HeaderBar>
  );

  async function handlePressRetour() {
    props.subCategoryChoiceReset();
    //props.CategoryChoiceReset();
    props.ResetRecherche();
  }

  useEffect(() => {
    //condition pour afficher soir la liste de categorie, soit la liste de sous categorie, sois la liste de résultat
    if (
      props.categoryChosenData == "" &&
      props.subCategoryChosenData == "" &&
      !props.recherche
    ) {
      setHeaderBar(
        <HeaderBar
          title="Recherche"
          navigation={props.navigation}
          user={props.user}
        ></HeaderBar>
      );
      setMenuToShow(<CateGoriesList></CateGoriesList>);
    } else if (
      props.categoryChosenData.categoryName !== "" &&
      props.subCategoryChosenData === "" &&
      !props.recherche
    ) {
      setHeaderBar(
        <HeaderBar
          title="Recherche"
          onBackPress={() => props.CategoryChoiceReset()}
          leftComponent
          navigation={props.navigation}
          user={props.user}
        ></HeaderBar>
      );
      setMenuToShow(<SubCategoriesList></SubCategoriesList>);
    } else if (props.subCategoryChosenData !== "" || props.recherche) {
      setHeaderBar(
        <HeaderBar
          title="Recherche"
          onBackPress={() => {
            handlePressRetour();
          }}
          leftComponent
          navigation={props.navigation}
          user={props.user}
        ></HeaderBar>
      );
      setMenuToShow(<OfferList navigation={props.navigation}></OfferList>);
    }
  }, [props.categoryChosenData, props.subCategoryChosenData, props.recherche]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        width: "100%",
      }}
    >
      {headerBar}
      <Searchbar navigation={props.navigation}></Searchbar>
      {menuToShow}
    </View>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
    categoryChosenData: state.categoryChosenData,
    subCategoryChosenData: state.subCategoryChosenData,
    recherche: state.recherche,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeUser: function (user) {
      dispatch({ type: "storeUser", user });
    },
    CategoryChoiceReset: function () {
      dispatch({ type: "Reset" });
    },
    subCategoryChoiceReset: function () {
      dispatch({ type: "ResteSubCategorie" });
    },
    ResetRecherche: function () {
      dispatch({ type: "ResetRecherche" });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
