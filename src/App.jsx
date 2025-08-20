import React, { useEffect, useState } from "react";
import './app.css'
import searchIcon from './assets/search.png';
import errorImage from './assets/error.png';
import menu from './assets/menu.png';
import close from './assets/close.png';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const defaultTitles = [
  "Inception",
  "Avengers",
  "The Dark Knight",
  "Interstellar",
  "Titanic",
  "Joker",
  "parasite",
  "The Wolf of Wall Street"
];

function App() {
  const [inpute, setInputvalue] = useState("");
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth > 925);
  
  const handeInpute = (e) => {
    setInputvalue(e.target.value)
  }
  
  const handelSubmit = async () => {
    const trimidValue = inpute.trim()
    if (trimidValue === "") {
      alert("Fill The Input")
      return; 
    }
    
    try {
      const API_KEY = "20c55962";
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${trimidValue}`;
      const response = await fetch(url)
      
      if(!response.ok){
        console.log("response not ok", response.status);
        setMovies(null)
        setError("enter valid text")
        setInputvalue("")
        return
      }
      
      const data = await response.json()
      console.log(data)
      console.log(url)
      console.log("Search Query:", trimidValue);
      console.log(API_KEY);
      
      if(data.Response === "False"){
        setMovies(null)
        setError("enter valid movie name")
        setInputvalue("")
        return
      }
      
      else{
        const newValue = {
          id: Date.now(),
          text: trimidValue,
        }
        setHistory([...history, newValue])
        console.log(history)
      }
      
      if (data.Search && data.Search[0]) {
        const firstmovie = data.Search.slice(0, 8).map((movie) => ({
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
        }))
        setMovies(firstmovie)
      }
      
      else {
        setMovies(null);
        setError("movies not found enter valid name")
        setInputvalue("")
        return
      }
      
    }
    catch (error) {
      console.log("Error:", error);
      setMovies(null);
    }
    setInputvalue("")
    setError("");
  }
    
  const fetchDefaultMovies = async () => {
    setLoading(true)
    try{
      console.log("Default Titles:", defaultTitles);
      const promises = defaultTitles.map((title) => 
        fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if(data.Response === "True"){
          return{
            title: data.Title,
            poster: data.Poster,
            year: data.Year
          }
        }
      })
    );
    
    const results = await Promise.all(promises)
    const validMovies = results.filter(movie => movie != null);
    setMovies(validMovies)
    console.log("Movies from API:", validMovies);
    console.log("Movies from API:", movies);
    console.log("API_KEY:", API_KEY);
    console.log("this is results", results)
  } 
  
  catch(error){
    console.error("Error fetching default movies:", error);
    return null;
  }
  setLoading(false)
}  

useEffect(() => {
  const saved = localStorage.getItem("card");
  console.log("saved the data", saved);
  if (saved && JSON.parse(saved).length > 0) {
    setMovies(JSON.parse(saved));
  } 
  else{
    fetchDefaultMovies();
  }
},[]);

useEffect(() => {
  if(movies && movies.length > 0){
  localStorage.setItem("card", JSON.stringify(movies));
  }
},[movies]);

const handleHomeClick = () => {
  fetchDefaultMovies();
  setError("")
};

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 925) {
      setIsMenuOpen(true); // normal navbar visible
    } else {
      setIsMenuOpen(false); // burger menu closed by default
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <div id="main-container">
      <div className="containe">
        <nav id="nvabar">  
        <div id="searching">
          <div id="extra" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img src={menu} alt="menu"/>
          </div>
          {isMenuOpen &&(
           <ul className="screen">
            <div id="in-li">
           <li onClick={handleHomeClick}>Home</li>
           <li>18+</li>
           <li>Web Series</li>
           <li>TV show</li>
            <div id="close" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img src={close} alt="close"/>
          </div>
          </div>
           </ul>
         )}

          
          <div className="center">
          <input value={inpute} type="text" id="text" onChange={handeInpute} placeholder="search movies" />
          <button className="add" onClick={() => handelSubmit()}>
           <img src={searchIcon} alt="search" style={{ width: '20px', height: '20px',}} /></button>
          </div>
    
        </div>
         </nav>
      </div>
 
     <div id="cover">
      <div id="histo">
        {history.map((item, index) => (
          <li id="recent" key={item.id}></li>
        ))}
        <div className="item-error">
          <p id="error">{error}</p>
        </div>
      </div>

      <div id="card" className="cards-container">
        
        {loading ? (
          <p id="spinner">loading...</p>
        ):(
        Array.isArray(movies) && movies.length > 0 &&
          movies.slice(0, 8).map((movie, index) => {
            return (
              <div id="cards" key={movie.id || index}>
                <img src={movie.poster !== "N/A" ? movie.poster : errorImage} alt={movie.title}
                onError={(e) => e.target.src = errorImage}
                  style={{ width: movie.poster !== "N/A" ? "280px" : "150px",
                     height: movie.poster !== "N/A" ? "400px" : "200px"
                }}/>
                <p className="titles">{movie.title}</p>
                <p>{movie.year}</p>
              </div>
            )
          })
      )}
      </div>
     </div>
     </div>
  )
}
export default App