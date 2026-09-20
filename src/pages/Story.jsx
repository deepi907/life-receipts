import { useEffect, useState } from "react";
import "../index.css";

import { loadAllLifeData } from "../services/DataLoader";
import {
  generateChapters,
  getMostActiveChapter,
  getReceiptsForChapter,
} from "../analysis/chapters";

function Story() {
  const [chapters, setChapters] = useState([]);
  const [featuredChapter, setFeaturedChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [allReceipts, setAllReceipts] = useState([]);
const [selectedChapter, setSelectedChapter] = useState(null);
const [chapterReceipts, setChapterReceipts] = useState([]);
  useEffect(() => {
    async function loadStory() {
      try {
    const data = await loadAllLifeData();

setAllReceipts(data.receipts);

const generatedChapters = generateChapters(
  data.receipts
);

        setChapters(generatedChapters);
        setFeaturedChapter(
          getMostActiveChapter(generatedChapters)
        );

        console.log("Generated story chapters:", generatedChapters);
      } catch (err) {
        console.error(err);
        setError("Unable to build your story.");
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, []);

  if (loading) {
    return (
      <div className="story-page">
        <div className="empty-results">
          <div className="empty-icon">✦</div>

          <h2>Writing your story...</h2>

          <p>
            Turning recorded moments into chapters.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="story-page">
        <div className="empty-results">
          <div className="empty-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="story-page">

      {/* HEADER */}

      <header className="story-header">
        <span className="eyebrow">
          YOUR STORY
        </span>

        <h1>
          A Life Made
          <br />
          From Little Moments
        </h1>

        <p>
          Your receipts are more than records.
          <br />
          Together, they reveal patterns across time.
        </p>
      </header>

      {/* FEATURED CHAPTER */}

      {featuredChapter && (
        <section className="story-intro">

          <div className="story-intro-image">
            <img
              src="/life-receipts-hero.jpg"
              alt="Life story"
            />
          </div>

          <div className="story-intro-content">

            <span className="story-label">
              MOST ACTIVE PERIOD
            </span>

            <h2>
              {featuredChapter.title}
            </h2>

            <p>
              {featuredChapter.description}
            </p>

            <div className="story-stat-row">

              <div>
                <strong>
                  {featuredChapter.counts.total.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <span>
                  recorded moments
                </span>
              </div>

              <div>
                <strong>
                  {featuredChapter.startYear}
                </strong>

                <span>
                  to {featuredChapter.endYear}
                </span>
              </div>

            </div>

          </div>

        </section>
      )}

      {/* CHAPTERS */}

      <section className="chapters-section">

        <div className="story-section-heading">

          <div>
            <span className="eyebrow">
              LIFE CHAPTERS
            </span>

            <h2>
              Moments become chapters.
            </h2>
          </div>

          <div className="story-hand-note">
            Your archive,
            <br />
            read differently ✦
          </div>

        </div>

        {chapters.length === 0 ? (
          <div className="empty-results">
            <div className="empty-icon">✦</div>

            <h2>No chapters found</h2>

            <p>
              There isn't enough recorded data to build a story yet.
            </p>
          </div>
        ) : (
          <div className="chapters-list">

            {chapters.map((chapter) => (
              <article
                className={`chapter-card ${chapter.className}`}
                key={chapter.id}
              >

                <div className="chapter-number">
                  {chapter.number}
                </div>

                <div className="chapter-icon">
                  {chapter.icon}
                </div>

                <div className="chapter-content">

                  <span>
                    {chapter.subtitle}
                  </span>

                  <h3>
                    {chapter.title}
                  </h3>

                  <p>
                    {chapter.description}
                  </p>

                 <div className="chapter-stats">

  <span>
    ♫{" "}
    {chapter.counts.spotify.toLocaleString(
      "en-IN"
    )}
  </span>

  <span>
    ⌂{" "}
    {chapter.counts.household.toLocaleString(
      "en-IN"
    )}
  </span>

  <span>
    ₹{" "}
    {chapter.counts.india.toLocaleString(
      "en-IN"
    )}
  </span>

</div>
                </div>

             <button
  className="chapter-button"
  onClick={() => {
    const receipts = getReceiptsForChapter(
      allReceipts,
      chapter
    );

    setSelectedChapter(chapter);
    setChapterReceipts(receipts);
  }}
>
  Explore →
</button>

              </article>
            ))}

          </div>
        )}

{selectedChapter && (
  <section className="chapter-receipts">

    <div className="chapter-receipts-header">

      <div>
        <span className="eyebrow">
          CHAPTER {selectedChapter.number}
        </span>

        <h2>{selectedChapter.title}</h2>

        <p>
          {chapterReceipts.length.toLocaleString("en-IN")}{" "}
          recorded moments from{" "}
          {selectedChapter.startYear}–{selectedChapter.endYear}
        </p>
      </div>

      <button
        className="close-chapter"
        onClick={() => {
          setSelectedChapter(null);
          setChapterReceipts([]);
        }}
      >
        Close ×
      </button>

    </div>

    <div className="chapter-receipt-grid">

      {chapterReceipts.slice(0, 18).map((receipt) => (
        <article
          className="chapter-receipt-card"
          key={receipt.id}
        >

          <div className="chapter-receipt-icon">
            {receipt.source === "spotify"
              ? "♫"
              : receipt.source === "india"
              ? "♧"
              : "⌂"}
          </div>

          <div>

            <span className="receipt-type">
              {receipt.type}
            </span>

            <h3>{receipt.title}</h3>

            <p>
              {receipt.description ||
                "Recorded life moment"}
            </p>

            <div className="chapter-receipt-meta">

              <span>
                {receipt.dateText}
              </span>

              {receipt.amount !== null && (
                <span>
                  {receipt.currency}{" "}
                  {Number(receipt.amount).toLocaleString(
                    "en-IN"
                  )}
                </span>
              )}

            </div>

          </div>

        </article>
      ))}

    </div>

    {chapterReceipts.length > 18 && (
      <p className="chapter-more">
        Showing 18 of{" "}
        {chapterReceipts.length.toLocaleString("en-IN")}{" "}
        receipts from this chapter.
      </p>
    )}

  </section>
)}
      </section>

      <div className="story-footer-note">
        <span>〰</span>

        The archive is made of moments.
        The story comes from how they connect.

        <span>〰</span>
      </div>

    </div>
  );
}

export default Story;