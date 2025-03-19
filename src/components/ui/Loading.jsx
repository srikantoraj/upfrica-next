"use client"
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    display: block;
    --height-of-loader: 4px;
    --loader-color: #9061f9;
    width: 100vw; /* Full width */
    height: var(--height-of-loader);
    border-radius: 0; /* No rounded corners for a top-bar look */
    background-color: rgba(0, 0, 0, 0.2);
    position: fixed; /* Stays at the top even when scrolling */
    top: 0;
    left: 0;
    z-index: 1000; /* Ensures loader is above other content */
  }

  .loader::before {
    content: "";
    position: absolute;
    background: var(--loader-color);
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    border-radius: 0;
   animation: moving 2s ease-in-out infinite; /* Duration increased to 2s */
  }

  @keyframes moving {
    50% {
      width: 100%;
    }
    100% {
      width: 0;
      right: 0;
      left: unset;
    }
  }
`;

export default Loader;
