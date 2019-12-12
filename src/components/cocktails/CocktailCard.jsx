import React, { useState, useEffect } from "react";
import "./../../css/CocktailCard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../auth/useAuth";

export default function CocktailCard({ cocktail, cocktailsFav }) {
  const [like, setLike] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (cocktailsFav.length > 0) {
      cocktailsFav.map(cocktailFav => {
        var thisCocktailId = cocktail._id;
        var cocktailId = document.getElementById(thisCocktailId);
        var cocktailFavId = cocktailFav._id;
        if (
          thisCocktailId === cocktailFavId &&
          cocktailId.className.includes("fa-glass-cheers")
        ) {
          cocktailId.className =
            "fas fa-glass-cheers is-rotating cheers cheersOrange";
        }
      });
    }
    setLike(cocktail.Like);
  }, []);

  const handleClickLike = e => {
    const id = cocktail._id;
    if (e.target.className === "fas fa-glass-cheers cheers") {
      addLike(id);
      e.target.className =
        "fas fa-glass-cheers is-rotating cheers cheersOrange";
    } else {
      removeLike(id);
      e.target.className = "fas fa-glass-cheers cheers";
    }
  };

  const addLike = id => {
    let newValue = 0;
    axios
      .patch(
        process.env.REACT_APP_BACKEND_URL + "/cocktail/addLike/" + id,
        {
          cocktail
        },
        {
          withCredentials: true
        }
      )
      .then(dbRes => {
        newValue = dbRes.data.Like;
        setLike(newValue);
      })
      .catch(dbErr => console.log(dbErr));
  };

  const removeLike = id => {
    let newValue = 0;
    axios
      .patch(
        process.env.REACT_APP_BACKEND_URL + "/cocktail/removeLike/" + id,
        {
          cocktail
        },
        {
          withCredentials: true
        }
      )
      .then(dbRes => {
        newValue = dbRes.data.Like;
        setLike(newValue);
      })
      .catch(dbErr => console.log(dbErr));
  };

  return (
    <>
      <div className="CocktailCard">
        <div className="cocktailCardNameContainer">
          <Link className="cocktailName" to={`/one-cocktail/${cocktail._id}`}>
            {cocktail.Name}
          </Link>
        </div>
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <div
                style={{
                  background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${cocktail.Image})`
                }}
                className="photo"
              ></div>
            </div>
            <div className="flip-card-back">
              <ul>
                {cocktail.Ingredients.map((i, index) =>
                  i !== "" && i !== null && i && "/n" ? (
                    <li key={index} className="ingredient">
                      {i}
                    </li>
                  ) : (
                    ""
                  )
                )}
              </ul>
              <div className="tagsListContainer">
                {cocktail.tags.map((tag, i) =>
                  tag !== "" && tag !== null && tag ? (
                    <div key={i} className="tagContainer">
                      <span key={i} className="tagDisplay">
                        {tag.name}
                      </span>
                    </div>
                  ) : (
                    ""
                  )
                )}
              </div>
              <div className="likeContainer">
                {currentUser ? (
                  <i
                    className="fas fa-glass-cheers cheers"
                    id={cocktail._id}
                    onClick={handleClickLike}
                  ></i>
                ) : (
                  <Link style={{ color: "white" }} className="link" to="/login">
                    <i
                      className="fas fa-glass-cheers cheers"
                      id={cocktail._id}
                    ></i>
                  </Link>
                )}
                <span className="likeCounter">{like}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
