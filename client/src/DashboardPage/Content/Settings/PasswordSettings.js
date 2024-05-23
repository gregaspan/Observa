import React, { useState } from "react";
import {
  passwordValidationMessage,
  validatePassword,
} from "../../../shared/validators";
import { Input } from "../../../shared/components";

const inputs = [
  {
    field: "password",
    label: "Current password",
    validationMessage: passwordValidationMessage,
    type: "password",
  },
  {
    field: "newPassword",
    label: "New password",
    validationMessage: passwordValidationMessage,
    type: "password",
  },
];

export const PasswordSettings = () => {
  const [formState, setFormState] = useState({
    password: {
      isValid: false,
      showError: false,
      value: "",
    },
    newPassword: {
      isValid: false,
      showError: false,
      value: "",
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
    let isValid = validatePassword(value);

    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        isValid,
        showError: !isValid,
      },
    }));
  };

  const isSubmitButtonDisabled =
    !formState.password.isValid || !formState.newPassword.isValid;

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // TODO
    // Http call to change the password
  };

  return (
    <form className="settings-form">
      {inputs.map((input) => (
        <Input
          key={input.field}
          field={input.field}
          label={input.label}
          value={formState[input.field].value}
          onBlurHandler={handleInputValidationOnBlur}
          onChangeHandler={handleInputValueChange}
          showErrorMessage={formState[input.field].showError}
          validationMessage={input.validationMessage}
          type={input.type}
        />
      ))}
      <button disabled={isSubmitButtonDisabled} onClick={handleFormSubmit}>
        Save changes
      </button>
    </form>
  );
};
