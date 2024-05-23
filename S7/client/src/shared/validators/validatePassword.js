export const validatePassword = (password) => {
  const regex = /^\S{6,12}$/;
  return regex.test(password);
};

export const passwordValidationMessage =
  "Password should have between 6 and 12 characters. No spaces are allowed.";
