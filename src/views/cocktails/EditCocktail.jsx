import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../auth/useAuth";
const EditCocktail = props => {
  const { isLoading, currentUser } = useAuth();
  const [formValues, setFormValues] = useState({});
  const [cocktail, setCocktail] = useState({});
  const [ingredientsFields, setIngredientsFields] = useState([]);
  const [measuresFields, setMeasuresFields] = useState([]);
  const ingredientsRef = useRef();
  const measuresRef = useRef();

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          "/cocktail/profile/edit-cocktail/" +
          props.match.params.id
      )
      .then(res => {
        console.log("ICI?", res.data);
        setCocktail(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [props.match.params.id]);

  // ADD ingredients & Measures in list
  const addIngredientInput = e => {
    // take the value from ingredients inputs
    e.preventDefault();
    let ingredients = ingredientsRef.current.value;
    const copy = [...ingredientsFields];
    copy.push(ingredients);
    ingredientsRef.current.value = "";
    //take the value from measure input
    setIngredientsFields(copy);
    let measures = measuresRef.current.value;
    const copy2 = [...measuresFields];
    copy2.push(measures);
    measuresRef.current.value = "";
    setMeasuresFields(copy2);
  };
  // Remove ingredients
  const removeIngredients = e => {
    e.preventDefault();
    var array = [...ingredientsFields];
    var index = array.indexOf(e.target.value);
    array.splice(index, 1);
    setIngredientsFields(array);

    var measureArray = [...measuresFields];
    var index2 = measureArray.indexOf(e.target.value);
    measureArray.splice(index2, 1);
    setMeasuresFields(measureArray);
  };

  const handleChange = e => {
    if (e.target.type === "checkbox") {
      setFormValues({ ...formValues, [e.target.name]: e.target.checked });
    } else if (e.target.type === "file") {
      setFormValues({ ...formValues, [e.target.name]: e.target.files[0] });
    } else setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    formValues.Ingredients = ingredientsFields;
    formValues.Measures = measuresFields;

    const formData = new FormData();
    for (let key in formValues) {
      if (Array.isArray(formValues[key])) {
        for (let value of formValues[key]) {
          formData.append(key, value);
        }
      } else formData.append(key, formValues[key]);
    }
    axios
      .patch(
        process.env.REACT_APP_BACKEND_URL +
          "/cocktail/profile/edit-cocktail/" +
          props.match.params.id,
        formData,
        { withCredentials: true }
      )
      .then(res => {
        console.log(currentUser, "currentuser-------");
        props.history.push("/profile/" + currentUser._id);
      })
      .catch(err => console.log(err));
  };
  console.log(cocktail.Ingredients);
  console.log(cocktail.Measures);
  if (cocktail.Ingredients !== undefined) {
    return (
      <div className="edit-cocktail-container">
        <h1>Edit your cocktail</h1>
        <form onSubmit={handleSubmit} onChange={handleChange}>
          <p>Name</p>
          <input
            name="Name"
            type="text"
            defaultValue={cocktail.Name}
            onChange={handleChange}
            id="Name"
          />

          <p>Glass</p>
          <input
            name="Glass"
            id="Glass"
            type="text"
            defaultValue={cocktail.Glass}
            onChange={handleChange}
          />
          <p>Recipe</p>
          <input
            name="Instructions"
            id="Instructions"
            type="text"
            defaultValue={cocktail.Instructions}
            onChange={handleChange}
          />
          <p>IMAGE</p>
          <input type="file" onChange={handleChange} id="Image" name="Image" />
          <div className="measure-ingredient-container">
            <div className={`ingredient-container`}>
              <div
                className={`${
                  ingredientsFields.length === 0 ? "" : "yellow-border"
                }`}
              >
                <h4 className="h4">Add ingredients</h4>
                {ingredientsFields.length === 0 ? (
                  <p className="ingredientInfo">No ingredients yet!</p>
                ) : (
                  <ul className="ingredientList">
                    {ingredientsFields.map((ingredient, i) => (
                      <li key={i} className="ingredients-list">
                        {ingredient} {measuresFields[i]}
                        <i
                          className="fas fa-minus"
                          onClick={removeIngredients}
                        ></i>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <input
                type="text"
                ref={ingredientsRef}
                name="Ingredients"
                className="input"
                placeholder="Add Ingredient"
              />

              <input
                type="text"
                ref={measuresRef}
                name="Measures"
                className="input"
                placeholder="Measure"
              />
            </div>

            <div className="addCocktail">
              <span className="addButton">
                <i className="fas fa-plus" onClick={addIngredientInput}></i>
              </span>
            </div>
          </div>
          <button className="btn">Edit</button>
        </form>
      </div>
    );
  } else return null;
};
export default EditCocktail;
