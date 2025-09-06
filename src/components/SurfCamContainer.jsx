import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import useStreamUrls from "../hooks/useStreamUrls";
import useSwellData from "../hooks/useSwellData";

import SurfCam from "./SurfCam";
import SwellChart from "./SwellChart";

const SurfCamContainer = ({ defaultSpotId, favorites, addFavorite, removeFavorite }) => {
  const { id } = useParams();
  const spotId = defaultSpotId ? defaultSpotId : id;

  const { streamUrls, spotName } = useStreamUrls(spotId);
  const { swellData, loading: swellLoading, error: swellError } = useSwellData(spotId);

  const title = spotName || spotId;
  document.title = `Surfcam Magician - ${title}`;

  const isFavorite = !!favorites[spotId];

  const onFavoriteClick = () => {
    if (isFavorite) {
      removeFavorite(spotId);
    } else {
      addFavorite(spotId, title);
    }
  };

  return (
    <>
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
      <div className="section">
        <h2 className="title is-4">Swell Forecast</h2>
        {swellLoading && <div className="notification">Loading swell data...</div>}
        {swellError && <div className="notification is-warning">Error loading swell data: {swellError}</div>}
        {swellData && !swellLoading && !swellError && (
          <SwellChart 
            data={swellData.data}
            xLabels={swellData.xLabels}
            plotBands={swellData.plotBands}
            max={swellData.max}
          />
        )}
      </div>
    </>
  );
};

SurfCamContainer.propTypes = {
  defaultSpotId: PropTypes.string,
  favorites: PropTypes.object.isRequired,
  addFavorite: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired
};

export default SurfCamContainer;
