import Papa from "papaparse";

const HOUSEHOLD_CSV =
  "/dataset/archive (1)/Daily Household Transactions.csv";

export async function loadHouseholdData() {
  try {
    const response = await fetch(HOUSEHOLD_CSV);

    if (!response.ok) {
      throw new Error(
        `Could not load household data: ${response.status}`
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
        "Household CSV parsing warnings:",
        result.errors
      );
    }

    return result.data;
  } catch (error) {
    console.error(
      "Household data loading failed:",
      error
    );

    throw error;
  }
}