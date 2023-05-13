import React from "react";
import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form name="register" noValidate className="auth__form">
        <input type="email" name="email" className="auth__input" placeholder="Email" />
        <input type="password" name="password" className="auth__input" placeholder="Пароль" />
        <button type="submit" className="auth__button">Зарегистрироваться</button>
      </form>
      <p className="auth__description">Уже зарегистрированы?&nbsp;<Link to='/sing-in' className="auth__link">Войти</Link></p>
    </div>
  )
}