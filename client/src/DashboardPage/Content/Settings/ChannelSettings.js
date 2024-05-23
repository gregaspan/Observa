import React, { useState } from "react";
import {
  titleValidationMessage,
  usernameValidationMessage,
  avatarUrlValidationMessage,
  descriptionValidationMessage,
  validateUsername,
  validateAvatarUrl,
  validateTitle,
  validateDescription,
} from "../../../shared/validators";
import { Input } from "../../../shared/components";

const inputs = [
  {
    field: "username",
    label: "Username",
    validationMessage: usernameValidationMessage,
    type: "text",
  },
  {
    field: "title",
    label: "Title",
    validationMessage: titleValidationMessage,
    type: "text",
  },
  {
    field: "avatarUrl",
    label: "Avatar Url",
    validationMessage: avatarUrlValidationMessage,
    type: "text",
  },
  {
    field: "description",
    label: "Description",
    validationMessage: descriptionValidationMessage,
    type: "text",
    textarea: true,
  },
];

export const ChannelSettings = ({ settings }) => {
  const [formState, setFormState] = useState({
    title: {
      isValid: false,
      showError: false,
      value: settings.title,
    },
    username: {
      isValid: false,
      showError: false,
      value: settings.username,
    },
    avatarUrl: {
      isValid: false,
      showError: false,
      value: settings.avatarUrl,
    },
    description: {
      isValid: false,
      showError: false,
      value: settings.description,
    },
  });

  const handleInputValueChange = (value, field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value,
      },
    }));
  };

  const handleInputValidationOnBlur = (value, field) => {
    let isValid = false;

    switch (field) {
      case "username":
        isValid = validateUsername(value);
        break;
      case "avatarUrl":
        isValid = validateAvatarUrl(value);
        break;
      case "title":
        isValid = validateTitle(value);
        break;
      case "description":
        isValid = validateDescription(value);
        break;
      default:
        break;
    }

    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        isValid,
        showError: !isValid,
      },
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // TODO
    // save settings using http request
  };

  const isSubmitButtonDisabled =
    !formState.username.isValid ||
    !formState.title.isValid ||
    !formState.description.isValid ||
    !formState.avatarUrl.isValid;

  return (
    <form className="settings-form">
      {inputs.map((input) => (
        <Input
          key={input.field}
          field={input.field}
          label={input.label}
          value={formState[input.field].value}
          onChangeHandler={handleInputValueChange}
          onBlurHandler={handleInputValidationOnBlur}
          showErrorMessage={formState[input.field].showError}
          validationMessage={input.validationMessage}
          type={input.type}
          textarea={input.textarea}
        />
      ))}
      <button onClick={handleFormSubmit} disabled={isSubmitButtonDisabled}>
        Save Changes
      </button>
    </form>
  );
};
