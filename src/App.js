import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import SurfCamContainer from "./components/SurfCamContainer";
import AllFavorites from "./components/AllFavorites";

import useFavorites from "./hooks/useFavorites";

// 404 - Just 'cause you're riding the high tide, doesn't mean you've chosen the right course.
// Error - Sometimes, the bird sings, sometimes it coughs up a worm.

const DEFAULT_SPOT_ID = "584204204e65fad6a77096b1";

const App = () => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const defaultSpotId = (() => {
    if (favorites && Object.keys(favorites).length > 0) {
      return Object.keys(favorites)[0];
    } else {
      return DEFAULT_SPOT_ID;
    }
  })();

  return (
    <Router>
      <Layout favorites={favorites}>
        <Routes>
          <Route
            path="/favorites"
            element={
              <AllFavorites
                favorites={favorites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            }
          />
          <Route
            path="/spot/:id"
            element={
              <SurfCamContainer
                favorites={favorites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            }
          />
          <Route
            path="/"
            element={
              <SurfCamContainer
                defaultSpotId={defaultSpotId}
                favorites={favorites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
