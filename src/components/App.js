import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import api from '../utils/api';
import ImagePopup from "./ImagePopup";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup";
import { useEffect, useState } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const [ isEditProfilePopupOpen, setIsEditProfilePopupOpen ] = useState(false);
  const [ isEditAvatarPopupOpen, setIsEditAvatarPopupOpen ] = useState(false);
  const [ isAddPlacePopupOpen, setIsAddPlacePopupOpen ] = useState(false);
  const [ currentUser, setCurrentUser ] = useState({});
  const [ selectedCard, setSelectedCard ] = useState({});
  const [ cards, setCards ] = useState([]);
  const [ cardToDelete, setCardToDelete ] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([ api.getUserInfo(), api.getInitialCards() ])
      .then(res => {
        const [ userInfo, cardsArray ] = res;
        setCards(cardsArray);
        setCurrentUser(userInfo);
      })
      .catch(err => console.log(err));
  }, [])

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setSelectedCard({});
    setCardToDelete(null);
  }

  function handleUpdateAvatar(avatarData) {
    setIsLoading(true);

    api.updateAvatar(avatarData)
      .then(userInfo => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(userInfo) {
    setIsLoading(true);

    api.setUserInfo(userInfo)
      .then(data => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.changeLikeCardStatus(isLiked, card.id )
    .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card.id ? newCard : c));
    })
    .catch(err => console.log(err));
  }

  function handleCardDelete(card) {
    setCardToDelete(card.id);
  }

  function handleConfirmDelete() {
    api.deleteCard(cardToDelete)
    .then(() => {
      setCards(cards.filter(c => c._id !== cardToDelete))
      closeAllPopups();
    })
    .catch(err => console.log(err));
}

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);

    api.addNewCard(data)
      .then(newCard => {
        setCards([newCard, ...cards])
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <Header />
        <Main 
          onEditProfile={setIsEditProfilePopupOpen}
          onEditAvatar={setIsEditAvatarPopupOpen}
          onAddPlace={setIsAddPlacePopupOpen}
          cards={cards}
          onCardLike={handleCardLike}
          onCardClick={setSelectedCard}
          onCardDelete={handleCardDelete}
        />
        <Footer />
        <ImagePopup 
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onLoading={isLoading}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          onLoading={isLoading}
        />       
        <ConfirmPopup
          isOpen={!!cardToDelete}
          onClose={closeAllPopups}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;