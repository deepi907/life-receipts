import { useEffect, useState } from "react";
import "../index.css";

import { loadAllLifeData } from "../services/DataLoader";
import { analyzeConnections } from "../analysis/patterns";

import LifeMap from "../components/LifeMap";
import ConnectionDetail from "../components/ConnectionDetail";

function safeCount(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function ConnectionNode({ icon, type, title, text }) {
  return (
    <div className="connection-node">
      <div className="node-icon">{icon}</div>

      <div>
        <span className="node-type">
          {type}
        </span>

        <h3>{title}</h3>

        <p>{text}</p>
      </div>
    </div>
  );
}

function Connections() {
  const [data, setData] = useState(null);
  const [connections, setConnections] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [selectedConnection, setSelectedConnection] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConnections() {
      try {
        const result = await loadAllLifeData();

        const analysis = analyzeConnections(result);

        setData(result);
        setConnections(
          analysis.crossDataset || []
        );
        setTopLocations(
          analysis.topLocations || []
        );

        console.log(
          "Connections analysis:",
          analysis
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to analyze your life receipts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadConnections();
  }, []);

  if (loading) {
    return (
      <div className="connections-page">
        <div className="empty-results">
          <div className="empty-icon">
            ⛓
          </div>

          <h2>
            Finding your connections...
          </h2>

          <p>
            Looking across music, purchases and
            household activity.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="connections-page">
        <div className="empty-results">
          <div className="empty-icon">!</div>

          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="connections-page">

      {/* HEADER */}

      <header className="connections-page-header">
        <div>
          <span className="eyebrow">
            CONNECTIONS
          </span>

          <h1>
            Where Your Moments Meet
          </h1>

          <p>
            Discover patterns across your recorded
            life.
          </p>
        </div>

        <div className="connections-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Find a connection..."
          />
        </div>
      </header>

      {/* INTRO */}

      <div className="connection-intro">
        <div className="intro-symbol">
          ⛓
        </div>

        <div>
          <h2>
            Nothing exists alone.
          </h2>

          <p>
            Separate records can reveal overlapping
            periods of activity when viewed together.
          </p>
        </div>
      </div>

      {/* LIFE MAP */}

      <LifeMap
        stats={data?.stats || {}}
        connections={connections}
      />

      {/* DISCOVERED PATTERNS */}

      <section className="connection-map">

        <div className="map-heading">
          <div>
            <span className="eyebrow">
              DISCOVERED PATTERNS
            </span>

            <h2>
              Moments Connected
            </h2>
          </div>
        </div>

        {connections.length === 0 ? (

          <div className="empty-results">
            <div className="empty-icon">
              ✦
            </div>

            <h2>
              No cross-dataset patterns yet
            </h2>

            <p>
              There isn't enough overlapping recorded
              activity to show a connection.
            </p>
          </div>

        ) : (

          <div className="connection-stack">

            {connections.map(
              (connection, index) => {

                const counts = connection.counts || {};

const musicValue = Number(counts.spotify);
const householdValue = Number(counts.household);
const purchasesValue = Number(counts.india);

const music = Number.isFinite(musicValue)
  ? musicValue
  : 0;

const household = Number.isFinite(householdValue)
  ? householdValue
  : 0;

const purchases = Number.isFinite(purchasesValue)
  ? purchasesValue
  : 0;

const total = music + household + purchases;
                const sourceText =
                  connection.sources?.length
                    ? connection.sources.join(
                        " + "
                      )
                    : "Connected activity";

                return (
                  <article
                    className={`connection-row ${
                      index % 3 === 0
                        ? "blue"
                        : index % 3 === 1
                        ? "green"
                        : "peach"
                    }`}
                    key={connection.id}
                    onClick={() =>
                      setSelectedConnection(
                        connection
                      )
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();

                        setSelectedConnection(
                          connection
                        );
                      }
                    }}
                  >

                    <ConnectionNode
                      icon={
                        connection.icon || "✦"
                      }
                      type={sourceText}
                      title={
                        connection.title ||
                        "Connected moments"
                      }
                      text={
                        connection.description ||
                        "Overlapping recorded activity."
                      }
                    />

                    <div className="connection-line">
                      <span className="line-dot"></span>

                      <div className="line"></div>

                      <span className="line-dot"></span>
                    </div>

                    <div className="connection-summary">

                      <span className="node-type">
                        {connection.period}
                      </span>

                      <h3>
                        {total.toLocaleString(
                          "en-IN"
                        )}{" "}
                        recorded moments
                      </h3>

                      <p>
                        Music:{" "}
                        {music.toLocaleString(
                          "en-IN"
                        )}

                        {" · "}

                        Household:{" "}
                        {household.toLocaleString(
                          "en-IN"
                        )}

                        {" · "}

                        Purchases:{" "}
                        {purchases.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* LOCATIONS */}

      {topLocations.length > 0 && (

        <section className="locations-section">

          <div className="map-heading">

            <div>
              <span className="eyebrow">
                PLACES
              </span>

              <h2>
                Frequently Recorded Places
              </h2>
            </div>

          </div>

          <div className="location-grid">

            {topLocations
              .slice(0, 6)
              .map((location) => (

                <div
                  className="location-card"
                  key={location.location}
                >

                  <span className="location-icon">
                    ⌖
                  </span>

                  <div>

                    <strong>
                      {location.location}
                    </strong>

                    <small>
                      {safeCount(
                        location.count
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      recorded transactions
                    </small>

                  </div>

                </div>

              ))}

          </div>

        </section>
      )}

      {/* CONNECTION DETAIL */}

      {selectedConnection && (

        <ConnectionDetail
          connection={selectedConnection}
          receipts={
            data?.receipts || []
          }
          onClose={() =>
            setSelectedConnection(null)
          }
        />

      )}

      {/* FOOTER */}

      <div className="connection-note">
        <span>〰</span>

        Patterns emerge when separate moments
        are viewed together.

        <span>〰</span>
      </div>

    </div>
  );
}

export default Connections;