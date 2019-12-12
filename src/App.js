import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./css/layout.css";
import "./css/Bars.css";
import "./css/signup-in.css";
import NavBar from "./components/Bars/NavBar";
import Home from "./views/Home";
import PageFourOhFour from "./views/PageFourOhFour";
import OneCocktail from "./views/cocktails/OneCocktail";
import Login from "./views/account/login";
import Signup from "./views/account/signup";
import Profile from "./views/account/UserProfile";
import "bootstrap/dist/css/bootstrap.min.css";
import AddCoktail from "./views/cocktails/AddCoktail";
import EditCocktail from "./views/cocktails/EditCocktail";
//auth
import { useAuth } from "./auth/useAuth";
import UserContext from "./auth/UserContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";

function App(props) {
  const { isLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

  // MANDATORY TO GET/SET currentUser according to server response
  // check src/auth/UserContext
  const UserContextValue = {
    currentUser,
    setCurrentUser
  };

  // useEffect(() => {
  //   var searchBar = document.getElementById("searchBar");
  //   var navBar = document.getElementById("navBar");
  //   if (searchBar) {
  //     navBar.className = "nav-bar white";
  //   } else {
  //     navBar.className = "nav-bar regular";
  //   }
  // }, []);
  return (
    <UserContext.Provider value={UserContextValue}>
      {isLoading ? null : (
        <div className="App">
          <NavBar user={currentUser} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <ProtectedRoute path="/profile/:id" component={Profile} />
            <Route path="/one-cocktail/:id" component={OneCocktail} />
            <ProtectedRoute path="/add-cocktail" component={AddCoktail} />
            <ProtectedRoute
              path="/edit-cocktail/:id"
              component={EditCocktail}
            />
            {/* <ProtectedRoute path="/logout" /> */}
            <Route path="*" component={PageFourOhFour} />
          </Switch>
        </div>
      )}
    </UserContext.Provider>
  );
}

export default App;
