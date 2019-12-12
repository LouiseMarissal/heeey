import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/useAuth";

const AddCoktail = props => {
  const { isLoading, currentUser } = useAuth();
  const [formValues, setFormValues] = useState({});
  const measuresRef = useRef();
  const ingredientsRef = useRef();
  const [ingredientsFields, setIngredientsFields] = useState([]);
  const [measuresFields, setMeasuresFields] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsAdded, setTagsAdded] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/tags", {
        withCredentials: true
      })
      .then(dbRes => {
        setTags(dbRes.data);
      })
      .catch(dbErr => console.log(dbErr));
  }, []);

  const addTag = e => {
    const tagsToAdd = [...tags];
    let tagsToDelete = [...tagsAdded];
    tagsToAdd.forEach((tag, i) => {
      if (tag._id === e.target.id) {
        tagsToAdd.splice(i, 1);
        if (tagsToDelete.length === 0) {
          tagsToDelete = [tag];
        } else tagsToDelete.push(tag);
      }
    });
    setTags(tagsToAdd);
    setTagsAdded(tagsToDelete);
    const copiedValues = { ...formValues };
    if (Array.isArray(copiedValues.tags)) {
      copiedValues.tags.push(e.target.id);
    } else copiedValues.tags = [e.target.id];
    setFormValues(copiedValues);
  };

  const removeTag = e => {
    let tagsToAdd = [...tags];
    let tagsToDelete = [...tagsAdded];
    const copiedValues = { ...formValues };
    tagsToDelete.forEach((tag, i) => {
      if (tag._id === e.target.id) {
        tagsToDelete.splice(i, 1);
        if (tagsToAdd.length === 0) {
          tagsToAdd = [tag];
        } else tagsToAdd.push(tag);
      }
    });
    setTags(tagsToAdd);
    setTagsAdded(tagsToDelete);
    if (copiedValues.tags) {
      if (copiedValues.tags.length > 1) {
        copiedValues.tags.forEach((id, i) => {
          if (id === e.target.id) {
            copiedValues.tags.splice(i, 1);
          }
        });
      } else copiedValues.tags = [];
      setFormValues(copiedValues);
    }
  };

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

  const handleSubmit = e => {
    e.preventDefault();
    // if (formValues.tags) {
    //   formValues.tags.map(_id => ({ _id }));
    // }
    formValues.Ingredients = ingredientsFields;
    formValues.Measures = measuresFields;
    console.log(formValues);
    const formData = new FormData();
    for (let key in formValues) {
      if (Array.isArray(formValues[key])) {
        for (let value of formValues[key]) {
          formData.append(key, value);
        }
      } else formData.append(key, formValues[key]);
    }
    // setFormValues(formData);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/cocktail", formData, {
        withCredentials: true
      })
      .then(res => {
        console.log("POST COCKTAIL", currentUser._id);
        props.history.push("/profile/" + currentUser._id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleChangeForm = e => {
    // e.preventDefault();
    if (e.target.type === "checkbox") {
      setFormValues({ ...formValues, [e.target.name]: e.target.checked });
    } else if (e.target.type === "file") {
      setFormValues({ ...formValues, [e.target.name]: e.target.files[0] });
    } else setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="add-cocktail-form-container">
          <div>
            <h1 className="h1">Create your own Cocktail</h1>
            <form
              className="addCocktailForm"
              onSubmit={handleSubmit}
              onChange={handleChangeForm}
            >
              <input
                type="text"
                name="Name"
                className="input"
                placeholder="Name"
              />
              <input
                type="text"
                name="Glass"
                className="input"
                placeholder="Glass"
              />
              <input
                type="text"
                name="Instructions"
                className="input"
                placeholder="Recipe"
              />
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
                              className="fas fa-minus button"
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
                    <i
                      className="fas fa-plus button"
                      onClick={addIngredientInput}
                    ></i>
                  </span>
                </div>
                {/* START OF ADD TAG */}

                <h4 className="h4">Add tags</h4>
                {tagsAdded.length === 0 ? (
                  <p className="tagsInfo">No tags yet!</p>
                ) : (
                  <div className="tagsList">
                    {tagsAdded.map((tag, i) => (
                      <span
                        key={i}
                        className="tagContainer button"
                        id={tag._id}
                        onClick={removeTag}
                      >
                        {tag.name}
                        <i className="fas fa-minus" id={tag._id}></i>
                      </span>
                    ))}
                  </div>
                )}
                {tags.length > 0 ? (
                  <div className="tagsList">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="tagContainer button"
                        onClick={addTag}
                        id={tag._id}
                      >
                        {tag.name}
                        <i className="fas fa-plus" id={tag._id}></i>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="tagsInfo">
                    Wow ! This cocktail has a lot of tags !
                  </p>
                )}

                {/* END OF ADD TAG */}
              </div>
              <div className="is-alcoholic">
                <label htmlFor="Alcoholic">Contains Alcohol ?</label>
                <input
                  type="checkbox"
                  name="Alcoholic"
                  id="Alcoholic"
                  className="input"
                />
              </div>
              <input type="file" name="Image" className="input" />

              <button
                className="addButton"
                to="/profile/5dee1baa0c0f7a1fcdef5f9a"
              >
                Add!
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoktail;
