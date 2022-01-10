export default function (user = null, action) {
  if (action.type == "storeUser") {
    return action.user;
  } else if (action.type == "storeUserReset") {
    var userReset = null;
    return userReset;
  } else {
    return user;
  }
}
