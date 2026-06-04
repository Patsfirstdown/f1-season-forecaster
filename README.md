# 🏎️ F1 Season Monte Carlo Simulator

![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)
![FastF1](https://img.shields.io/badge/FastF1-latest-red)
![pandas](https://img.shields.io/badge/pandas-latest-150458?logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-latest-013243?logo=numpy&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

A data-driven Formula 1 season simulator that uses historical race results and Monte Carlo methods to forecast final driver standings. The model runs 10,000+ simulated seasons to generate probability distributions for each driver finishing in any given championship position.

---

## 📋 Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Output](#output)
- [Future Improvements](#future-improvements)

---

## Overview

Rather than predicting a single "most likely" outcome, this simulator models uncertainty across the full season. By running thousands of simulations, it produces a richer picture — for example, a driver might have a 61% chance of finishing P1 in the championship, a 24% chance of finishing P2, and so on.

The model is seeded with:
- **Historical data**: Each driver's race results from the past 5 seasons (via the FastF1 API)
- **Current season results**: Live standings and race-by-race performance so far this year

---

## How It Works

The project is split across three scripts that run in sequence:

### 1. `driver.py` — Data Collection
Queries the FastF1 API to pull historical race results for all current drivers (5 seasons of data) and current-season results. Structures the data into JSON files per driver and per track, which serve as the simulator's input.

### 2. `single_sim.py` — Single Race Prediction Engine
Contains the core functions for simulating a single race. For each driver, it models their finishing probability at a given circuit by weighting:
- Historical performance at that specific track
- Recent form this season
- Probabilistic noise to simulate real-world variance (retirements, incidents, etc.)

### 3. `season_sim.py` — Season Simulator
Iterates through every remaining race on the calendar and simulates the full season 10,000+ times. Each iteration calls the race predictor, assigns championship points, and accumulates standings. Final output is a probability matrix across all drivers and finishing positions.

---

## Project Structure

```
f1-monte-carlo/
│
├── driver.py        # Fetches and structures FastF1 data into JSON
├── single_sim.py      # Functions for simulating a single race outcome
├── season_sim.py         # Main simulator — runs 10,000+ full season iterations
│
├── data/
│   ├── drivers/           # Per-driver historical result JSONs
│   └── tracks/            # Per-circuit historical result JSONs
│
├── output/
│   ├── standings_prob.csv      # Probability of each driver finishing P1–P20
│   └── simulated_standings.csv # Aggregated simulated final standings
│
└── README.md
```

---

## Tech Stack

| Library | Purpose |
|---|---|
| `fastf1` | F1 race data API — lap times, results, session info |
| `pandas` | Data manipulation and output formatting |
| `numpy` | Probability weighting and random sampling |
| `json` | Storing structured driver/track data |
| `pathlib` | Cross-platform file path handling |
| `logging` | Runtime logging across all three scripts |
| `datetime` | Season calendar and date handling |
| `copy` | Deep copying simulation state per iteration |
| `random` | Stochastic elements within race simulation |
| `os` | File and directory management |

---

## Installation

```bash
# Clone the repo
git clone https://github.com/patsfirstdown/f1-season-forecaster.git
cd f1-season-forecaster

# Install dependencies
pip install fastf1 pandas numpy

# Enable FastF1 cache (recommended — avoids redundant API calls)
# The cache path is set inside driver.py
```

> **Note:** FastF1 pulls from the official F1 timing data API. First-time runs will cache data locally; subsequent runs are significantly faster.

---

## Usage

Run the three scripts in order:

```bash
# Step 1: Build the driver and track data files
python driver.py

# Step 2: (No direct run needed — functions imported by season_sim.py)
# single_sim.py is a module used internally

# Step 3: Run the Monte Carlo simulation
python season_sim.py
```

Results are written to the `output/` directory as CSV files.

---

## Output

The simulator produces two CSV files:

**`standings_prob.csv`** — Probability matrix. Rows are drivers, columns are championship finishing positions (P1–P20). Each cell is the percentage of simulations where that driver finished in that position.

| Driver | P1 | P2 | P3 | ... |
|---|---|---|---|---|
| VER | 0.58 | 0.23 | 0.11 | ... |
| NOR | 0.21 | 0.31 | 0.19 | ... |
| ... | | | | |

**`simulated_standings.csv`** — Mean finishing position and points across all simulations, giving a single "expected" standings forecast.

---

## Future Improvements

- [ ] Model team-level performance (car upgrades mid-season affect driver ceilings)
- [ ] Incorporate constructor standings simulation alongside driver standings
- [ ] Build a visualization layer (matplotlib/seaborn) to plot probability distributions
- [ ] Automate weekly re-runs after each race weekend with updated current-season data
- [ ] Expose results via a simple web dashboard

---

## Data Source

Race data is sourced from the [FastF1](https://docs.fastf1.dev/) Python library, which interfaces with the official Formula 1 timing data API.

---

*Built as a personal project to combine a passion for F1 with applied statistics and Python development.*
