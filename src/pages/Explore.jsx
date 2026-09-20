import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../index.css";

import { loadAllLifeData } from "../services/DataLoader";

function getReceiptIcon(receipt) {
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

function Explore() {
  const [receipts, setReceipts] = useState([]);
  
  const [search, setSearch] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

const urlType = searchParams.get("type");

const [activeFilter, setActiveFilter] = useState(
  urlType || "All"
);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        const data = await loadAllLifeData();

        setReceipts(data.receipts);

        console.log("Explore data:", data.stats);
      } catch (err) {
        console.error(err);
        setError("Unable to load your receipts.");
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  const filters = [
    "All",
    "Music",
    "Purchase",
    "Routine",
    "Income",
  ];

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesFilter =
      activeFilter === "All" ||
      receipt.type === activeFilter;

    const query = search.toLowerCase().trim();

    const searchableText = [
      receipt.title,
      receipt.description,
      receipt.type,
      receipt.category,
      receipt.merchant,
      receipt.location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !query || searchableText.includes(query);

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="explore-page">
        <div className="empty-results">
          <div className="empty-icon">✦</div>

          <h2>Gathering your receipts...</h2>

          <p>
            Bringing your music, spending and routines together.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="explore-page">
        <div className="empty-results">
          <div className="empty-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page">

      <div className="page-header">

        <div>
          <span className="eyebrow">EXPLORE</span>

          <h1>Browse Your Receipts</h1>

          <p>
            Search through the moments that make up your digital life.
          </p>
        </div>

        <div className="explore-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search music, merchants, places..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

      </div>

      <div className="filter-row">

        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter ${
              activeFilter === filter ? "active" : ""
            }`}
         onClick={() => {
  setActiveFilter(filter);

  if (filter === "All") {
    setSearchParams({});
  } else {
    setSearchParams({ type: filter });
  }
}}
          >
            {filter}
          </button>
        ))}

      </div>

      <div className="explore-result-count">
        Showing{" "}
        <strong>
          {filteredReceipts.length.toLocaleString("en-IN")}
        </strong>{" "}
        of{" "}
        <strong>
          {receipts.length.toLocaleString("en-IN")}
        </strong>{" "}
        receipts
      </div>

      {filteredReceipts.length === 0 ? (
        <div className="empty-results">

          <div className="empty-icon">⌕</div>

          <h2>No receipts found</h2>

          <p>
            Try another search or select a different category.
          </p>

        </div>
      ) : (
        <div className="receipt-grid">

          {filteredReceipts.slice(0, 60).map((receipt) => {

            const amount = formatAmount(receipt);

            return (
              <button
                className="receipt-card receipt-card-button"
                key={receipt.id}
                onClick={() =>
                  setSelectedReceipt(receipt)
                }
              >

                <div
                  className={`receipt-icon ${
                    receipt.type.toLowerCase()
                  }`}
                >
                  {getReceiptIcon(receipt)}
                </div>

                <div className="receipt-body">

                  <span className="receipt-type">
                    {receipt.type}
                  </span>

                  <h3>
                    {receipt.title}
                  </h3>

                  <p>
                    {receipt.description ||
                      "Recorded life moment"}
                  </p>

                  <div className="receipt-footer">

                    <span>
                      {receipt.dateText}
                    </span>

                    <span>
                      {amount || "View details →"}
                    </span>

                  </div>

                </div>

              </button>
            );
          })}

        </div>
      )}

      {/* DETAIL MODAL */}

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
              {getReceiptIcon(selectedReceipt)}
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
                  {selectedReceipt.meta.artist || "—"}
                </p>

                <p>
                  Album:{" "}
                  {selectedReceipt.meta.album || "—"}
                </p>

                <p>
                  Platform:{" "}
                  {selectedReceipt.meta.platform || "—"}
                </p>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Explore;