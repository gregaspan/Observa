export const validateAvatarUrl = (url) => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;

  return regex.test(url);
};

export const avatarUrlValidationMessage = "Please enter a valid URL";
