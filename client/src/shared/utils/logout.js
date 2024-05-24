export const logout = () => {
  localStorage.removeItem("user");

  // it will cause page refresh
  window.location.href = "/channels";
};
