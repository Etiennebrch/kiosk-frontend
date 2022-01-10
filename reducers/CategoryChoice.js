export default function (categoryChosenData = "", action) {
  if (action.type === "setCategoryChosen") {
    var newCategoryChosenData = action.categoryChosenData;
    return newCategoryChosenData;
  } else if (action.type === "Reset") {
    var newCategoryChosenData = "";
    return newCategoryChosenData;
  } else {
    return categoryChosenData;
  }
}
