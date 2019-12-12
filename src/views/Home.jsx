import React, { useState, useEffect } from "react";
import CocktailsList from "./../components/cocktails/CocktailsList";
// import useSearch from "../components/Bars/UseSearch";
//import filter from "../components/Bars/Filters";
import "./../css/Home.scss";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { useAuth } from "../auth/useAuth";
import axios from "axios";

export default function Home() {
  const { isLoading, currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [myOffset, setOffset] = useState(1);
  const [cocktailsDisplayed, setCocktailsDisplayed] = useState([]);
  const [queryFiltered, setQueryFiltered] = useState([]);
  const [favCocktails, setFavCocktails] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const [isAlcoholic, setIsAlcoholic] = useState(true);

  const handleSearch = e => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    var searchBar = document.getElementById("searchBar");
    var navBar = document.getElementById("navBar");
    if (searchBar) {
      navBar.className = "nav-bar white";
    } else {
      navBar.className = "nav-bar regular";
    }
  }, []);

  useEffect(() => {
    let copy = [...queryFiltered];
    if (isAlcoholic) {
      const elements = copy.splice(0, 20);
      setCocktailsDisplayed(elements);
    } else {
      const nonAlcoholicCopy = copy.filter(cocktail => {
        if (cocktail.Alcoholic === false) {
          return cocktail;
        }
      });
      const elements = nonAlcoholicCopy.splice(0, 20);
      setCocktailsDisplayed(elements);
    }
  }, [queryFiltered, isAlcoholic]);

  useEffect(() => {
    utilsSearch(query);
  }, [query]);

  function utilsSearch(query) {
    let cancel;
    return axios({
      method: "GET",
      url: process.env.REACT_APP_BACKEND_URL + "/cocktail",
      params: { query },
      cancelToken: new axios.CancelToken(c => (cancel = c)),
      withCredentials: true
    })
      .then(res => {
        setFavCocktails(res.data.cocktailsWithFavorites);
        setQueryFiltered(res.data.allCocktailsSorted);
        // setIsUser(res.data.useAuth);
      })
      .catch(err => {
        if (axios.isCancel(err)) return;
      });
  }

  const handleClickIsAlcoholic = e => {
    if (isAlcoholic) setIsAlcoholic(false);
    else setIsAlcoholic(true);
  };

  const handleScroll = e => {
    var offset = window.innerHeight + e.target.scrollTop;
    var height = e.target.scrollHeight;
    const copy = [...queryFiltered];
    handleScrollSearchBar(e);
    if (offset > height - 1) {
      if (isAlcoholic === true) {
        const elements = copy.splice(myOffset * 20, 20);
        setCocktailsDisplayed([...cocktailsDisplayed, ...elements]);
        setOffset(off => off + 1);
      } else {
        const nonAlcoholicCopy = copy.filter(cocktail => {
          if (cocktail.Alcoholic === false) {
            return cocktail;
          }
        });
        const elements = nonAlcoholicCopy.splice(myOffset * 20, 20);
        setCocktailsDisplayed([...cocktailsDisplayed, ...elements]);
        setOffset(off => off + 1);
      }
    }
  };

  const handleScrollSearchBar = e => {
    var navBar = document.getElementById("navBar");
    var searchBar = document.getElementById("searchBar");
    var blurEffect = document.getElementById("blurEffect");
    if (e.target.scrollTop <= 630 && searchBar) {
      navBar.className = "nav-bar white";
      blurEffect.className = "blurEffect";
    } else {
      navBar.className = "nav-bar black";
      blurEffect.className = "blurEffect backgroundBlur";
    }
  };

  const smoothScrollToContent = e => {
    e.preventDefault();
    let anchorTarget = document.getElementById("searchBar");
    anchorTarget.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fullpage-overflow">
      <div
        className="fullPage"
        onScroll={(handleScrollSearchBar, handleScroll)}
      >
        <div className="bannerHome">
          <div>
            <h1 className="title">Mixology Lovers</h1>
            <h2>The cocktail interface dedicated to Mixology Lovers...</h2>
          </div>
          <span
            className="arrow animated infinite bounce delay-2s slow"
            onClick={smoothScrollToContent}
          >
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>

        <h3>Our cocktails</h3>
        <div className={`fullPageHeader`}>
          <input
            onChange={handleSearch}
            className="searchBarHome"
            id="searchBar"
            placeholder="Search..."
          ></input>

          {!isAlcoholic ? (
            <span
              className="fa-stack fa-2x isAlcoholicLogo"
              onClick={handleClickIsAlcoholic}
            >
              <i className="fas fa-cocktail fa-stack-1x"></i>
              <i className="fas fa-ban fa-stack-2x"></i>
            </span>
          ) : (
            <span
              className="fa-stack fa-2x isAlcoholicLogo"
              onClick={handleClickIsAlcoholic}
            >
              <i className="fas fa-cocktail fa-stack-1x"></i>
            </span>
          )}
        </div>
        <div className="blurEffect" id="blurEffect"></div>
        <section id="cocktailContent">
          {queryFiltered || cocktailsDisplayed ? (
            <CocktailsList
              cocktails={
                queryFiltered.length < 18 ? queryFiltered : cocktailsDisplayed
              }
              cocktailsFav={favCocktails}
            />
          ) : (
            <div className="noResults">
              "Sorry no results found in the database :/"
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
