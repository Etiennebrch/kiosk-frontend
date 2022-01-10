import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, ListItem, Avatar } from "react-native-elements";

import { connect } from "react-redux";

const CateGoriesList = (props) => {
  var categoriesData = props.categorieslist;

  function handlePress(categoryChosenData) {
    props.CategoryChoice(categoryChosenData);
  }

  var categories = categoriesData.map((e, i) => {
    return (
      <ListItem
        style={{ width: "100%" }}
        key={i}
        bottomDivider
        onPress={() =>
          handlePress({ categoryName: e.categoryName, categoryId: e._id })
        }
      >
        <ListItem.Content>
          <ListItem.Title>{e.categoryName}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  });

  return categories;
};

function mapStateToProps(state) {
  return { categorieslist: state.categorieslist };
}

function mapDispatchToProps(dispatch) {
  return {
    CategoryChoice: function (categoryChosenData) {
      dispatch({ type: "setCategoryChosen", categoryChosenData });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CateGoriesList);
