import React from "react";
import SectionTitle from "../title/SectionTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Stars from "../stars/Stars";
import dummyImg from "../../assets/dummy.jpg"; 
import { reviewItem } from "../../Data";

import "swiper/css";
import "swiper/css/pagination";
import "./reviews.css";

const Reviews = () => {
  return (
    <section className="review section">
      <SectionTitle
        subtitle="Reviews"
        title={
          <>
            What Our Awesome <span>Clients Say</span> About Us
          </>
        }
      />

      <Swiper
        slidesPerView={1}
        loop={true}
        grabCursor={true}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          576: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[Pagination]}
        className="container"
      >
        {reviewItem.map(({ img, name, description, stars }, index) => {
          return (
            <SwiperSlide className="reviews-item" key={index}>
              <div className="reviews-bg">

                <div className="reviews-data">
                  
                  <img src={img || dummyImg} alt={name} className="reviews-img" />

                  <div>
                    <h3 className="reviews-name">{name}</h3>
                    <p className="reviews-profile">Customer</p>
                  </div>
                </div>

                <p className="reviews-description">{description}</p>

                <Stars stars={stars} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Reviews;