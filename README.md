# 🧾 Your Life, In Receipts

A frontend-only digital experience that transforms disconnected life records into an interactive story.

## ✨ Concept

Digital life is made up of tiny moments: songs, purchases, places and everyday transactions.

Individually, these records are just data. This project connects them to help uncover patterns and turn them into a story.

**Raw Data → Insights → Connections → Story**

## 🎯 Challenge

The goal is not to build a simple chronological timeline.

This experience lets users:
- Explore real life receipts
- Search and filter records
- Discover patterns across different datasets
- See relationships visually
- Explore generated life chapters
- Open the underlying receipts behind a pattern

## 📊 Datasets

The project uses all three provided datasets:

### Spotify
Listening history containing tracks, artists, albums, timestamps, platforms and listening behaviour.

### Daily Household Transactions
Everyday financial records including dates, categories, subcategories, amounts and transaction types.

### Augmented India Transactions
Transaction records containing dates, merchants, categories, amounts, cities and states.

The original supplied dataset files and available formats are preserved in the project.

## 🧠 Pattern Discovery

The application normalizes records from different sources into a common receipt format.

It then compares activity across time and identifies periods where multiple sources show unusually high activity relative to their own history.

Examples include:
- Music + household activity
- Music + purchases
- Household + purchases
- Activity across multiple sources

The interface then connects the discovered pattern back to the underlying receipts.

## 📖 Story Experience

The Story page transforms the archive into data-driven life chapters.

Each chapter is generated from the available records and includes:
- Time period
- Number of recorded moments
- Activity from each data source
- Supporting receipts

The goal is to let users explore not only **what happened**, but also how different moments relate to each other.

## 🗺️ Life Map

The Connections page includes a visual Life Map connecting:

**Spotify → Your Life ← Transactions / Household**

This creates a visual representation of how separate datasets contribute to the overall story.

## 🔎 Explore

The Explore experience provides:
- Search
- Source/type filtering
- Receipt cards
- Interactive receipt details

Users can inspect the evidence behind the larger patterns.

## 🎨 Design

The interface uses a scrapbook / personal museum aesthetic inspired by a digital journal.

Design elements include:
- Handwritten Caveat typography
- Soft pastel colors
- Rounded cards
- Illustrated hero artwork
- Responsive layouts
- Editorial storytelling sections

## 🛠️ Tech Stack

- React
- Vite
- JavaScript
- CSS
- Papa Parse
- React Router

No backend or database is used.

## 📁 Architecture

```text
src/
├── analysis/
│   ├── chapters.js
│   └── patterns.js
├── components/
│   ├── ConnectionDetail.jsx
│   └── LifeMap.jsx
├── data/
│   └── normalize.js
├── pages/
│   ├── Home.jsx
│   ├── Explore.jsx
│   ├── Connections.jsx
│   └── Story.jsx
└── services/
    ├── spotify.js
    ├── household.js
    ├── indiaTransactions.js
    └── DataLoader.js
