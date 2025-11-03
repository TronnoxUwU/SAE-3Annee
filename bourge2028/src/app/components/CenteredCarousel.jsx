"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/CenteredCarousel.module.css";

export default function CenteredCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const preload = async () => {
      const promises = images.map(
        (img) =>
          new Promise((resolve) => {
            const image = new Image();
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
            image.src = img.src;
          })
      );
      const results = await Promise.all(promises);
      setLoadedImages(results);
    };

    preload();
  }, [images]);

  // Passage auto toutes les 5 secondes
  useEffect(() => {
    if (loadedImages.length > 1) {
      const resetInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setCurrent((prev) =>
            prev === loadedImages.length - 1 ? 0 : prev + 1
          );
        }, 6500);
      };

      resetInterval(); // démarrage initial

      return () => clearInterval(intervalRef.current);
    }
  }, [loadedImages]);

  const resetTimerAndSetCurrent = (newIndex) => {
    setCurrent(newIndex);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrent((prev) =>
          prev === loadedImages.length - 1 ? 0 : prev + 1
        );
      }, 5000);
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


  const handleImageError = (e) => {
    if (!e.target.src.endsWith("default-article.png")) {
      e.target.src = "/images/default-article.png";
    }
  };

  if (!loadedImages.length) return null;

  return (
    <>
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
            else if (indexDiff === loadedImages.length - 1)
              className += ` ${styles.prev}`;
            else className += ` ${styles.hidden}`;

            return (
              <div key={i} className={className}>
                <img
                  src={img.src}
                  alt={img.alt || `Image ${i}`}
                  onError={handleImageError}
                  className={styles.clickableImage}
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
              onClick={() => resetTimerAndSetCurrent(i)}
            />

          ))}
        </div>
      </div>
    </>
  );
}
