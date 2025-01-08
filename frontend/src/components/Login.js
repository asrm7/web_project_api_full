import React, { useEffect, useState } from "react";
import FormUser from "./FormUser";

import InfoTooltip from "./InfoTooltip";
import { useLocation, useNavigate } from "react-router-dom";
import * as auth from "../utils/auth";

function Login({ isUserLogged }) {
  const navigate = useNavigate();
  const location = useLocation();

  
  const [successRegister, setSuccessRegister] = useState(false);
  const [shoulBeInfoOpen, setShouldBeInfoOpen] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  function closeInfoTooltip() {
    setShouldBeInfoOpen(false);
  }

  useEffect(() => {
    if (location.state === "success") {
      setSuccessRegister(true);
      setShouldBeInfoOpen(true);
    }
  }, [location.state]);
  

  function handleChange(event) {
    const { name, value } = event.target;
    setUserCredentials({
      ...userCredentials,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!userCredentials.email || !userCredentials.password) {
      return;
    }
    auth
      .authorize(userCredentials.email, userCredentials.password)
      .then((data) => {
        if (data.token) {
          setUserCredentials({
            email: "",
            password: "",
          });

          isUserLogged(data.email);
          setSuccessRegister(true); // Define sucesso do registro
          setShouldBeInfoOpen(true); // Abre o InfoTooltip
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        setSuccessRegister(false); // Define erro
        setShouldBeInfoOpen(true); // Abre o InfoTooltip
      });
  }
  return (
    <>
      <FormUser
        title={"Entrar"}
        buttonText={"Entrar"}
        linkSpan={"/signup"}
        linkText={"Ainda não é membro? Inscreva-se aqui!"}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
      <InfoTooltip
        isSuccess={successRegister}
        isOpen={shoulBeInfoOpen}
        name={"tooltip"}
        onClose={closeInfoTooltip}
      />
    </>
  );
}
export default Login;
