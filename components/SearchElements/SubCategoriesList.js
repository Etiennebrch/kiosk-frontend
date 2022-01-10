import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, ListItem, Avatar } from "react-native-elements";

import { connect } from "react-redux";

import { useIsFocused } from "@react-navigation/native";

const SubCateGoriesList = (props) => {
  const isFocused = useIsFocused();

  if (isFocused) {
  }

  var categoriesData = props.categorieslist;

  function handlePress(subCategoryChosenData) {
    props.subCategoryChoice(subCategoryChosenData);
  }

  function handlePressRetour() {
    props.CategoryChoice();
  }

  //si on clique sur Voir tout, subCategoryChosenData dans le store prend la valeur de categoryChosenData.
  function handlePressTout() {
    props.categoryAll(props.categoryChosenData);
  }

  var indexcategoriesData = -1;
  for (var i = 0; i < categoriesData.length; i++)
    if (
      categoriesData[i].categoryName === props.categoryChosenData.categoryName
    ) {
      indexcategoriesData = i;
    }

  var subCategories;
  if (indexcategoriesData === -1) {
    subCategories = <View style={{ flex: 1 }}></View>;
  } else {
    var subCategories = categoriesData[indexcategoriesData].subCategories.map(
      (e, i) => {
        return (
          <ListItem
            style={{ width: "100%" }}
            key={i}
            bottomDivider
            topDivider
            onPress={() =>
              handlePress({
                subCategoryName: e.subCategoryName,
                subCategoryId: e._id,
              })
            }
          >
            <ListItem.Content>
              <ListItem.Title>{e.subCategoryName}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        );
      }
    );
  }
  return (
    <View style={{ width: "100%" }}>
      <ListItem
        style={{ width: "100%" }}
        key={i}
        bottomDivider
        topDivider
        onPress={() => handlePressRetour()}
      >
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "bold" }}>
            {props.categoryChosenData.categoryName}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        style={{ width: "100%" }}
        bottomDivider
        topDivider
        onPress={() => handlePressTout()}
      >
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "700" }}>
            Voir tout
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      {subCategories}
    </View>
  );
};

function mapStateToProps(state) {
  return {
    categoryChosenData: state.categoryChosenData,
    categorieslist: state.categorieslist,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subCategoryChoice: function (subCategoryChosenData) {
      dispatch({ type: "setSubCategoryChosen", subCategoryChosenData });
    },
    CategoryChoice: function (categoryChoice) {
      dispatch({ type: "Reset", categoryChoice });
    },
    categoryAll: function (categoryChosenData) {
      dispatch({ type: "setcategoryall", categoryChosenData });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubCateGoriesList);
