import React from "react";
import logo from "../../resources/images/logoPlaceholder.svg";

const NavLogo = () => {
  return (
    <div className="nav-logo-container">
      <img className="nav-logo" width="100%" height="100%" src={logo} />
    </div>
  );
};

const NavButton = ({ text, onClickHandler }) => {
  return (
    <span className="nav-button" onClick={onClickHandler}>
      {text}
    </span>
  );
};

export const Nav = () => {
  return (
    <div className="nav-container">
      <NavLogo />
      <div className="nav-buttons-container">
        <NavButton text="Browse" onClickHandler={() => {}} />
        <NavButton text="Login" onClickHandler={() => {}} />
        <div>
          <NavButton text="My Account" onClickHandler={() => {}} />
          <NavButton text="Logout" onClickHandler={() => {}} />
        </div>
      </div>
    </div>
  );
};
