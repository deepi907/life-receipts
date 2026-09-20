function monthKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function monthLabel(key) {
  if (!key) return "";

  const [year, month] = key.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    1
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function countByMonth(receipts = []) {
  const counts = {};

  receipts.forEach((receipt) => {
    const key = monthKey(receipt.date);

    if (!key) return;

    if (!counts[key]) {
      counts[key] = 0;
    }

    counts[key] += 1;
  });

  return counts;
}

function percentile(values, value) {
  const numbers = values
    .map(Number)
    .filter(Number.isFinite);

  if (!numbers.length) {
    return 0;
  }

  const sorted = [...numbers].sort(
    (a, b) => a - b
  );

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  let index = sorted.findIndex(
    (item) => item >= numericValue
  );

  if (index === -1) {
    index = sorted.length - 1;
  }

  if (sorted.length === 1) {
    return 100;
  }

  return Math.round(
    (index / (sorted.length - 1)) * 100
  );
}

export function findCrossDatasetConnections({
  spotify = [],
  household = [],
  india = [],
}) {
  const spotifyMonths = countByMonth(spotify);
  const householdMonths = countByMonth(household);
  const indiaMonths = countByMonth(india);

  const spotifyValues = Object.values(
    spotifyMonths
  );

  const householdValues = Object.values(
    householdMonths
  );

  const indiaValues = Object.values(
    indiaMonths
  );

  const allMonths = new Set([
    ...Object.keys(spotifyMonths),
    ...Object.keys(householdMonths),
    ...Object.keys(indiaMonths),
  ]);

  const connections = [];

  allMonths.forEach((month) => {
    const spotifyCount =
      Number(spotifyMonths[month]) || 0;

    const householdCount =
      Number(householdMonths[month]) || 0;

    const indiaCount =
      Number(indiaMonths[month]) || 0;

    const spotifyPercentile =
      percentile(
        spotifyValues,
        spotifyCount
      );

    const householdPercentile =
      percentile(
        householdValues,
        householdCount
      );

    const indiaPercentile =
      percentile(
        indiaValues,
        indiaCount
      );

    const sources = [];

    if (
      spotifyCount > 0 &&
      spotifyPercentile >= 75
    ) {
      sources.push("Music");
    }

    if (
      householdCount > 0 &&
      householdPercentile >= 75
    ) {
      sources.push("Routine");
    }

    if (
      indiaCount > 0 &&
      indiaPercentile >= 75
    ) {
      sources.push("Purchases");
    }

    if (sources.length < 2) {
      return;
    }

    let title = "";
    let description = "";
    let icon = "✦";

    if (sources.includes("Music") &&
        sources.includes("Purchases") &&
        sources.includes("Routine")) {
      title = "Three parts of life stood out";
      description =
        `${monthLabel(month)} had unusually high recorded ` +
        `activity across music, household records and purchases.`;
      icon = "✦";
    } else if (
      sources.includes("Music") &&
      sources.includes("Purchases")
    ) {
      title = "Music & purchases both peaked";
      description =
        `${monthLabel(month)} had unusually high activity ` +
        `in both listening and purchase records.`;
      icon = "♫";
    } else if (
      sources.includes("Music") &&
      sources.includes("Routine")
    ) {
      title = "Listening & routine both stood out";
      description =
        `${monthLabel(month)} had unusually high activity ` +
        `in both music and household records.`;
      icon = "⌂";
    } else if (
      sources.includes("Routine") &&
      sources.includes("Purchases")
    ) {
      title = "Spending & routine both stood out";
      description =
        `${monthLabel(month)} had unusually high activity ` +
        `across household and purchase records.`;
      icon = "₹";
    }

    const total =
      spotifyCount +
      householdCount +
      indiaCount;

    connections.push({
      id: `connection-${month}`,

      title,

      description,

      period: monthLabel(month),

      icon,

      sources,

      score:
        spotifyPercentile +
        householdPercentile +
        indiaPercentile,

      counts: {
        spotify: spotifyCount,
        household: householdCount,
        india: indiaCount,
        total,
      },
    });
  });

  return connections
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function countByCategory(receipts = []) {
  const result = {};

  receipts.forEach((receipt) => {
    const category =
      receipt.category || "Other";

    result[category] =
      (result[category] || 0) + 1;
  });

  return result;
}

function countByLocation(receipts = []) {
  const result = {};

  receipts.forEach((receipt) => {
    if (!receipt.location) return;

    result[receipt.location] =
      (result[receipt.location] || 0) + 1;
  });

  return result;
}

export function findTopCategories(receipts = []) {
  const counts = countByCategory(receipts);

  return Object.entries(counts)
    .map(([category, count]) => ({
      category,
      count: Number(count) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function findTopLocations(receipts = []) {
  const counts = countByLocation(receipts);

  return Object.entries(counts)
    .map(([location, count]) => ({
      location,
      count: Number(count) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function analyzeConnections({
  spotify = [],
  household = [],
  india = [],
  receipts = [],
}) {
  return {
    crossDataset: findCrossDatasetConnections({
      spotify,
      household,
      india,
    }),

    topCategories:
      findTopCategories(receipts),

    topLocations:
      findTopLocations(
        receipts.filter(
          (receipt) =>
            receipt.source === "india"
        )
      ),
  };
}