import React from "react";

export const Input = ({
  field,
  label,
  value,
  onChangeHandler,
  type,
  showErrorMessage,
  validationMessage,
  onBlurHandler,
  textarea,
}) => {
  const handleValueChange = (e) => {
    onChangeHandler(e.target.value, field);
  };

  const handleInputBlur = (e) => {
    onBlurHandler(e.target.value, field);
  };

  return (
    <>
      <div className="auth-form-label">
        <span>{label}</span>
      </div>
      {textarea ? (
        <textarea
          type={type}
          value={value}
          onChange={handleValueChange}
          onBlur={handleInputBlur}
          rows={5}
          style={{ maxWidth: "400px " }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleValueChange}
          onBlur={handleInputBlur}
        />
      )}
      <span className="auth-form-validation-message">
        {showErrorMessage && validationMessage}
      </span>
    </>
  );
};
