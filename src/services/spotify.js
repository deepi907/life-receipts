import Papa from "papaparse";

const SPOTIFY_CSV =
  "/dataset/archive/spotify_history.csv";

export async function loadSpotifyData() {
  try {
    const response = await fetch(SPOTIFY_CSV);

    if (!response.ok) {
      throw new Error(
        `Could not load Spotify data: ${response.status}`
      );
    }

    const csvText = await response.text();

    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (result.errors.length > 0) {
      console.warn("Spotify CSV parsing warnings:", result.errors);
    }

    return result.data;
  } catch (error) {
    console.error("Spotify data loading failed:", error);
    throw error;
  }
}