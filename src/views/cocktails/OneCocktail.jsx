import React, { useState, useEffect } from "react";
import "./../../css/OneCocktail.scss";
import axios from "axios";
import FormComment from "../../components/comments/FormComment";

export default function OneCocktail(props) {
  const [cocktail, setCocktail] = useState([]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL + "/cocktail/" + props.match.params.id
      )
      .then(dbRes => setCocktail(dbRes.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    var searchBar = document.getElementById("searchBar");
    var navBar = document.getElementById("navBar");
    if (searchBar) {
      navBar.className = "nav-bar white";
    } else {
      navBar.className = "nav-bar regular";
    }
  }, []);

  if (cocktail.Ingredients !== undefined) {
    return (
      <>
        <div className="cocktailView">
          <div className="cocktailDisplay">
            <div className="titleContainer">
              <div className="title">{cocktail.Name}</div>
            </div>
            <div className="fullDetails">
              <div className="infosContainer">
                <div className="imageAndIngredientContainer">
                  <div className="cocktailImageContainer">
                    <div
                      style={{
                        background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${cocktail.Image})`
                      }}
                      className="cocktailImage"
                    ></div>
                  </div>
                  <div className="ingredientAndMeasureContainer">
                    <div className="whatDoINeed">What do i need ?</div> <br />
                    <ul className="ingredients" style={{ padding: 0 }}>
                      {cocktail.Ingredients.map((Ingredient, i) => {
                        if (Ingredient !== "" && Ingredient !== null) {
                          return (
                            <li key={i}>
                              <span className="ingredient">{Ingredient} </span>
                              <span>
                                {cocktail.Measures[i] ? (
                                  <span className="measures" key={i}>
                                    ({cocktail.Measures[i++]})
                                  </span>
                                ) : null}
                              </span>
                            </li>
                          );
                        } else return null;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="instructionContainer">
                <div className="howDoIMakeIt">How do i make it ?</div>
                <div className="instructions">{cocktail.Instructions}</div>
              </div>
            </div>
          </div>
          <FormComment
            CocktailId={props.match.params.id}
            UserId={props.match.params.id}
          />
        </div>
      </>
    );
  } else return null;
}
