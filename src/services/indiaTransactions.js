import Papa from "papaparse";

const INDIA_CSV =
  "/dataset/archive (2)/Augmented_IndiaTransactMultiFacet2024.csv";

export async function loadIndiaTransactions() {
  try {
    const response = await fetch(INDIA_CSV);

    if (!response.ok) {
      throw new Error(
        `Could not load India transactions: ${response.status}`
      );
    }

    const csvText = await response.text();

    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (result.errors.length > 0) {
      console.warn(
        "India transactions CSV parsing warnings:",
        result.errors
      );
    }

    return result.data;
  } catch (error) {
    console.error(
      "India transactions loading failed:",
      error
    );

    throw error;
  }
}