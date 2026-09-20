function getYear(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getFullYear();
}

function formatYearRange(start, end) {
  if (start === end) {
    return String(start);
  }

  return `${start}–${end}`;
}

function countByYear(receipts) {
  const counts = {};

  for (const receipt of receipts) {
    const year = getYear(receipt.date);

    if (!year) continue;

    counts[year] = (counts[year] || 0) + 1;
  }

  return counts;
}

function countSourcesByYear(receipts) {
  const result = {};

  for (const receipt of receipts) {
    const year = getYear(receipt.date);

    if (!year) continue;

    if (!result[year]) {
      result[year] = {
        spotify: 0,
        household: 0,
        india: 0,
        total: 0,
      };
    }

    result[year].total += 1;

    if (receipt.source === "spotify") {
      result[year].spotify += 1;
    }

    if (receipt.source === "household") {
      result[year].household += 1;
    }

    if (receipt.source === "india") {
      result[year].india += 1;
    }
  }

  return result;
}

function getChapterIcon(sourceStats) {
  if (sourceStats.spotify > 0 && sourceStats.india > 0) {
    return "✦";
  }

  if (sourceStats.spotify > 0) {
    return "♫";
  }

  if (sourceStats.household > 0) {
    return "⌂";
  }

  if (sourceStats.india > 0) {
    return "⌖";
  }

  return "✦";
}

function getChapterTitle(sourceStats, startYear, endYear) {
  const sources = [];

  if (sourceStats.spotify > 0) {
    sources.push("Music");
  }

  if (sourceStats.household > 0) {
    sources.push("Routine");
  }

  if (sourceStats.india > 0) {
    sources.push("Purchases");
  }

  const yearRange =
    startYear === endYear
      ? `${startYear}`
      : `${startYear}–${endYear}`;

  if (sources.length === 3) {
    return `${yearRange}: Many Parts of Life`;
  }

  if (
    sourceStats.spotify > 0 &&
    sourceStats.india > 0
  ) {
    return `${yearRange}: Music & Movement`;
  }

  if (
    sourceStats.spotify > 0 &&
    sourceStats.household > 0
  ) {
    return `${yearRange}: Music & Routine`;
  }

  if (
    sourceStats.india > 0 &&
    sourceStats.household > 0
  ) {
    return `${yearRange}: Spending & Routine`;
  }

  if (sourceStats.spotify > 0) {
    return `${yearRange}: A Listening Chapter`;
  }

  if (sourceStats.india > 0) {
    return `${yearRange}: A Transaction Chapter`;
  }

  if (sourceStats.household > 0) {
    return `${yearRange}: Everyday Life`;
  }

  return `${yearRange}: A Recorded Chapter`;
}

function getChapterSubtitle(sourceStats, startYear, endYear) {
  const range = formatYearRange(startYear, endYear);

  return `${range} • ${sourceStats.total.toLocaleString(
    "en-IN"
  )} recorded moments`;
}

function getChapterDescription(sourceStats, startYear, endYear) {
  const parts = [];

  if (sourceStats.spotify > 0) {
    parts.push(
      `${sourceStats.spotify.toLocaleString(
        "en-IN"
      )} music records`
    );
  }

  if (sourceStats.household > 0) {
    parts.push(
      `${sourceStats.household.toLocaleString(
        "en-IN"
      )} household records`
    );
  }

  if (sourceStats.india > 0) {
    parts.push(
      `${sourceStats.india.toLocaleString(
        "en-IN"
      )} transaction records`
    );
  }

  return `Between ${startYear} and ${endYear}, the archive contains ${parts.join(
    ", "
  )}.`;
}

/**
 * Convert the full receipt archive into a small number
 * of readable life chapters.
 *
 * Chapters describe recorded activity only.
 */
export function generateChapters(receipts = []) {
  const yearlyCounts = countByYear(receipts);
  const sourceByYear = countSourcesByYear(receipts);

  const years = Object.keys(yearlyCounts)
    .map(Number)
    .sort((a, b) => a - b);

  if (years.length === 0) {
    return [];
  }

  const chapters = [];

  /*
   * Use three broad periods so the Story page feels like
   * a story rather than a long chronological list.
   */
  const minYear = years[0];
  const maxYear = years[years.length - 1];

  const ranges = [];

  if (minYear <= 2016 && maxYear >= 2017) {
    ranges.push({
      start: minYear,
      end: Math.min(2016, maxYear),
    });
  }

  if (maxYear >= 2017) {
    ranges.push({
      start: Math.max(2017, minYear),
      end: Math.min(2021, maxYear),
    });
  }

  if (maxYear >= 2022) {
    ranges.push({
      start: Math.max(2022, minYear),
      end: maxYear,
    });
  }

  for (const range of ranges) {
    let combined = {
      spotify: 0,
      household: 0,
      india: 0,
      total: 0,
    };

    for (
      let year = range.start;
      year <= range.end;
      year++
    ) {
      const stats = sourceByYear[year];

      if (!stats) continue;

      combined.spotify += stats.spotify;
      combined.household += stats.household;
      combined.india += stats.india;
      combined.total += stats.total;
    }

    if (combined.total === 0) {
      continue;
    }

    chapters.push({
      id: `chapter-${range.start}-${range.end}`,
      number: String(chapters.length + 1).padStart(2, "0"),

      title: getChapterTitle(
        combined,
        range.start,
        range.end
      ),

      subtitle: getChapterSubtitle(
        combined,
        range.start,
        range.end
      ),

      description: getChapterDescription(
        combined,
        range.start,
        range.end
      ),

      icon: getChapterIcon(combined),

      startYear: range.start,
      endYear: range.end,

      counts: combined,

      className:
        chapters.length % 3 === 0
          ? "chapter-blue"
          : chapters.length % 3 === 1
          ? "chapter-green"
          : "chapter-peach",
    });
  }

  return chapters;
}

/**
 * Find the period containing the most recorded activity.
 */
export function getMostActiveChapter(chapters = []) {
  if (chapters.length === 0) {
    return null;
  }

  return [...chapters].sort(
    (a, b) => b.counts.total - a.counts.total
  )[0];
}

export function getReceiptsForChapter(receipts = [], chapter) {
  if (!chapter) {
    return [];
  }

  const start = new Date(
    chapter.startYear,
    0,
    1
  );

  const end = new Date(
    chapter.endYear,
    11,
    31,
    23,
    59,
    59
  );

  return receipts.filter((receipt) => {
    if (!(receipt.date instanceof Date)) {
      return false;
    }

    return (
      receipt.date >= start &&
      receipt.date <= end
    );
  });
}