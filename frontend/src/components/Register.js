import { React, useState } from 'react'
import FormUser from "./FormUser";
import * as auth from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import InfoTooltip from "./InfoTooltip";


function Register() {
  const navigate = useNavigate();

 
  const [successRegister, setSuccessRegister] = useState(false);
  const [shoulBeInfoOpen, setShouldBeInfoOpen] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  
  function closeInfoTooltip() {
    setShouldBeInfoOpen(false);
  }
  
  function handleChange(event) {
    const { name, value } = event.target;
    setUserCredentials({
      ...userCredentials,
      [name]: value,
    });
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    auth
      .register(userCredentials.email, userCredentials.password)
      .then((data) => {
        if (data) {
          navigate("/signin", { state: "success" });
        } else {
          setShouldBeInfoOpen(true);
          setSuccessRegister(false);
        }
      });
  }
  return (
    <>
      
      <FormUser
        title={'Inscrever-se'}
        buttonText={"Inscrever-se"}
        linkSpan={"/signin"}
        linkText={"Já é um membro? Faça o login aqui!"}
        onChange={handleChange}
        onSubmit={handleSubmit}
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
export default Register;