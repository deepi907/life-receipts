import { loadSpotifyData } from "./spotify";
import { loadHouseholdData } from "./household";
import { loadIndiaTransactions } from "./indiaTransactions";

import {
  normalizeSpotify,
  normalizeHousehold,
  normalizeIndiaTransactions,
} from "../data/normalize";

export async function loadAllLifeData() {
  try {
    const [
      spotifyRaw,
      householdRaw,
      indiaRaw,
    ] = await Promise.all([
      loadSpotifyData(),
      loadHouseholdData(),
      loadIndiaTransactions(),
    ]);

    // Normalize each dataset exactly once
    const spotify = normalizeSpotify(
      spotifyRaw
    );

    const household = normalizeHousehold(
      householdRaw
    );

    const india = normalizeIndiaTransactions(
      indiaRaw
    );

    // One combined normalized archive
    const receipts = [
      ...spotify,
      ...household,
      ...india,
    ].sort((a, b) => {
      const dateA =
        a.date instanceof Date
          ? a.date.getTime()
          : 0;

      const dateB =
        b.date instanceof Date
          ? b.date.getTime()
          : 0;

      return dateB - dateA;
    });

    const stats = {
      spotify: spotify.length,
      household: household.length,
      india: india.length,
      total: receipts.length,
    };

    console.log("DATA LOADED", {
      spotify: spotify.length,
      household: household.length,
      india: india.length,
      total: receipts.length,
    });

    // Check the first record of each source
    console.log(
      "Spotify sample:",
      spotify[0]
    );

    console.log(
      "Household sample:",
      household[0]
    );

    console.log(
      "India sample:",
      india[0]
    );

    return {
      spotify,
      household,
      india,
      receipts,
      stats,
    };
  } catch (error) {
    console.error(
      "Failed to load life data:",
      error
    );

    throw error;
  }
}