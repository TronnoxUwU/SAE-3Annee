"use client";
import Style from "./modal.module.css"

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={Style.modal_overlay} onClick={onClose}>
      <div className={Style.modal_content} onClick={(e) => e.stopPropagation()}>
        <button className={Style.modal_close} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
