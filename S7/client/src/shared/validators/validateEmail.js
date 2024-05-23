export const validateEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;

  return regex.test(email);
};

export const emailValidationMessage = "Please enter a valid email address.";
