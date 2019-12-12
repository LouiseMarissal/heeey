import React, { useEffect, useState } from "react";
import { Dropdown, Card } from "react-bootstrap";
import "./../../css/userCocktailCard.scss";
import axios from "axios";

const LikeCocktail = ({ likedCocktail, clbk, cocktailsFav }) => {
  //   const [userCocktail, setUserCocktails] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [like, setLike] = useState([]);

  useEffect(() => {
    // console.log(cocktailsFav);
    if (cocktailsFav) {
      cocktailsFav.map((cocktailFav, i) => {
        var thisCocktailId = likedCocktail._id;
        var cocktailId = document.getElementById(thisCocktailId);
        var cocktailFavId = cocktailFav._id;
        // console.log(thisCocktailId + "and" + cocktailFavId);
        if (
          thisCocktailId === cocktailFavId &&
          cocktailId.className.includes("fa-glass-cheers")
        ) {
          cocktailId.className =
            "fas fa-glass-cheers is-rotating cheers cheersOrange";
        }
      });
    }
    setLike(likedCocktail.Like);
  }, []);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/cocktail", {
        withCredentials: true
      })
      .then(res => {
        setCocktails(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <Card style={{ width: "8rem" }} className="user-cocktail-list">
      <Card.Img variant="top" src={likedCocktail.Image} />
      <Card.Body>
        <Card.Title>{likedCocktail.Name}</Card.Title>

        <Dropdown>
          <Dropdown.Toggle
            variant="success"
            id="dropdown-basic"
            className="Manage"
            style={{
              backgroundColor: "#ffb200",
              border: "none",
              padding: "none"
            }}
          >
            more..
          </Dropdown.Toggle>
          <i
            className="fas fa-glass-cheers"
            onClick={() => clbk(likedCocktail._id)}
          ></i>{" "}
          <span>{likedCocktail.Like}</span>
          <Dropdown.Menu>
            <Dropdown.Item href={`/one-cocktail/${likedCocktail._id}`}>
              Show Recipe
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Body>
    </Card>
  );
};
export default LikeCocktail;
