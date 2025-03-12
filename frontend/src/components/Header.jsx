import React from "react";
const Header = () => {
  return (
    <>
      <style>
        {`
          #hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(15, 21, 37, .8);
            z-index: -1;
          }
          .buttonStyle {
            font-family: inherit;
            font-size: 18px;
            color: white;
            padding: 0.7em 1em;
            padding-left: 0.9em;
            display: flex;
            align-items: center;
            border: none;
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.2s;
            cursor: pointer;
          }
          .buttonStyle span {
            display: block;
            margin-left: 0.3em;
            transition: all 0.3s ease-in-out;
          }
          .buttonStyle svg {
            display: block;
            transform-origin: center center;
            transition: transform 0.3s ease-in-out;
          }
          .buttonStyle:hover .svg-wrapper {
            animation: fly-1 0.6s ease-in-out infinite alternate;
          }
          .buttonStyle:hover svg {
            transform: translateX(3rem) rotate(30deg) scale(1.5);
          }
          .buttonStyle:hover span {
            transform: translateX(50em);
          }
          .buttonStyle:active {
            transform: scale(0.95);
          }
          .join {
            background-color: royalblue;
          }
          .req {
            background-color: var(--bs-danger);
          }
          .link-style {
            text-decoration: none;
          }
          @keyframes fly-1 {
            from {
              transform: translateY(0.1em);
            }
            to {
              transform: translateY(-0.1em);
            }
          }
          .heading {
            font-size: 2.875rem;
            font-weight: 700;
            max-width: 80%;
            line-height: 1.2;
          }
          /* Media query for mobile view */
          @media (max-width: 500px) {
            .buttonStyle {
              font-size: 14px;
              padding: 0.5em 0.8em;
            }
            .heading {
              font-size: 2rem;
              font-weight: 700;
              max-width: 80%;
              line-height: 1.2;
            }
          }
        `}
      </style>

      <section id="hero" style={styles.hero} data-wow-delay="0.1s">
        <div style={styles.container}>
          <div style={styles.textContainer} data-wow-delay="0.2s">
            <h1 className="heading">
              Welcome to the{" "}
              <span style={styles.highlight}>
                Quiz App
              </span>, where knowledge meets challenge. Get ready to test your
              skills and compete with others.
            </h1>
          </div>
          <div style={styles.imageContainer} data-wow-delay="0.3s">
            <img
              src="/images/header.jpg"
              alt="Quiz"
              style={styles.heroImage}
            />
          </div>
        </div>
      </section>
    </>
  );
};

const styles = {
  hero: {
    height: "60%",
    color: "white",
    position: "relative",
  },
  container: {
    width: "80%",
    margin: "0 auto",
    height: "100%",
    padding: "4rem 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: "auto",
    maxWidth: "500px", // Adjust to fit your image
  },
  highlight: {
    color: "#FFBF1A",
  },
  divButtonStyle: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
};

export default Header;
