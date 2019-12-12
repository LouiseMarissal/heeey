import { useEffect, useState } from "react";
import axios from "axios";

export default function useSearch(query) {
  const [queryFiltered, setQueryFiltered] = useState([]);
  const [favCocktails, setFavCocktails] = useState([]);

  useEffect(() => {
    let cancel;
    return axios({
      method: "GET",
      url: process.env.REACT_APP_BACKEND_URL + "/cocktail",
      params: { query },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
      .then(res => {
        setFavCocktails(res.data.cocktailsWithFavorites);
        setQueryFiltered(res.data.dbRes);
      })
      .catch(err => {
        if (axios.isCancel(err)) return;
      });
    return () => cancel();
  }, [query]);

  return {favCocktails, queryFiltered};
}


function utilsSearch(query) {
  let cancel;
  return axios({
    method: "GET",
    url: process.env.REACT_APP_BACKEND_URL + "/cocktail",
    params: { query },
    cancelToken: new axios.CancelToken(c => (cancel = c))
  })
  .then(res => {
    setFavCocktails(res.data.cocktailsWithFavorites);
    setQueryFiltered(res.data.dbRes);
  })
  .catch(err => {
    if (axios.isCancel(err)) return;
  })
}

utilsSearch().then().catch()
