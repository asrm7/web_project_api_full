import React from "react";
import { Route, useNavigate, Routes } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import api from "../utils/api.js";
import Register from "./Register.js";
import Login from "./Login.js";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setisDeletePopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [isLogged, setIsLogged] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const navigate = useNavigate();

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleUpdateUser = async ({ name, about }) => {
    return await api.updateUserProfile(name, about).then((updatedUserData) => {
      setCurrentUser(updatedUserData);
      closeAllPopups();
    });
  };

  const handleUpdateAvatar = async ({ avatar }) => {
    return await api.updateAvatar(avatar).then((updatedUserData) => {
      setCurrentUser(updatedUserData);
      closeAllPopups();
    });
  };

  const handleAddPlaceSubmit = async ({ link, name }) => {
    return await api.createCard(link, name).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    });
  };

  function handleDeletePopupClick(card) {
    setCardToDelete(card); // Armazena o card que se deseja eliminar
    setisDeletePopupOpen(true); // Abre o popup
  }

  function handleCardLike(card) {
    // Verifica se o card recebeu like
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Envía uma pedido a API e obtem os dados atualizados
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.error(`Erro ao dar like/deslike: ${err}`));
  }
  function signOff() {
    localStorage.removeItem("jwt");
    setEmailUser("");
    setIsLogged(false);
    navigate("/signin");
  }

  function handleLogin() {
    setIsLogged(true);
  }
  const handleCardDelete = () => {
    if (cardToDelete) {
      return api.deleteCard(cardToDelete?._id).then(() => {
        setCards((state) => state.filter((c) => c._id !== cardToDelete._id));
        closeAllPopups();
      });
    }
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };
  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setisDeletePopupOpen(false);
  };
  
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      auth
        .getToken(localStorage.getItem("jwt"))
        .then((data) => {
          if (data) {
            setCurrentUser(data); // Armazena os dados do usuario atual
            setEmailUser(data.email);
            console.log(data.email);
            setIsLogged(true);
            navigate("/");
            // Obtem os cards iniciais
            api.getInitialCards().then((res) => {
              setCards(res);
            });
          } else {
            navigate("/signup");
            throw new Error("Token invalido");
          }
        })
        .catch((error) => {
          console.log(error);
          navigate("/signup");
        });
    }
  }, [isLogged, navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={isLogged}
          handleLogout={signOff}
          emailUser={emailUser}
        />

        <Routes>
          <Route element={<ProtectedRoute loggedIn={isLogged} />}>
            <Route
              path="/"
              element={
                <>
                  <Main
                    cards={cards}
                    onEditProfileClick={handleEditProfileClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onEditAvatarClick={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleDeletePopupClick} // Abre o popup de confirmacao
                  />
                </>
              }
            />
          </Route>
          <Route
            path="/signin"
            element={
              <>
                <Login isUserLogged={handleLogin} />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Register />
              </>
            }
          />
        </Routes>

        <Footer />
      </div>
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlaceSubmit={handleAddPlaceSubmit}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />

      <ConfirmDeletePopup
        isOpen={isDeletePopupOpen}
        onClose={closeAllPopups}
        onConfirmDelete={handleCardDelete}
      />
    </CurrentUserContext.Provider>
  );
}
