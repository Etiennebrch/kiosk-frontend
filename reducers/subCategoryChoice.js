export default function (subCategoryChosenData = "", action) {
  if (action.type === "setSubCategoryChosen") {
    var newSubCategoryChosenData = action.subCategoryChosenData;
    return newSubCategoryChosenData;
  } else if (action.type === "setcategoryall") {
    var newSubCategoryChosenData = {};
    newSubCategoryChosenData.subCategoryId =
      action.categoryChosenData.categoryId;
    newSubCategoryChosenData.subCategoryName =
      action.categoryChosenData.categoryName;

    return newSubCategoryChosenData;
  } else if (action.type === "ResteSubCategorie") {
    var newSubCategoryChosenData = "";
    return newSubCategoryChosenData;
  } else {
    return subCategoryChosenData;
  }
}
