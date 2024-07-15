import * as React from 'react';
import s from './register.module.css';

const Register = (): JSX.Element => {

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
  };

  return (
  <main>
    <div>
      <section>
        <h1>Sign up</h1>
        <form action="#" method="post" onSubmit={handleFormSubmit}>
            <div className="login__input-wrapper form__input-wrapper">
              <label className="visually-hidden">Name</label>
              <input
                className="login__input form__input"
                type="text"
                name="name"
                placeholder="Name"
                required
                minLength={1}
                maxLength={15}
              />
            </div>
            <div className="">
              <label className="visually-hidden">E-mail</label>
              <input
                className=""
                type="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="">
              <label className="visually-hidden">Password</label>
              <input
                className=""
                type="password"
                name="password"
                placeholder="Password"
                required
                minLength={6}
                maxLength={12}
              />
            </div>
            <button
              className="login__submit form__submit button"
              type="submit"
            >
                Sign up
            </button>
          </form>
        </section>
      </div>
    </main> 
)}

export default Register;