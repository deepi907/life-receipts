function safeCount(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function LifeMap({
  stats = {},
  connections = [],
}) {
  const spotify = safeCount(
    stats.spotify
  );

  const household = safeCount(
    stats.household
  );

  const india = safeCount(
    stats.india
  );

  const total =
    spotify +
    household +
    india;

  const featured =
    connections[0] || null;

  return (
    <section className="life-map-section">

      <div className="life-map-header">

        <div>

          <span className="eyebrow">
            LIFE MAP
          </span>

          <h2>
            See how the pieces connect.
          </h2>

          <p>
            Your three data sources come together
            to reveal overlapping activity across time.
          </p>

        </div>

        {featured && (
          <div className="life-map-period">
            {featured.period}
          </div>
        )}

      </div>

      <div className="life-map">

        <svg
          className="life-map-lines"
          viewBox="0 0 900 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1="450"
            y1="210"
            x2="175"
            y2="105"
          />

          <line
            x1="450"
            y1="210"
            x2="725"
            y2="105"
          />

          <line
            x1="450"
            y1="210"
            x2="450"
            y2="345"
          />
        </svg>

        <div className="life-map-center">

          <div className="life-map-center-icon">
            ✦
          </div>

          <strong>
            Your Life
          </strong>

          <span>
            {total.toLocaleString(
              "en-IN"
            )} records
          </span>

        </div>

        <div className="life-map-node node-music">

          <div className="life-map-node-icon">
            ♫
          </div>

          <span>
            SPOTIFY
          </span>

          <strong>
            {spotify.toLocaleString(
              "en-IN"
            )}
          </strong>

          <small>
            listening records
          </small>

        </div>

        <div className="life-map-node node-purchases">

          <div className="life-map-node-icon">
            ♧
          </div>

          <span>
            TRANSACTIONS
          </span>

          <strong>
            {india.toLocaleString(
              "en-IN"
            )}
          </strong>

          <small>
            purchases & places
          </small>

        </div>

        <div className="life-map-node node-household">

          <div className="life-map-node-icon">
            ⌂
          </div>

          <span>
            HOUSEHOLD
          </span>

          <strong>
            {household.toLocaleString(
              "en-IN"
            )}
          </strong>

          <small>
            everyday records
          </small>

        </div>

      </div>

      {featured && (
        <div className="life-map-insight">

          <div className="life-map-insight-icon">
            {featured.icon || "✦"}
          </div>

          <div className="life-map-insight-content">

            <span className="eyebrow">
              DISCOVERED PATTERN
            </span>

            <h3>
              {featured.title}
            </h3>

            <p>
              {featured.description}
            </p>

          </div>

          <div className="life-map-insight-counts">

            <span>
              ♫{" "}
              {safeCount(
                featured.counts?.spotify
              ).toLocaleString(
                "en-IN"
              )}
            </span>

            <span>
              ⌂{" "}
              {safeCount(
                featured.counts?.household
              ).toLocaleString(
                "en-IN"
              )}
            </span>

            <span>
              ♧{" "}
              {safeCount(
                featured.counts?.india
              ).toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

        </div>
      )}

    </section>
  );
}

export default LifeMap;