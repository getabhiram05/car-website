"use client";

import { useState } from "react";

export default function CarGallery({ images, alt }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div>
      <img
        src={images[selectedIndex]}
        alt={alt}
        style={{
          width: "100%",
          height: "360px",
          objectFit: "cover",
          display: "block",
        }}
      />

      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "12px",
            backgroundColor: "#f1f5f9",
            overflowX: "auto",
          }}
        >
          {images.map((imageUrl, index) => (
            <img
              key={imageUrl}
              src={imageUrl}
              alt={`${alt} thumbnail ${index + 1}`}
              onClick={() => setSelectedIndex(index)}
              style={{
                width: "80px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "8px",
                cursor: "pointer",
                border:
                  index === selectedIndex
                    ? "3px solid #2563eb"
                    : "3px solid transparent",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}