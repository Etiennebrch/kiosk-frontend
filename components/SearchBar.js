import React, { useState } from "react";
import { SearchBar } from "react-native-elements";

import { connect } from "react-redux";

import { REACT_APP_IPSERVER } from "@env";

function Searchbar(props) {
  const [search, setSearch] = useState("");

  var handlesearch = async function (val) {
    props.CategoryChoiceReset();
    props.subCategoryChoiceReset();
    props.setRecherche(val);
    setSearch("");
    props.navigation.navigate("Rechercher");
  };

  return (
    <SearchBar
      lightTheme={true}
      containerStyle={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        height: 50,
        borderWidth: 0,
        marginTop: 10,
        marginBottom: 20,
        padding: 0,
        borderRadius: 50,
      }}
      inputContainerStyle={{
        backgroundColor: "#FAF0E6",
        borderRadius: 50,
        margin: 0,
        padding: 0,
        height: 50,
      }}
      inputStyle={{
        backgroundColor: "#FAF0E6",
        margin: 0,
        padding: 0,
        height: 50,
      }}
      placeholder="Quel est votre besoin ?"
      onSubmitEditing={() => handlesearch(search)}
      onChangeText={(val) => setSearch(val)}
      value={search}
    />
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setRecherche: function (valeur) {
      dispatch({ type: "setRecherche", valeur });
    },
    CategoryChoiceReset: function () {
      dispatch({ type: "Reset" });
    },
    subCategoryChoiceReset: function () {
      dispatch({ type: "ResteSubCategorie" });
    },
  };
}

export default connect(null, mapDispatchToProps)(Searchbar);
