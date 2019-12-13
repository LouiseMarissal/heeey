import React, { useEffect, useState } from "react";
import { Dropdown, Card } from "react-bootstrap";
import "./../../css/userCocktailCard.scss";
import axios from "axios";

const UserCocktailCard = ({ userCocktails, props }) => {
  // const [userCocktail, setUserCocktails] = useState([]);
  const [cocktails, setCocktails] = useState([]);

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
      <div className="cocktail-user-card">
        <Card.Img variant="top" src={userCocktails.Image} />
      </div>

      <Card.Body>
        <Card.Title>{userCocktails.Name}</Card.Title>

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
            className="fas fa-trash-alt"
            onClick={() => props(userCocktails._id)}
          ></i>
          <Dropdown.Menu>
            <Dropdown.Item href={`/edit-cocktail/${userCocktails._id}`}>
              Edit Cocktails
            </Dropdown.Item>
            <Dropdown.Item href={`/one-cocktail/${userCocktails._id}`}>
              Show Cart
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Body>
    </Card>
  );
};
export default UserCocktailCard;
