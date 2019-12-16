import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./../../css/EditCocktail.css";
import { useAuth } from "../../auth/useAuth";
const EditCocktail = props => {
  const { isLoading, currentUser } = useAuth();
  const [formValues, setFormValues] = useState({});
  const [cocktail, setCocktail] = useState({});
  const [ingredientsFields, setIngredientsFields] = useState([]);
  const [measuresFields, setMeasuresFields] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsAdded, setTagsAdded] = useState([]);
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
        setCocktail(res.data.fullCocktail);
        setIngredientsFields(res.data.fullCocktail.Ingredients);
        setMeasuresFields(res.data.fullCocktail.Measures);
        setTagsAdded(res.data.fullCocktail.tags);

        // let tagsLeftToAdd = res.data.fullTags.filter(tagLeft => {
        //   for (let i = 0; i < tagsAdded; i++) {
        //     console.log(tagsAdded[i]._id);
        //     if (tagLeft._id !== tagsAdded[i]._id) {
        //       console.log("différent !");
        //     }
        //   }
        // });
        // console.log("coucou");
        // console.log(tagsLeftToAdd);
        // setTags(tagsLeftToAdd);
      })
      .catch(err => {
        console.log(err);
      });
  }, [props.match.params.id]);

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
    var index = e.target.id;
    array.splice(index, 1);
    setIngredientsFields(array);

    var measureArray = [...measuresFields];
    measureArray.splice(index, 1);
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
        props.history.push("/profile/" + currentUser._id);
      })
      .catch(err => console.log(err));
  };
  if (cocktail.Ingredients !== undefined) {
    return (
      <div className="edit-cocktail-container">
        <form
          className="formEdit"
          onSubmit={handleSubmit}
          onChange={handleChange}
        >
          <h1 className="titleEdit">Edit your cocktail</h1>
          <input
            className="inputEdit"
            placeholder="Name"
            name="Name"
            type="text"
            defaultValue={cocktail.Name}
            onChange={handleChange}
            id="Name"
          />

          <input
            className="inputEdit"
            placeholder="Glass"
            name="Glass"
            id="Glass"
            type="text"
            defaultValue={cocktail.Glass}
            onChange={handleChange}
          />

          <textarea
            className="inputEdit inputEdit-textArea"
            placeholder="Instructions"
            name="Instructions"
            id="Instructions"
            defaultValue={cocktail.Instructions}
            onChange={handleChange}
            maxLength="500"
            rows="4"
            required
          ></textarea>

          <input
            className="inputEdit"
            placeholder="Image"
            type="file"
            onChange={handleChange}
            id="Image"
            name="Image"
          />
          <div className="measure-ingredient-container">
            <div className={`ingredient-container`}>
              <div
                className={`${
                  ingredientsFields.length === 0 ? "" : "yellow-border"
                }`}
              >
                <h4 className="add-Ingredient-title">Add ingredients</h4>
                {ingredientsFields.length === 0 ? (
                  <p className="ingredientInfo">No ingredients yet!</p>
                ) : (
                  <ul className="ingredientList">
                    {ingredientsFields.map((ingredient, i) => (
                      <li key={i} className="ingredients-list-edit">
                        {ingredient} {measuresFields[i]}
                        <i
                          className="fas fa-minus"
                          id={i}
                          onClick={removeIngredients}
                        ></i>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="ingredientAndMeasureContainerEdit">
                <div className="inputIngredientsContainer">
                  <input
                    type="text"
                    ref={ingredientsRef}
                    name="Ingredients"
                    className="inputEdit"
                    placeholder="Add Ingredient"
                  />

                  <input
                    type="text"
                    ref={measuresRef}
                    name="Measures"
                    className="inputEdit"
                    placeholder="Measure"
                  />
                </div>
                <div className="addCocktail">
                  <span className="addButton">
                    <i className="fas fa-plus" onClick={addIngredientInput}></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h4 className="h4">Add tags</h4>
          {tagsAdded.length === 0 ? (
            <p className="tagsInfo-edit">No tags yet!</p>
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
            <p className="tagsInfo-edit">
              Wow ! This cocktail has a lot of tags !
            </p>
          )}

          <button className="btn-Edit">Edit</button>
        </form>
      </div>
    );
  } else return null;
};
export default EditCocktail;
