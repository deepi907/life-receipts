import { useEffect, useMemo, useState } from "react";
import "../index.css";

import { loadAllLifeData } from "../services/DataLoader";

function getIcon(receipt) {
  if (receipt.source === "spotify") return "♫";
  if (receipt.source === "india") return "♧";
  return "⌂";
}

function formatAmount(receipt) {
  if (receipt.amount === null || receipt.amount === undefined) {
    return null;
  }

  return `${receipt.currency || ""} ${Number(
    receipt.amount
  ).toLocaleString("en-IN")}`;
}

function Search() {
  const [receipts, setReceipts] = useState([]);
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadAllLifeData();
        setReceipts(data.receipts);
      } catch (err) {
        console.error(err);
        setError("Unable to load your life receipts.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const results = useMemo(() => {
    const text = query.toLowerCase().trim();

    return receipts.filter((receipt) => {
      const matchesSource =
        sourceFilter === "All" ||
        receipt.source === sourceFilter;

      if (!text) {
        return matchesSource;
      }

      const searchableText = [
        receipt.title,
        receipt.description,
        receipt.type,
        receipt.category,
        receipt.merchant,
        receipt.location,
        receipt.meta?.artist,
        receipt.meta?.album,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesSource &&
        searchableText.includes(text)
      );
    });
  }, [receipts, query, sourceFilter]);

  if (loading) {
    return (
      <div className="search-page">
        <div className="empty-results">
          <div className="empty-icon">⌕</div>

          <h2>Opening your archive...</h2>

          <p>
            Searching across your recorded moments.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-page">
        <div className="empty-results">
          <div className="empty-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">

      <header className="search-page-header">
        <span className="eyebrow">SEARCH</span>

        <h1>Find a Moment</h1>

        <p>
          Search across music, purchases, places and routines
          in one archive.
        </p>
      </header>

      <div className="global-search-box">
        <span>⌕</span>

        <input
          autoFocus
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Try an artist, merchant, place, category..."
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="clear-search"
          >
            ×
          </button>
        )}
      </div>

      <div className="search-filters">
        <button
          className={
            sourceFilter === "All"
              ? "search-filter active"
              : "search-filter"
          }
          onClick={() => setSourceFilter("All")}
        >
          All
        </button>

        <button
          className={
            sourceFilter === "spotify"
              ? "search-filter active"
              : "search-filter"
          }
          onClick={() => setSourceFilter("spotify")}
        >
          ♫ Music
        </button>

        <button
          className={
            sourceFilter === "india"
              ? "search-filter active"
              : "search-filter"
          }
          onClick={() => setSourceFilter("india")}
        >
          ♧ Purchases
        </button>

        <button
          className={
            sourceFilter === "household"
              ? "search-filter active"
              : "search-filter"
          }
          onClick={() => setSourceFilter("household")}
        >
          ⌂ Household
        </button>
      </div>

      <div className="search-summary">
        {query ? (
          <>
            <strong>
              {results.length.toLocaleString("en-IN")}
            </strong>{" "}
            results for{" "}
            <span>“{query}”</span>
          </>
        ) : (
          <>
            <strong>
              {receipts.length.toLocaleString("en-IN")}
            </strong>{" "}
            searchable moments
          </>
        )}
      </div>

      {query && results.length === 0 ? (
        <div className="empty-results">
          <div className="empty-icon">⌕</div>

          <h2>No moments found</h2>

          <p>
            Try a different artist, merchant, place or category.
          </p>
        </div>
      ) : (
        <div className="search-results">

          {results.slice(0, 60).map((receipt) => {
            const amount = formatAmount(receipt);

            return (
              <button
                className="search-result-card"
                key={receipt.id}
                onClick={() =>
                  setSelectedReceipt(receipt)
                }
              >
                <div className="search-result-icon">
                  {getIcon(receipt)}
                </div>

                <div className="search-result-main">
                  <span className="receipt-type">
                    {receipt.type}
                  </span>

                  <h3>{receipt.title}</h3>

                  <p>
                    {receipt.description ||
                      "Recorded life moment"}
                  </p>
                </div>

                <div className="search-result-meta">
                  <span>{receipt.dateText}</span>

                  {amount && (
                    <strong>{amount}</strong>
                  )}
                </div>
              </button>
            );
          })}

        </div>
      )}

      {results.length > 60 && (
        <div className="search-more">
          Showing the first 60 results from{" "}
          {results.length.toLocaleString("en-IN")} matches.
        </div>
      )}

      {selectedReceipt && (
        <div
          className="receipt-modal-backdrop"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="receipt-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="receipt-modal-close"
              onClick={() =>
                setSelectedReceipt(null)
              }
            >
              ×
            </button>

            <div className="receipt-modal-icon">
              {getIcon(selectedReceipt)}
            </div>

            <span className="receipt-type">
              {selectedReceipt.type}
            </span>

            <h2>
              {selectedReceipt.title}
            </h2>

            <p className="receipt-modal-description">
              {selectedReceipt.description ||
                "Recorded life moment"}
            </p>

            <div className="receipt-detail-grid">

              <div>
                <span>Date</span>
                <strong>
                  {selectedReceipt.dateText}
                </strong>
              </div>

              <div>
                <span>Source</span>
                <strong>
                  {selectedReceipt.source}
                </strong>
              </div>

              {selectedReceipt.category && (
                <div>
                  <span>Category</span>
                  <strong>
                    {selectedReceipt.category}
                  </strong>
                </div>
              )}

              {selectedReceipt.merchant && (
                <div>
                  <span>Merchant</span>
                  <strong>
                    {selectedReceipt.merchant}
                  </strong>
                </div>
              )}

              {selectedReceipt.location && (
                <div>
                  <span>Location</span>
                  <strong>
                    {selectedReceipt.location}
                  </strong>
                </div>
              )}

              {formatAmount(selectedReceipt) && (
                <div>
                  <span>Amount</span>
                  <strong>
                    {formatAmount(selectedReceipt)}
                  </strong>
                </div>
              )}

            </div>

            {selectedReceipt.source === "spotify" && (
              <div className="receipt-extra">
                <span>Music details</span>

                <p>
                  Artist:{" "}
                  {selectedReceipt.meta?.artist || "—"}
                </p>

                <p>
                  Album:{" "}
                  {selectedReceipt.meta?.album || "—"}
                </p>

                <p>
                  Platform:{" "}
                  {selectedReceipt.meta?.platform || "—"}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Search;