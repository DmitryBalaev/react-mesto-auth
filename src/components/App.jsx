import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import AddPlacePopup from './AddPlacePopup'
import ConfirmPopup from './ConfirmPopup'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import ImagePopup from './ImagePopup'
import Register from './Register'
import { api } from '../utils/api'
import { CurrentUserContext } from '../context/CurrentUserContext'
import ProtectRouteElement from './ProtectedRoute'
import Login from './Login'
import * as auth from '../utils/Auth'

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false)
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false)
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false)
  const [isConfirmPopupOpen, setConfirmPopupOpen] = React.useState(false)
  const [selectedCard, setSelectedCard] = React.useState({})
  const [currentUser, setCurrentUser] = React.useState({})
  const [cards, setCards] = React.useState([])
  const [loggedIn, setLoggedIn] = React.useState(false)
  

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user)
        setCards(cards)
      })
      .catch(err => console.log(err))
  }, [])

  function handleImageClick(card) {
    setSelectedCard(card)
    setImagePopupOpen(true)
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true)
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true)
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false)
    setAddPlacePopupOpen(false)
    setEditAvatarPopupOpen(false)
    setImagePopupOpen(false)
    setConfirmPopupOpen(false)
    setTimeout(() => {
      setSelectedCard({})
    }, 500)
  }

  function handleTrashIconClick(card) {
    setConfirmPopupOpen(true)
    setSelectedCard(card)
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id)

    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err))
  }

  function handleCardDelete() {
    api.deleteCard(selectedCard._id)
      .then(() => {
        setTimeout(() => {
          setCards(cards.filter((item) => item._id !== selectedCard._id))
          closeAllPopups()
        }, 500)
      })
      .catch(err => console.log(err))
    setSelectedCard({})
  }

  function handleUpdateUser(value) {
    api.sendUserData(value)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
  }

  function handleUpdateAvatar(value) {
    api.sendAvatar(value)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
  }

  function handleAddPlaceSubmit(value) {
    api.sendNewCard(value)
      .then((res) => {
        setCards([res, ...cards])
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <Header 
          loggedIn={loggedIn}
        />
        <Routes>
          <Route
            path='/'
            element={
              <ProtectRouteElement
                element={Main}
                onCardDelete={handleTrashIconClick}
                onCardLike={handleCardLike}
                onEditAvatar={handleEditAvatarClick}
                onAddPlace={handleAddPlaceClick}
                onEditProfile={handleEditProfileClick}
                onImageClick={handleImageClick}
                onTrashIconClick={handleTrashIconClick}
                cards={cards}
                loggedIn={loggedIn}
              />}
          />
          <Route 
            path='/sing-up'
            element={
            <Register
              
            />}
          />
          <Route
            path='sing-in'
            element={
              <Login/>
            }
          />
        </Routes>
        {loggedIn && <Footer />}
        {loggedIn && <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />}
        {loggedIn && <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />}
        {loggedIn && <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />}
        {loggedIn && <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
        />}
        {loggedIn && <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />}
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
