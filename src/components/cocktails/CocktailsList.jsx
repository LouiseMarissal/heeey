import React, { Suspense } from "react";
import {} from "react";

import CocktailCard from "./CocktailCard";
const List = ({ cocktails, cocktailsFav }) => {
  return (
    <div className="fullcocktail">
      {cocktails.map((cocktail, i) => (
        <Suspense
          key={i}
          fallback={<img src="./img/shaker.jpg" className="loadingShaker" />}
        >
          <CocktailCard
            key={i}
            cocktail={cocktail}
            cocktailsFav={cocktailsFav}
          />
        </Suspense>
      ))}
    </div>
  );
};
export default List;
