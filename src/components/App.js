import { useState, useEffect } from 'react';
import { CurrentUserContext } from '../context/CurrentUserContext';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import ConfirmDeleteCardPopup from './ConfirmDeleteCardPopup';

import '../App.css';
import api from "../utils/api.js";

function App() {

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeleteCardPopupOpen, setIsConfirmDeleteCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [deleteCard, setDeleteCard] = useState({});

  useEffect(() => {
    const getCurrentUserAndCards = async () => {
      try {
        const [userData, cardsData] = await Promise.all([api.getCurrentUser(), api.getCards()]);
        setCurrentUser(userData);
        setCards(cardsData);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrentUserAndCards();
  }, []);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const handleConfirmDeleteCardClick = (card) => {
    setIsConfirmDeleteCardPopupOpen(!isConfirmDeleteCardPopupOpen);
    setDeleteCard(card);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmDeleteCardPopupOpen(false);
    setSelectedCard({});
  }

  const handleCardLike = async (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    try {
      const newCard = await api.changeLikeCardStatus(card._id, !isLiked);
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    } catch (error) {
      console.log(error);
    }
  }

  const handleCardDelete = async (card) => {
    try {
      await api.deleteCard(card._id);
      setCards((state) => state.filter((c) => c._id !== card._id));
      closeAllPopups();
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateUser = async (name, about) => {
    try {
      const userData = await api.changeUserData(name, about);
      setCurrentUser(userData);
      closeAllPopups();
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateAvatar = async (avatarLink) => {
    try {
      const userData = await api.changeAvatar(avatarLink);
      setCurrentUser(userData);
      closeAllPopups();
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddPlaceSubmit = async (name, link) => {
    try {
      const cardData = await api.addNewCard(name, link);
      setCards([cardData, ...cards]);
      closeAllPopups();
    } catch (error) {
      console.log(error);
    }
  }

  const mainProps = {
    onEditProfile: handleEditProfileClick,
    onAddPlace: handleAddPlaceClick,
    onEditAvatar: handleEditAvatarClick,
    onCardClick: handleCardClick,
    cards,
    onCardLike: handleCardLike,
    onCardDelete: handleConfirmDeleteCardClick,
  }

  const imagePopupProps = {
    card: selectedCard,
    onClosePopup: closeAllPopups
  }

  const editProfilePopupProps = {
    isOpen: isEditProfilePopupOpen,
    onClose: closeAllPopups,
    onUpdateUser: handleUpdateUser
  }

  const editAvatarPopupProps = {
    isOpen: isEditAvatarPopupOpen,
    onClose: closeAllPopups,
    onUpdateAvatar: handleUpdateAvatar
  }

  const addPlacePopupProps = {
    isOpen: isAddPlacePopupOpen,
    onClose: closeAllPopups,
    onAddPlace: handleAddPlaceSubmit
  }

  const confirmDeleteCardPopupProps = {
    isOpen: isConfirmDeleteCardPopupOpen,
    onClose: closeAllPopups,
    onDeleteCard: handleCardDelete,
    card: deleteCard
  }

  return (
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header />
          <Main {...mainProps} />
          <Footer />
          <EditProfilePopup {...editProfilePopupProps} />
          <AddPlacePopup {...addPlacePopupProps} />
          <EditAvatarPopup {...editAvatarPopupProps} />
          <ConfirmDeleteCardPopup {...confirmDeleteCardPopupProps} />
          <ImagePopup {...imagePopupProps} />
        </CurrentUserContext.Provider>
      </div>
  );
}

export default App;