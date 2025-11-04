"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/CenteredCarousel.module.css";

export default function CenteredCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map((img) =>
        new Promise((resolve) => {
          const image = new Image();
          // fallback après 2 secondes max
          let timer = setTimeout(() => {
            resolve({ ...img, src: "/images/default-article.png" });
          }, 2000);

          image.onload = () => {
            clearTimeout(timer);
            resolve(img);
          };
          image.onerror = () => {
            clearTimeout(timer);
            resolve({ ...img, src: "/images/default-article.png" });
          };

          // cache-buster pour éviter que Chromium garde un 404
          image.src = img.src + "?_=" + Date.now();
        })
      );

      const results = await Promise.all(promises);
      setLoadedImages(results);
    };

    preloadImages();
  }, [images]);

  // Interval auto
  useEffect(() => {
    if (loadedImages.length <= 1) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % loadedImages.length);
      }, 6500000);
    };

    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [loadedImages]);

  const resetTimerAndSetCurrent = (newIndex) => {
    setCurrent(newIndex);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % loadedImages.length);
      }, 6500000);
    }
  };

  const prevSlide = () => {
    const newIndex = current === 0 ? loadedImages.length - 1 : current - 1;
    resetTimerAndSetCurrent(newIndex);
  };

  const nextSlide = () => {
    const newIndex = current === loadedImages.length - 1 ? 0 : current + 1;
    resetTimerAndSetCurrent(newIndex);
  };

  if (!loadedImages.length) return null;

  return (
    <div className={styles.carouselContainer}>
      <button className={`${styles.arrow} ${styles.left}`} onClick={prevSlide}>
        ❮
      </button>

      <div className={styles.carouselTrack}>
        {loadedImages.map((img, i) => {
          const indexDiff =
            (i - current + loadedImages.length) % loadedImages.length;
          let className = styles.slide;

          if (indexDiff === 0) className += ` ${styles.active}`;
          else if (indexDiff === 1) className += ` ${styles.next}`;
          else if (indexDiff === loadedImages.length - 1)
            className += ` ${styles.prev}`;
          else className += ` ${styles.hidden}`;

          // clics selon la position
          let handleClick = null;
          if (indexDiff === 1) handleClick = nextSlide;
          else if (indexDiff === loadedImages.length - 1)
            handleClick = prevSlide;

          return (
            <div key={i} className={className}>
              <img
                src={img.src}
                alt={img.alt || `Image ${i}`}
                className={styles.clickableImage}
                onClick={handleClick}
              />
              {img.caption && <p className={styles.caption}>{img.caption}</p>}
            </div>
          );
        })}
      </div>

      <button className={`${styles.arrow} ${styles.right}`} onClick={nextSlide}>
        ❯
      </button>

      <div className={styles.dots}>
        {loadedImages.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${
              i === current ? styles.activeDot : ""
            }`}
            onClick={() => resetTimerAndSetCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}
