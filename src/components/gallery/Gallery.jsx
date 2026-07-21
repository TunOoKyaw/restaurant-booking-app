import React from "react";
import SectionTitle from "../title/SectionTitle";
import { gallery } from "../../Data";

import "./gallery.css";

const Gallery = () => {
  return (
    <section className="gallery section">
      <SectionTitle
        subtitle="Our Photo Gallery"
        title={
          <>
            Let's Check <span>Our Photo</span> Gallery
          </>
        }
      />

      <div className="gallery-container container">
        {gallery.map((imgUrl, index) => {
          return (
            <div className="gallery-item" key={index}>
              <img src={imgUrl} alt="" className="gallery-img" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Gallery;