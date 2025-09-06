import React from "react";
import PropTypes from "prop-types";

import Favorites from "./Favorites";
import Search from "./Search";

const Layout = ({ favorites, children }) => {
  return (
    <>
      <section className="section">
        <div className="container is-fluid">
          <Search />
        </div>
      </section>
      <section className="section">
        <div className="container is-fluid">
          <Favorites favorites={favorites} />
        </div>
      </section>
      <section className="section">
        <div className="container is-fluid">
          {children}
        </div>
      </section>
      <footer className="footer">
        <div className="content has-text-centered">
          <p>Built by Maxworld Technologies</p>
        </div>
      </footer>
    </>
  );
};

Layout.propTypes = {
  favorites: PropTypes.object.isRequired
};

export default Layout;
