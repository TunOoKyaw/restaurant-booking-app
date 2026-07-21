import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { homeSlide } from "../../Data";
import parse from "html-react-parser";
import Scrolllink from "../link/Scrolllink";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "./home.css";

const Home = () => {
  return (
    <section className="home">
      <Swiper
        modules={[Navigation]}
        speed={1000}
        rewind={true}
        navigation={{
          nextEl: ".next-btn",
          prevEl: ".prev-btn",
        }}
      >
        {homeSlide.map(({ img, title, description }, index) => {
          return (
            <SwiperSlide
              className="home-slide section"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5)), url(${img}`,
                backgroundSize: "cover",
              }}
              key={index}
            >
              <div className="home-data container">
                <h3 className="home-subtitle">Welcome to Retro!</h3>
                <h1 className="home-title">{parse(title)}</h1>
                <p className="home-description">{description}</p>

                <div className="home-buttons">
                  <Scrolllink
                    to="about"
                    name="About More"
                    className="button"
                    icon={<IoIosArrowDroprightCircle className="button-icon" />}
                  />

                  <Scrolllink
                    to="menu"
                    name="Check Menu"
                    className="button home-button"
                    icon={<IoIosArrowDroprightCircle className="button-icon" />}
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        <button className="swiper-btn next-btn">
          <FaArrowRight />
        </button>
        <button className="swiper-btn prev-btn">
          <FaArrowLeft />
        </button>
      </Swiper>
    </section>
  );
};

export default Home;
