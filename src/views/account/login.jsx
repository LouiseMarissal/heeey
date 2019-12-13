import React, { useState, useEffect, useContext } from "react";
import APIHandler from "./../../api/APIHandler";
import UserContext from "./../../auth/UserContext";
import { NavLink } from "react-router-dom";

export default function Login(props) {
  const [formValues, setFormValues] = useState({});
  const userContext = useContext(UserContext);
  const { setCurrentUser } = userContext;
  const [errorMessage, setErrorMessage] = useState("");
  const [hideErrorMessage, setHideErrorMessage] = useState(true);

  const handleChange = e => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    APIHandler.post(process.env.REACT_APP_BACKEND_URL + "/auth-routes/signin", {
      formValues
    })
      .then(dbRes => {
        if (dbRes.data._id) {
          setCurrentUser(dbRes.data);
          props.history.push("/profile/" + dbRes.data._id);
        } else {
          setErrorMessage(dbRes.data);
          setHideErrorMessage(false);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="signin-form-container">
      <form className="form" onChange={handleChange} onSubmit={handleSubmit}>
        <h1 className="login-title">Nice to see you back !</h1>
        <input className="input" name="email" placeholder="example@email.fr" />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="*****"
        />

        {!hideErrorMessage ? (
          <div className="alert alert-warning" role="alert">
            {errorMessage}
          </div>
        ) : (
          ""
        )}
        <button className="login-btn">Submit</button>
        <NavLink
          className="link-login"
          style={{
            textDecoration: "none",
            color: "black"
          }}
          to="/Signup"
        >
          No account yet ? Signup !
        </NavLink>
      </form>
    </div>
  );
}
