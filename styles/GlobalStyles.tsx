import React from 'react';
import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
    <Global
    styles={css`
      /* ----- Overlay ----- */
      .overlay {
        position: relative;
        background-color: #0e1416;
        width: 100%;
        height: 100vh; /* Adjust based on your needs */
        overflow: hidden;
      }
  
      .grid {
        width: 100%;
        height: 100%;
        overflow: hidden;
        perspective: 450px;
        position: relative;
      }
  
      .grid-fade {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        background: radial-gradient(
          ellipse at 50% 50%,
          rgba(14, 20, 22, 0) 0%,
          #0e1416 80%
        );
      }
  
      .grid-lines {
        width: 100%;
        height: 200%;
        position: absolute;
        z-index: 0;
        background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.3) 1px,
            transparent 0
          ),
          linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.3) 1px,
            transparent 0
          );
        background-size: 45px 30px;
        background-repeat: repeat;
        transform-origin: 100% 0 0;
        animation: play 15s linear infinite;
      }
  
      /* Bottom fade effect */
      .fade-overlay {
        position: absolute;
        inset: 0;
        z-index: 2;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0) 0%,
          #0e1416 50%
        );
      }
  
      /* Animation for grid-lines */
      @keyframes play {
        0% {
          transform: rotateX(45deg) translateY(-50%);
        }
        100% {
          transform: rotateX(45deg) translateY(0);
        }
      }
    `}
  />
);

export default GlobalStyles;

