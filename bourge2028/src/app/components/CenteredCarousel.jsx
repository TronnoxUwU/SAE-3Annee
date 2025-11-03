"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/CenteredCarousel.module.css";

export default function CenteredCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    // Précharge les images et remplace celles qui ne répondent pas rapidement
    const preload = async () => {
      const promises = images.map(
        (img) =>
          new Promise((resolve) => {
            const image = new Image();
            let timer = setTimeout(() => {
              resolve({ ...img, src: "/images/default-article.png" });
            }, 4000); // délai max avant fallback
            image.onload = () => {
              clearTimeout(timer);
              resolve(img);
            };
            image.onerror = () => {
              clearTimeout(timer);
              resolve({ ...img, src: "/images/default-article.png" });
            };
            image.src = img.src;
          })
      );
      const results = await Promise.all(promises);
      setLoadedImages(results);
    };

    preload();
  }, [images]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? loadedImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === loadedImages.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (e) => {
    if (!e.target.src.endsWith("default-article.png")) {
      e.target.src = "/images/default-article.png";
    }
  };

  if (!loadedImages.length) return null;

  return (
    <div className={styles.carouselContainer}>
      <button className={`${styles.arrow} ${styles.left}`} onClick={prevSlide}>
        ❮
      </button>

      <div className={styles.carouselTrack}>
        {loadedImages.map((img, i) => {
          const indexDiff = (i - current + loadedImages.length) % loadedImages.length;
          let className = styles.slide;

          if (indexDiff === 0) className += ` ${styles.active}`;
          else if (indexDiff === 1) className += ` ${styles.next}`;
          else if (indexDiff === loadedImages.length - 1) className += ` ${styles.prev}`;
          else className += ` ${styles.hidden}`;

          return (
            <div key={i} className={className}>
              <img
                src={img.src}
                alt={img.alt || `Image ${i}`}
                onError={handleImageError}
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
            className={`${styles.dot} ${i === current ? styles.activeDot : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}
