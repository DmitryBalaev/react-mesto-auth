import React from "react";

export default function Login() {
  return (
    <div className="auth">
      <h2 className="auth__title">Вход</h2>
      <form name="login" noValidate className="auth__form">
        <input type="email" name="email" className="auth__input" placeholder="Email" />
        <input type="password" name="password" className="auth__input" placeholder="Пароль" />
        <button type="submit" className="auth__button">Войти</button>
      </form>
    </div>
  )
}