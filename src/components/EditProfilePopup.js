import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../context/CurrentUserContext";

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [formData, setFormData] = React.useState({ name: currentUser.name, about: currentUser.about });

  React.useEffect(() => {
    setFormData({ name: currentUser.name, about: currentUser.about })
  }, [props.isOpen, currentUser]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser(formData.name, formData.about);
  }

  return (
      <PopupWithForm
          name="edit"
          isOpen={props.isOpen}
          title="Редактировать профиль"
          submitButtonTextContent='Сохранить'
          onClosePopup={props.onClose}
          onSubmit={handleSubmit}
      >
        <input onChange={handleChange} value={formData.name || ''} type="text" name="name" placeholder="Ваше имя" id="name-input"
               className="popup__input popup__input_type_name" minLength="2" maxLength="40" required autoComplete="off" />
        <span className="popup__error name-input-error"></span>
        <input onChange={handleChange} value={formData.about || ''} type="text" name="about" placeholder="Ваша деятельность" id="activity-input"
               className="popup__input popup__input_type_activity" minLength="2" maxLength="200" required autoComplete="off" />
        <span className="popup__error activity-input-error"></span>
      </PopupWithForm>
  )
}

export default EditProfilePopup