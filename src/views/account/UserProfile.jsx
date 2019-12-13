import React, { useState, useEffect, useRef, useContext } from "react";
import "./../../css/AddCocktail.scss";
import UserCocktailCard from "./../../components/cocktails/UserCocktailCard";
import axios from "axios";
import "./../../css/UserProfile.scss";
import { Link } from "react-router-dom";
import LikeCocktail from "../../components/cocktails/LikeCocktail";
import { useAuth } from "../../auth/useAuth";

const UserProfile = props => {
  const { isLoading, currentUser } = useAuth();
  const [userCocktails, setUserCocktails] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // call user cokctail favorites
  useEffect(id => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          "/userProfile/" +
          props.match.params.id,
        {
          withCredentials: true
        }
      )
      .then(dbRes => {
        setFavorites(dbRes.data.favorites);
        // console.log(dbRes.data.favorites);
      })
      .catch(dbErr => {
        console.log(dbErr);
      });
  }, []);

  // Unlike the cocktail
  const handleUnlike = id => {
    const copy = favorites.filter(f => f._id !== id);
    setFavorites(copy);
    // console.log(copy);
    axios
      .patch(process.env.REACT_APP_BACKEND_URL + "/cocktail/removeLike/" + id, {
        withCredentials: true
      })
      .then(dbRes => {
        setFavorites(dbRes);
        console.log(dbRes);
      })
      .catch(dbErr => {
        console.log(dbErr);
      });
  };

  // get userID to match with cocktails
  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          "/cocktail/userpro-cocktail/" +
          props.match.params.id,
        {
          withCredentials: true
        }
      )
      .then(dbRes => {
        console.log(dbRes.data);
        setUserCocktails(dbRes.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // Delete userPro cocktail
  const handleDelete = id => {
    axios
      .delete(process.env.REACT_APP_BACKEND_URL + "/cocktail/" + id, {
        withCredentials: true
      })
      .then(res => {
        const copy = userCocktails.filter(c => c._id !== id);
        setUserCocktails(copy);
      })
      .catch(err => {
        console.log(err);
      });
  };

  console.log(favorites);

  if (isLoading || !currentUser) return null;

  return currentUser.isPro ? (
    <div className="user-profile-container">
      <div className="UserProfileContainer">
        <div className="userCardContainer">
          <div className="userCard">
            <div className="userImage">
              <div className="user">
                <img
                  src={currentUser.photo}
                  alt={currentUser.firstName}
                  className="UserPhotoProfile"
                />

                <div>
                  <h5>Add Cocktails</h5>
                  <Link
                    rel="stylesheet"
                    to="/add-cocktail"
                    className="fas fa-plus"
                  ></Link>
                </div>
              </div>
              <div>
                <h3>Hello {currentUser.firstName}!</h3>
                <h5>{currentUser.companyName}</h5>
                <h6>{currentUser.barName}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h5>My Cocktails</h5>
        <div className="user-cocktail-list">
          {userCocktails.length === 0 ? (
            <p>You don't have any cocktails yet!</p>
          ) : (
            userCocktails.map((cocktail, i) => (
              <UserCocktailCard
                key={i}
                userCocktails={cocktail}
                props={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      <div>
        <h5>My Favorites Cocktails</h5>
        <div className="user-cocktail-list">
          {favorites.length === 0 ? (
            <p>You don't have any favorites yet !</p>
          ) : (
            favorites.map((f, i) => (
              <LikeCocktail key={i} likedCocktail={f} clbk={handleUnlike} />
            ))
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="user-profile-container">
      <div className="UserProfileContainer">
        <div className="userCardContainer">
          <div className="userCard">
            <div className="userImage">
              <div className="user">
                <img
                  src={currentUser.photo}
                  alt={currentUser.firstName}
                  className="UserPhotoProfile"
                />
              </div>
              <div>
                <h3>Hello {currentUser.firstName}!</h3>
                <h5>{currentUser.companyName}</h5>
                <h6>{currentUser.barName}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h5>My Favorites Cocktails</h5>
        <div className="user-cocktail-list">
          {favorites.length === 0 ? (
            <p>You don't have any favorites yet !</p>
          ) : (
            favorites.map((f, i) => (
              <LikeCocktail key={i} likedCocktail={f} clbk={handleUnlike} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default UserProfile;

// update state of cocktail
// useEffect(id => {
//   console.log("icicicicici", id);
//   axios
//     .get(
//       process.env.REACT_APP_BACKEND_URL + "/cocktail/" + props.match.params.id
//     )
//     .then(res => {
//       const copy = cocktails.filter(c => c._id !== id);
//       setCocktails(copy);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }, []);
