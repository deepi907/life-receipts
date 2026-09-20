function safeString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function safeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/**
 * Spotify → common receipt format
 */
export function normalizeSpotify(rows = []) {
  return rows
    .filter((row) => row && row.ts)
    .map((row, index) => {
      const date = parseDate(row.ts);

      return {
        id: `spotify-${index}`,
        source: "spotify",
        type: "Music",

        date,
        dateText: date
          ? date.toLocaleDateString()
          : safeString(row.ts),

        title: safeString(row.track_name) || "Unknown track",

        description: [
          safeString(row.artist_name),
          safeString(row.album_name),
        ]
          .filter(Boolean)
          .join(" • "),

        amount: null,
        currency: null,

        category: "Music",
        merchant: null,
        location: null,

        meta: {
          artist: safeString(row.artist_name),
          album: safeString(row.album_name),
          platform: safeString(row.platform),
          msPlayed: safeNumber(row.ms_played),
          skipped: row.skipped,
          shuffle: row.shuffle,
          reasonStart: safeString(row.reason_start),
          reasonEnd: safeString(row.reason_end),
        },

        raw: row,
      };
    });
}

/**
 * Daily Household Transactions → common receipt format
 */
export function normalizeHousehold(rows = []) {
  return rows
    .filter((row) => row)
    .map((row, index) => {
      const date = parseDate(row.Date);

      const category = safeString(row.Category);
      const subcategory = safeString(row.Subcategory);
      const note = safeString(row.Note);

      const isIncome =
        safeString(row["Income/Expense"]).toLowerCase() === "income";

      return {
        id: `household-${index}`,
        source: "household",
        type: isIncome ? "Income" : "Routine",

        date,
        dateText: date
          ? date.toLocaleDateString()
          : safeString(row.Date),

        title:
          note ||
          subcategory ||
          category ||
          "Household transaction",

        description: [category, subcategory]
          .filter(Boolean)
          .join(" • "),

        amount: safeNumber(row.Amount),
        currency: safeString(row.Currency),

        category: category || "Other",
        merchant: null,
        location: null,

        meta: {
          mode: safeString(row.Mode),
          subcategory,
          incomeExpense: safeString(row["Income/Expense"]),
          note,
        },

        raw: row,
      };
    });
}

/**
 * India Transactions → common receipt format
 *
 * Sensitive fields such as:
 * first, last, cc_num, street, dob
 * are retained only inside raw data and are NOT
 * exposed as display fields.
 */
export function normalizeIndiaTransactions(rows = []) {
  return rows
    .filter((row) => row)
    .map((row, index) => {
      const rawDate =
        row.trans_date_trans_time ||
        row.trans_date ||
        row.date;

      const date = parseDate(rawDate);

      const merchant = safeString(row.merchant);

      const category = safeString(row.category);

      const city = safeString(row.city);

      const state = safeString(row.state);

      const location = [city, state]
        .filter(Boolean)
        .join(", ");

      return {
        id: `india-${index}`,
        source: "india",
        type: "Purchase",

        date,
        dateText: date
          ? date.toLocaleDateString()
          : safeString(rawDate),

        title:
          merchant ||
          category ||
          "Transaction",

        description: [
          category,
          location,
        ]
          .filter(Boolean)
          .join(" • "),

        amount: safeNumber(row.amt),
        currency: "INR",

        category: category || "Other",
        merchant: merchant || null,
        location: location || null,

        meta: {
          city,
          state,
          lat: safeNumber(row.lat),
          long: safeNumber(row.long),
          merchLat: safeNumber(row.merch_lat),
          merchLong: safeNumber(row.merch_long),
          fraud: row.is_fraud,
        },

        raw: row,
      };
    });
}

/**
 * Combine all three datasets into one collection.
 */
export function combineReceipts({
  spotify = [],
  household = [],
  india = [],
}) {
  return [
    ...normalizeSpotify(spotify),
    ...normalizeHousehold(household),
    ...normalizeIndiaTransactions(india),
  ].sort((a, b) => {
    const dateA = a.date ? a.date.getTime() : 0;
    const dateB = b.date ? b.date.getTime() : 0;

    return dateB - dateA;
  });
}