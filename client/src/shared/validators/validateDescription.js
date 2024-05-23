export const validateDescription = (description) => {
  return description.length >= 10 && description.length <= 200;
};

export const descriptionValidationMessage =
  "Description should have between 10 and 200 characters";
