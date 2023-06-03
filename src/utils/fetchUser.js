export const fetchUser = () => {
  const userInfo =
    localStorage?.getItem("name") !== "undefined"
      ? JSON.parse(localStorage.getItem("name"))
      : localStorage.clear();
  return userInfo;
};
