import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

// PRO USER
const Signup = props => {
  const [formValues, setFormValues] = useState({});
  const [formProDisplay, setFormProDisplay] = useState(false);

  const formData = new FormData();
  for (let key in formValues) {
    formData.append(key, formValues[key]);
  }

  useEffect(() => {
    var searchBar = document.getElementById("searchBar");
    var navBar = document.getElementById("navBar");
    if (searchBar) {
      navBar.className = "nav-bar white";
    } else {
      navBar.className = "nav-bar regular";
    }
  }, []);

  const postAxios = () => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/auth-routes/signup", formData)
      .then(res => {
        props.history.push("/login");
        console.log("user successfully added to database");
      })
      .catch(err => {
        console.log(formValues);
        console.log(err);
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (formProDisplay) {
      setFormValues({ ...formValues, isPro: true, role: "pro" });
    } else {
      setFormValues({ ...formValues, isPro: false, role: "user" });
    }
    postAxios();
  };

  const handleClick = e => {
    var isPro = e.target.checked;
    setFormValues({ ...formValues, isPro: isPro });
    setFormProDisplay(isPro);
  };

  const handleChange = e => {
    if (e.target.type !== "checkbox" && e.target.type !== "file") {
      setFormValues({ ...formValues, [e.target.name]: e.target.value });
    } else if (e.target.type === "file") {
      setFormValues({ ...formValues, [e.target.name]: e.target.files[0] });
    } else return;
    console.log(formValues);
  };
  return (
    <div className="signup-form-container">
      <form
        className="Signup-form"
        onSubmit={handleSubmit}
        onChange={handleChange}
      >
        <h1 className="registertitle">Register</h1>
        <input
          className="input"
          name="firstName"
          placeholder="First Name"
          required
        />
        <input className="input" name="name" placeholder="Last name" required />
        <input
          className="input"
          name="email"
          type="email"
          placeholder="name@email.fr"
          required
        />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="******"
          required
        />
        <input className="input" name="photo" id="photo" type="file" />
        {/* mettre un ternary ici pour afficher le reste du forme au click du "isPro" */}
        <label htmlFor="isPro">I am a professional</label>
        <input
          className="input-isPro"
          type="checkbox"
          id="isPro"
          onClick={handleClick}
        />
        {formProDisplay ? (
          <>
            <input
              name="companyName"
              className="input"
              placeholder="Your company's name"
              required
            />
            <input
              name="barName"
              className="input"
              placeholder="Your bar's name"
            />
          </>
        ) : (
          ""
        )}
        <button className="btn-register">Submit</button>
      </form>
    </div>
  );
};

export default Signup;
