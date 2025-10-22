"use client";
import React, { useState } from "react";
import styles from "../styles/CenteredCarousel.module.css";

export default function CenteredCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.carouselContainer}>
      <button className={`${styles.arrow} ${styles.left}`} onClick={prevSlide}>
        ❮
      </button>

      <div className={styles.carouselTrack}>
        {images.map((img, i) => {
          const indexDiff = (i - current + images.length) % images.length;

          let className = styles.slide;
          if (indexDiff === 0) className += ` ${styles.active}`;
          else if (indexDiff === 1) className += ` ${styles.next}`;
          else if (indexDiff === images.length - 1) className += ` ${styles.prev}`;
          else className += ` ${styles.hidden}`;

          return (
            <div key={i} className={className}>
              <img src={img.src} alt={img.alt || `Image ${i}`} />
              {img.caption && <p className={styles.caption}>{img.caption}</p>}
            </div>
          );
        })}
      </div>

      <button className={`${styles.arrow} ${styles.right}`} onClick={nextSlide}>
        ❯
      </button>

      <div className={styles.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === current ? styles.activeDot : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}
