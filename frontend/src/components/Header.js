import logo from "../images/Logo.png";
import React from "react";
import { Link, useLocation } from "react-router-dom";
export default function Header({ loggedIn, handleLogout, emailUser}) {
  const location = useLocation();
  return (
    <>
      <header className="header">
        <img src={logo} alt="Logo Around the U.S." className="header__logo" />
        {loggedIn ? (
          <div className="header__info">
            <p className="header__email">{emailUser}</p>
            <p className="header__subheader" onClick={handleLogout}>
              Sair
            </p>
          </div>
        ) : location.pathname === "/signin" ? (
          <Link to="/signup" className="header__subheader">
             Entrar
          </Link>
        ) : (
          <Link to="/signin" className="header__subheader">
            Faça login
          </Link>
        )}
      </header>
    </>
  );
}
