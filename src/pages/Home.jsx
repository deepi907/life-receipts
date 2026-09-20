import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";

import { loadAllLifeData } from "../services/DataLoader";

const categoryInfo = [
  {
    icon: "♫",
    name: "Music",
    description: "Listening moments",
    source: "spotify",
    className: "music",
  },
  {
    icon: "⌖",
    name: "Places",
    description: "Recorded locations",
    source: "india",
    className: "places",
  },
  {
    icon: "♧",
    name: "Purchases",
    description: "Transaction records",
    source: "india",
    className: "purchases",
  },
  {
    icon: "₹",
    name: "Spending",
    description: "Money activity",
    source: "both",
    className: "spending",
  },
  {
    icon: "⌂",
    name: "Routines",
    description: "Household records",
    source: "household",
    className: "routines",
  },
  {
    icon: "◉",
    name: "Listening",
    description: "Listening history",
    source: "spotify",
    className: "listening",
  },
  {
    icon: "▣",
    name: "Merchants",
    description: "Places you spent",
    source: "india",
    className: "merchants",
  },
  {
    icon: "✦",
    name: "Life Periods",
    description: "Recorded time",
    source: "all",
    className: "periods",
  },
];

function formatNumber(number) {
  return new Intl.NumberFormat("en-IN").format(number || 0);
}

function CategoryCard({ category, counts }) {
  let count = 0;

  if (category.source === "spotify") {
    count = counts.spotify;
  }

  if (category.source === "household") {
    count = counts.household;
  }

  if (category.source === "india") {
    count = counts.india;
  }

  if (category.source === "both") {
    count = counts.household + counts.india;
  }

  if (category.source === "all") {
    count = counts.total;
  }

  return (
  <Link
  to={`/explore?type=${
    category.source === "spotify"
      ? "Music"
      : category.source === "india"
      ? "Purchase"
      : category.source === "household"
      ? "Routine"
      : "All"
  }`}
  className={`category-card ${category.className}`}
>
      <div className="category-icon">
        {category.icon}
      </div>

      <div className="category-name">
        {category.name}
      </div>

      <div className="category-description">
        {category.description}
      </div>

      <div className="category-count">
        {formatNumber(count)}
      </div>
    </Link>
  );
}

function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const data = await loadAllLifeData();
        setStats(data.stats);
      } catch (error) {
        console.error("Home data loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="home-loading">
        <div>
          <div className="home-loading-icon">✦</div>
          <h2>Gathering your life receipts...</h2>
          <p>
            Bringing your recorded moments together.
          </p>
        </div>
      </div>
    );
  }

  const counts = stats || {
    spotify: 0,
    household: 0,
    india: 0,
    total: 0,
  };

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">

        <img
          src="/life-receipts-hero.jpg"
          alt="Life Receipts"
          className="hero-image"
        />

        <div className="hero-overlay">

          <div className="hero-top">

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search moments..."
              />
            </div>

            <button className="icon-button">
              ☼
            </button>

            <button className="profile-button">
              ●
            </button>

          </div>

          <div className="hero-content">

            <h1>
              Your Life,
              <br />
              In Receipts
            </h1>

            <p>
              {formatNumber(counts.total)} recorded moments.
              <br />
              One story waiting to be discovered.
            </p>

            <Link
              to="/story"
              className="primary-button"
            >
              Explore My Story
              <span>→</span>
            </Link>

          </div>

        </div>
      </section>

      {/* JOURNEY */}
      <section className="journey-section">

        <div className="section-heading">

          <div>
            <h2>
              <span>❧</span> Your Life Journey
            </h2>

            <p>
              Explore the different parts of your recorded
              life and discover patterns between them.
            </p>
          </div>

          <div className="hand-note">
            Different moments.
            <br />
            Same story. ♥
          </div>

        </div>

        {/* CATEGORIES */}
        <div className="category-grid">

          {categoryInfo.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              counts={counts}
            />
          ))}

        </div>

        {/* LOWER CONTENT */}
        <div className="lower-grid">

          {/* FEATURED STORY */}
          <section className="featured-story">

            <div className="small-section-title">
              ✦ Featured Story
            </div>

            <div className="story-content">

              <div className="story-image">
                <img
                  src="/life-receipts-hero.jpg"
                  alt="Featured life chapter"
                />
              </div>

              <div className="story-text">

                <span className="story-label">
                  YOUR DATA
                </span>

                <h3>
                  The Story Begins
                </h3>

                <p className="story-subtitle">
                  {formatNumber(counts.total)}
                  {" "}recorded moments across
                  {" "}three sources.
                </p>

                <p>
                  Your listening history, household records
                  and transaction history create the raw
                  material for your life story.
                </p>

                <Link
                  to="/story"
                  className="secondary-button story-link"
                >
                  View Story →
                </Link>

              </div>

            </div>
          </section>

          {/* DATA SOURCES */}
          <section className="connections">

            <div className="connections-header">

              <div className="small-section-title">
                ⛓ Your Data Sources
              </div>

              <Link
                to="/connections"
                className="view-all"
              >
                View Connections →
              </Link>

            </div>

            <div className="connection-list">

              <div className="connection-card">

                <div className="connection-image music">
                  ♫
                </div>

                <div className="connection-info">
                  <span className="connection-type">
                    SPOTIFY
                  </span>

                  <strong>
                    {formatNumber(counts.spotify)}
                  </strong>

                  <small>
                    listening records
                  </small>
                </div>

              </div>

              <div className="connection-card">

                <div className="connection-image place">
                  ⌖
                </div>

                <div className="connection-info">
                  <span className="connection-type">
                    INDIA DATA
                  </span>

                  <strong>
                    {formatNumber(counts.india)}
                  </strong>

                  <small>
                    transaction records
                  </small>
                </div>

              </div>

              <div className="connection-card">

                <div className="connection-image purchase">
                  ⌂
                </div>

                <div className="connection-info">
                  <span className="connection-type">
                    HOUSEHOLD
                  </span>

                  <strong>
                    {formatNumber(counts.household)}
                  </strong>

                  <small>
                    routine records
                  </small>
                </div>

              </div>

            </div>
          </section>

        </div>

        <div className="bottom-note">
          <span>〰</span>
          Some moments are just the beginning...
          <span>〰</span>
        </div>

      </section>

    </div>
  );
}

export default Home;