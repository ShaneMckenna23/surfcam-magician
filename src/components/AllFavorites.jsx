import React from "react";
import PropTypes from "prop-types";
import useStreamUrls from "../hooks/useStreamUrls";
import SurfCam from "./SurfCam";

const FavoriteSpot = ({ spotId, title, favorites, addFavorite, removeFavorite }) => {
  const { streamUrls } = useStreamUrls(spotId);
  const isFavorite = !!favorites[spotId];

  const onFavoriteClick = () => {
    if (isFavorite) {
      removeFavorite(spotId);
    } else {
      addFavorite(spotId, title);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <button className="button" onClick={onFavoriteClick}>
              {isFavorite ? "Unfavorite" : "Favorite"}
            </button>
          </div>
          <div className="level-item">
            <span>{title}</span>
          </div>
        </div>
      </div>
      <div className="columns">
        {streamUrls.map((streamUrl, index) => {
          return <SurfCam key={index} streamUrl={streamUrl} />;
        })}
      </div>
    </div>
  );
};

FavoriteSpot.propTypes = {
  spotId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  favorites: PropTypes.object.isRequired,
  addFavorite: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired
};

const AllFavorites = ({ favorites, addFavorite, removeFavorite }) => {
  const pacificBeachStreamUrl = "https://edge04.nginx.hdontap.com/hosb1/pacificbeach_pacterrace.stream/chunklist.m3u8";
  
  if (!favorites || Object.keys(favorites).length === 0) {
    return (
      <div>
        <h2 className="title is-4">All Favorites</h2>
        <div style={{ marginBottom: "2rem" }}>
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span>Pacific Beach - Terrace</span>
              </div>
            </div>
          </div>
          <div className="columns">
            <SurfCam streamUrl={pacificBeachStreamUrl} />
          </div>
        </div>
        <p>No favorites yet! Add some spots to your favorites to see them all here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="title is-4">All Favorites</h2>
      <div style={{ marginBottom: "2rem" }}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <span>Pacific Beach - Terrace</span>
            </div>
          </div>
        </div>
        <div className="columns" style={{ height: "80vh" }}>
          <SurfCam streamUrl={pacificBeachStreamUrl} />
        </div>
      </div>
      {Object.entries(favorites).map(([spotId, spotTitle]) => (
        <FavoriteSpot
          key={spotId}
          spotId={spotId}
          title={spotTitle}
          favorites={favorites}
          addFavorite={addFavorite}
          removeFavorite={removeFavorite}
        />
      ))}
    </div>
  );
};

AllFavorites.propTypes = {
  favorites: PropTypes.object.isRequired,
  addFavorite: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired
};

export default AllFavorites;