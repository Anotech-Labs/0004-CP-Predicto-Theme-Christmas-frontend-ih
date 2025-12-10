import React from 'react';

const LoadingPage = () => {
  return (
    <>
      <style>
        {`
        .loading-page {
          background-color: gray;
          overflow: hidden;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          padding: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 430px;
          height: 100vh;
          background-image: url("assets/logo/bg.webp");
          background-size: cover;
          background-position: center;
          color: white;
          text-align: center;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .loading-main-image {
          width: 100%;
          max-width: 360px;
          margin-top: 110px;
        }

        .loading-logo-image {
          width: 180px;
          max-width: 60%;
        }

        @media screen and (max-width: 380px) {
          .loading-main-image {
            margin-top: 90px;
          }
          .loading-logo-image {
            width: 150px;
          }
        }

        @media screen and (max-width: 320px) {
          .loading-main-image {
            margin-top: 70px;
          }
          .loading-logo-image {
            width: 130px;
          }
        }
        `}
      </style>

      <div className="loading-page">
        <div className="loading-container">
          <img
            src="assets/logo/bgTop.webp"
            alt="Main"
            className="loading-main-image"
          />
          <img
            src="assets/logo/a_logo2.webp"
            alt="Logo"
            className="loading-logo-image"
          />
        </div>
      </div>
    </>
  );
};

export default LoadingPage;
