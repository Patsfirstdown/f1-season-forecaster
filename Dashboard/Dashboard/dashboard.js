let predictionData;
let raceProbChart;
let wccProbChart;
let wdcProbChart;
let dashVolatilityChart;
let lastLegendClick = 0;
let lastDatasetIndex = null;
let currentSort = "winProb";
let ascending = false;

const d = new Date();
let year = d.getFullYear();

const defaultLegendClick =
    Chart.defaults.plugins.legend.onClick;

async function loadData() {
    const response = await fetch("data/"+year+"/predictions.json");
    predictionData = await response.json();

}

function updateWDCChart() {
    const races = Object.keys(
        predictionData.races
    );

    const raceLabels = races.map(
        race => predictionData.races[race][1]
    );

    const firstRace = races[0];

    const driverNames = Object.keys(
        predictionData.wdc_data[firstRace]
    );

    const driverColors = predictionData.driverColor;

    const datasets = [];

    const teamCounts = {};
    driverNames.forEach(driver => {
        const teamColor = driverColors[driver];
        
        if (!(teamColor in teamCounts)) {
            teamCounts[teamColor] = 0;
        }
        const borderColor =
            teamCounts[teamColor] === 0
                ? "#FFFFFF"
                : "#000000";
        
        teamCounts[teamColor]++;

        const expectedPositions = races.map(race => {

            const driverData =
                predictionData.wdc_data[race][driver];

            return driverData
                ? driverData.expected_finish
                : null;

        });
        datasets.push({
            label: predictionData.wdc_data[firstRace][driver]["driver_name"],
            data: expectedPositions,
            borderColor: driverColors[driver],        // line color
            backgroundColor: driverColors[driver],
            pointBackgroundColor: driverColors[driver],
            pointBorderColor: borderColor,            // white/black teammate distinction
            pointBorderWidth: 2,
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 6,
            hitRadius: 10
        });

    });

    if (wdcProbChart) {
        wdcProbChart.destroy();
    }

    wdcProbChart = new Chart(
        document.getElementById("wdcChart"),
        {
            type: "line",
            data: {
                labels: raceLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                plugins: {
                    legend: {
                        onClick(e, legendItem, legend) {
                    
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                    
                            const ctrlPressed =
                                e.native.ctrlKey ||
                                e.native.metaKey;
                    
                            if (!ctrlPressed) {
                    
                                // Standard Chart.js behavior
                                defaultLegendClick(
                                    e,
                                    legendItem,
                                    legend
                                );
                    
                                return;
                            }
                    
                            const visibleCount =
                                chart.data.datasets.filter(
                                    (_, i) => chart.isDatasetVisible(i)
                                ).length;
                    
                            const isSolo =
                                visibleCount === 1 &&
                                chart.isDatasetVisible(datasetIndex);
                    
                            if (isSolo) {
                    
                                // Restore all
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(i, true);
                                });
                    
                            } else {
                    
                                // Show only selected dataset
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(
                                        i,
                                        i === datasetIndex
                                    );
                                });
                    
                            }
                    
                            chart.update();
                        }
                    }
                },
                onMouseLeave: (event, chart) => {
                  chart.setActiveElements([]);
                  chart.update();
                },
                onHover: (event, activeElements, chart) => {

                    if (activeElements.length > 0) {
            
                        const hoveredDataset =
                            activeElements[0].datasetIndex;
            
                        chart.data.datasets.forEach(
                            (dataset, index) => {
            
                                if (index === hoveredDataset) {
            
                                    dataset.borderWidth = 5;
            
                                } else {
            
                                    dataset.borderWidth = 1;
            
                                }
            
                            }
                        );
            
                    } else {
            
                        chart.data.datasets.forEach(
                            dataset => {
            
                                dataset.borderWidth = 2;
            
                            }
                        );
            
                    }
            
                    chart.update('none');
                },

                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },

                    y: {
                        reverse: true,
                        min: 1,
                        max: 22,
                        title: {
                            display: true,
                            text: "Expected Position"
                        }
                    }
                }
            }
        }
    );
}

function updateWCCChart() {
    const races =
        Object.entries(predictionData.races)
        .filter(([raceName]) =>
            predictionData.wcc_data.hasOwnProperty(raceName)
        )
        .sort((a, b) => a[1] - b[1]);


    
    const raceLabels = races.map(
        race => race[1][1]
    );

    const firstRace = races[0][0];

    const teamNames = Object.keys(
        predictionData.wcc_data[firstRace]
    );

    const teamColors = predictionData.teamColor;

    const datasets = [];

    teamNames.forEach(team => {

        const expectedPositions = races.map(race => {
            const teamData =
                predictionData.wcc_data[race[0]][team];

            return teamData
                ? teamData.expected_finish
                : null;

        });

        datasets.push({
            label: team.replaceAll("_", " "),
            data: expectedPositions,
            borderColor: teamColors[team],
            backgroundColor: teamColors[team],
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 6,
            hitRadius: 10
        });

    });

    if (wccProbChart) {
        wccProbChart.destroy();
    }

    wccProbChart = new Chart(
        document.getElementById("wccChart"),
        {
            type: "line",
            data: {
                labels: raceLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                plugins: {
                    legend: {
                        onClick(e, legendItem, legend) {
                    
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                    
                            const ctrlPressed =
                                e.native.ctrlKey ||
                                e.native.metaKey;
                    
                            if (!ctrlPressed) {
                    
                                // Standard Chart.js behavior
                                defaultLegendClick(
                                    e,
                                    legendItem,
                                    legend
                                );
                    
                                return;
                            }
                    
                            const visibleCount =
                                chart.data.datasets.filter(
                                    (_, i) => chart.isDatasetVisible(i)
                                ).length;
                    
                            const isSolo =
                                visibleCount === 1 &&
                                chart.isDatasetVisible(datasetIndex);
                    
                            if (isSolo) {
                    
                                // Restore all
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(i, true);
                                });
                    
                            } else {
                    
                                // Show only selected dataset
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(
                                        i,
                                        i === datasetIndex
                                    );
                                });
                    
                            }
                    
                            chart.update();
                        }
                    }
                },
                onMouseLeave: (event, chart) => {
                  chart.setActiveElements([]);
                  chart.update();
                },
                onHover: (event, activeElements, chart) => {

                    if (activeElements.length > 0) {
            
                        const hoveredDataset =
                            activeElements[0].datasetIndex;
            
                        chart.data.datasets.forEach(
                            (dataset, index) => {
            
                                if (index === hoveredDataset) {
            
                                    dataset.borderWidth = 5;
            
                                } else {
            
                                    dataset.borderWidth = 1;
            
                                }
            
                            }
                        );
            
                    } else {
            
                        chart.data.datasets.forEach(
                            dataset => {
            
                                dataset.borderWidth = 2;
            
                            }
                        );
            
                    }
            
                    chart.update('none');
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },

                    y: {
                        reverse: true,
                        min: 1,
                        max: 11,
                        title: {
                            display: true,
                            text: "Expected Position"
                        }
                    }
                }
            }
        }
    );
}

function updateDriverChart() {
    const races = Object.keys(
        predictionData.races
    );

    const raceLabels = races.map(
        race => predictionData.races[race][1]
    );

    const firstRace = races[0];

    const driverNames = Object.keys(
        predictionData.race_data[firstRace]
    );

    const driverColors = predictionData.driverColor;

    const datasets = [];

    const teamCounts = {};
    driverNames.forEach(driver => {
        const teamColor = driverColors[driver];
        
        if (!(teamColor in teamCounts)) {
            teamCounts[teamColor] = 0;
        }
        const borderColor =
            teamCounts[teamColor] === 0
                ? "#FFFFFF"
                : "#000000";
        
        teamCounts[teamColor]++;

        const expectedPositions = races.map(race => {

            const driverData =
                predictionData.race_data[race][driver];

            return driverData
                ? driverData.expected_finish
                : null;

        });

        datasets.push({
            label: predictionData.wdc_data[firstRace][driver]["driver_name"],
            data: expectedPositions,
            borderColor: driverColors[driver],        // line color
            backgroundColor: driverColors[driver],
            pointBackgroundColor: driverColors[driver],
            pointBorderColor: borderColor,            // white/black teammate distinction
            pointBorderWidth: 2,
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 6,
            hitRadius: 10
        });

    });

    if (raceProbChart) {
        raceProbChart.destroy();
    }

    raceProbChart = new Chart(
        document.getElementById("raceChart"),
        {
            type: "line",
            data: {
                labels: raceLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                plugins: {
                    legend: {
                        onClick(e, legendItem, legend) {
                    
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                    
                            const ctrlPressed =
                                e.native.ctrlKey ||
                                e.native.metaKey;
                    
                            if (!ctrlPressed) {
                    
                                // Standard Chart.js behavior
                                defaultLegendClick(
                                    e,
                                    legendItem,
                                    legend
                                );
                    
                                return;
                            }
                    
                            const visibleCount =
                                chart.data.datasets.filter(
                                    (_, i) => chart.isDatasetVisible(i)
                                ).length;
                    
                            const isSolo =
                                visibleCount === 1 &&
                                chart.isDatasetVisible(datasetIndex);
                    
                            if (isSolo) {
                    
                                // Restore all
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(i, true);
                                });
                    
                            } else {
                    
                                // Show only selected dataset
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(
                                        i,
                                        i === datasetIndex
                                    );
                                });
                    
                            }
                    
                            chart.update();
                        }
                    }
                },
                onMouseLeave: (event, chart) => {
                  chart.setActiveElements([]);
                  chart.update();
                },
                onHover: (event, activeElements, chart) => {

                    if (activeElements.length > 0) {
            
                        const hoveredDataset =
                            activeElements[0].datasetIndex;
            
                        chart.data.datasets.forEach(
                            (dataset, index) => {
            
                                if (index === hoveredDataset) {
            
                                    dataset.borderWidth = 5;
            
                                } else {
            
                                    dataset.borderWidth = 1;
            
                                }
            
                            }
                        );
            
                    } else {
            
                        chart.data.datasets.forEach(
                            dataset => {
            
                                dataset.borderWidth = 1;
            
                            }
                        );
            
                    }
            
                    chart.update('none');
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },

                    y: {
                        reverse: true,
                        min: 1,
                        max: 22,
                        title: {
                            display: true,
                            text: "Expected Position"
                        }
                    }
                }
            }
        }
    );
}

function updateVolatilityChart() {

    const races = Object.keys(
        predictionData.races
    );

    const firstRace = races[0];

    const driverNames = Object.keys(
        predictionData.race_data[firstRace]
    );
    

    const driverColors = predictionData.driverColor;

    const datasets = [];

    const teamCounts = {};
    driverNames.forEach(driver => {
        const teamColor = driverColors[driver];
        
        if (!(teamColor in teamCounts)) {
            teamCounts[teamColor] = 0;
        }
        const borderColor =
            teamCounts[teamColor] === 0
                ? "#FFFFFF"
                : "#000000";
        
        teamCounts[teamColor]++;
    
        const points = races.map(race => {
    
            const driverData =
                predictionData.race_data[race][driver];
    
            if (!driverData) {
                return null;
            }
    
            return {
                x: driverData.expected_finish,
                y: driverData.position_std,
                driver: driverData.driver_name,
                race: predictionData.races[race][1],
            };
        }).filter(point => point !== null);
    
        datasets.push({
            label: predictionData.race_data[firstRace][driver]["driver_name"],
            data: points,
            backgroundColor: driverColors[driver],
            borderColor: borderColor,
            borderWidth: 1,
            pointRadius: 6,
            pointHoverRadius: 8
        });
    });

    const ctx =
        document.getElementById("dash-expected-scatter").getContext("2d");

    if (dashVolatilityChart) {
        dashVolatilityChart.destroy();
    }

    dashVolatilityChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets
        },
        options: {
            responsive: true,
            devicePixelRatio: 2,
            maintainAspectRatio: false,

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Expected Finish"
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Position Volatility"
                    }
                }
            },

            onHover: (event, activeElements, chart) => {

                if (activeElements.length > 0) {
        
                    const hoveredDataset =
                        activeElements[0].datasetIndex;
        
                    chart.data.datasets.forEach(
                        (dataset, index) => {
        
                            if (index === hoveredDataset) {
        
                                dataset.borderWidth = 5;
        
                            } else {
        
                                dataset.borderWidth = 1;
        
                            }
        
                        }
                    );
        
                } else {
        
                    chart.data.datasets.forEach(
                        dataset => {
        
                            dataset.borderWidth = 1;
        
                        }
                    );
        
                }
        
                chart.update('none');
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const point = context[0].raw;
                            return `${point.driver} - ${point.race}`;
                        },
                
                        label: function(context) {
                            const point = context.raw;
                
                            return [
                                `Expected Finish: ${point.x.toFixed(2)}`,
                                `Volatility: ${point.y.toFixed(2)}`
                            ];
                        }
                    }
                },
                legend: {
                        onClick(e, legendItem, legend) {
                    
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                    
                            const ctrlPressed =
                                e.native.ctrlKey ||
                                e.native.metaKey;
                    
                            if (!ctrlPressed) {
                    
                                // Standard Chart.js behavior
                                defaultLegendClick(
                                    e,
                                    legendItem,
                                    legend
                                );
                    
                                return;
                            }
                    
                            const visibleCount =
                                chart.data.datasets.filter(
                                    (_, i) => chart.isDatasetVisible(i)
                                ).length;
                    
                            const isSolo =
                                visibleCount === 1 &&
                                chart.isDatasetVisible(datasetIndex);
                    
                            if (isSolo) {
                    
                                // Restore all
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(i, true);
                                });
                    
                            } else {
                    
                                // Show only selected dataset
                                chart.data.datasets.forEach((_, i) => {
                                    chart.setDatasetVisibility(
                                        i,
                                        i === datasetIndex
                                    );
                                });
                    
                            }
                    
                            chart.update();
                        }
                    }
            }
        }
    });
}

function normalizeWDC(driver_team) {
    const out = {};

    for (const [key, data] of Object.entries(driver_team)) {
        out[key] = {
            exp: Number(data?.expected_finish),
            winProb: Number(data?.win_probability),
            name: data?.driver_name ?? key
        };
    }

    return out;
}

function normalizeWCC(team_data) {
    const out = {};

    for (const [key, data] of Object.entries(team_data)) {
        out[key] = {
            exp: Number(data?.expected_finish),
            winProb: Number(data?.win_probability),
            name: key
        };
    }

    return out;
}

function createSorted(current, old, metric, higherIsBetter = true) {
    const diff = {};

    for (const key in current) {
        const currVal = current?.[key]?.[metric];
        const oldVal = old?.[key]?.[metric];
        if (!Number.isFinite(currVal) || !Number.isFinite(oldVal)) continue;
        if(metric==="exp") {
            diff[key] = {
                name: current[key].name,
                value: oldVal - currVal
            };
        } else {
            diff[key] = {
                name: current[key].name,
                value:  currVal - oldVal
            };
        }
    }

    return Object.entries(diff)
        .sort((a, b) => b[1].value - a[1].value);
}

function updateUpdates() {
    const races = Object.keys(
        predictionData.races
    );

    let seasonWCC1big=["race","driver",0];
    let seasonWCCAllbig=["race","driver",0];
    let seasonWDC1big=["race","driver",0];
    let seasonWDCAllbig=["race","driver",0];

    let seasonWCC1small=["race","driver",0];
    let seasonWCCAllsmall=["race","driver",0];
    let seasonWDC1small=["race","driver",0];
    let seasonWDCAllsmall=["race","driver",0];
    
    const previousRace = races[races.length - 2];
    const driverNames = Object.keys(
        predictionData.race_data[previousRace]
    );
    const upcomingRace = races[races.length-1];
    
    const driverColors = predictionData.driverColor;

    let currentWCC;
    let currentWDC;

    let oldtempWDC;
    let oldtempWCC;

    let sortedWCC;
    let sortedWDC;

    let teamCount=0;
    let driverCount=0;
    let firstCRace;
    let firstDRace;

    let firmTeams=[];
    let firmDrivers=[];
    
    for (racename of races) {
        oldtempWDC=currentWDC;
        oldtempWCC=currentWCC;
        if (Object.hasOwn(predictionData.wcc_data, racename)) {
            if (teamCount<1) {
                firstCRace=racename;
            }
            teamCount++;
            currentWCC = normalizeWCC(predictionData.wcc_data[racename]);
            if(!oldtempWCC) {
                //skip
            }
            else {
                sortedWCCAll = createSorted(currentWCC,oldtempWCC,"exp")
                sortedWCC1 = createSorted(currentWCC,oldtempWCC,"winProb")

                if(sortedWCC1[0][1].value>seasonWCC1big[2]) {
                    seasonWCC1big=[racename,sortedWCC1[0][1].name,sortedWCC1[0][1].value]
                }
                if(sortedWCCAll[0][1].value>seasonWCCAllbig[2]) {
                    seasonWCCAllbig=[racename,sortedWCCAll[0][1].name,sortedWCCAll[0][1].value]
                }
                if(sortedWCC1.at(-1)[1].value<seasonWCC1small[2]) {
                    seasonWCC1small=[racename,sortedWCC1.at(-1)[1].name,sortedWCC1.at(-1)[1].value]
                }
                if(sortedWCCAll.at(-1)[1].value<seasonWCCAllsmall[2]) {
                    seasonWCCAllsmall=[racename,sortedWCCAll.at(-1)[1].name,sortedWCCAll.at(-1)[1].value]
                }
            }
        }
        if (Object.hasOwn(predictionData.wdc_data, racename)) {
            if (driverCount<1) {
                firstDRace=racename;
            }
            driverCount++;
            currentWDC = normalizeWDC(predictionData.wdc_data[racename]);
            if(!oldtempWDC) {
                //skip
            }
            else {
                sortedWDCAll = createSorted(currentWDC,oldtempWDC,"exp")
                sortedWDC1 = createSorted(currentWDC,oldtempWDC,"winProb")
    
                if(sortedWDC1[0][1].value>seasonWDC1big[2]) {
                    seasonWDC1big=[racename,sortedWDC1[0][1].name,sortedWDC1[0][1].value]
                };
                if(sortedWDCAll[0][1].value>seasonWDCAllbig[2]) {
                    seasonWDCAllbig=[racename,sortedWDCAll[0][1].name,sortedWDCAll[0][1].value]
                };
                if(sortedWDC1.at(-1)[1].value<seasonWDC1small[2]) {
                    seasonWDC1small=[racename,sortedWDC1.at(-1)[1].name,sortedWDC1.at(-1)[1].value]
                };
                if(sortedWDCAll.at(-1)[1].value<seasonWDCAllsmall[2]) {
                    seasonWDCAllsmall=[racename,sortedWDCAll.at(-1)[1].name,sortedWDCAll.at(-1)[1].value]
                };
            }
        };

    };

    Object.keys(currentWCC).forEach(team => {
        Object.keys(predictionData.wcc_data[upcomingRace][team]).forEach(pos => {
            if(!pos.includes("_")) {
                if(!pos.includes("avg")){
                    if(predictionData.wcc_data[upcomingRace][team][pos]["count"]>=.8) {
                        firmTeams.push({
                            "Team":team,
                            "Pos":pos,
                            "Odds":predictionData.wcc_data[upcomingRace][team][pos]["count"]
                        })
                    }
                }
            }
        })
    });
    
    Object.keys(currentWDC).forEach(driver => {
        Object.keys(predictionData.wdc_data[upcomingRace][driver]).forEach(pos => {
            if(!pos.includes("_")) {
                if(!pos.includes("avgPoints")){
                    if(predictionData.wdc_data[upcomingRace][driver][pos]["count"]>=.8) {
                        if(predictionData.wdc_data[previousRace][driver][pos]["count"]>=.8) {
                            firmDrivers.push({
                                "Driver":predictionData.wdc_data[upcomingRace][driver]["driver_name"],
                                "Pos":pos,
                                "Odds":predictionData.wdc_data[upcomingRace][driver][pos]["count"]
                            })
                        } else {
                            firmDrivers.push({
                                "Driver":"*"+predictionData.wdc_data[upcomingRace][driver]["driver_name"],
                                "Pos":pos,
                                "Odds":predictionData.wdc_data[upcomingRace][driver][pos]["count"]
                            })
                        }
                    }
                }
            }
        })
    });

    firmPlaces=document.getElementById("firmPlaces");

    const positions = {};

    firmDrivers.forEach(entry => {
        if (!positions[entry.Pos]) {
            positions[entry.Pos] = {
                driver: "",
                team: ""
            };
        }
        positions[entry.Pos].driver = entry.Driver;
        positions[entry.Pos].driverOdds = entry.Odds;
    });

    firmTeams.forEach(entry => {
        if (!positions[entry.Pos]) {
            positions[entry.Pos] = {
                driver: "",
                team: ""
            };
        }
        positions[entry.Pos].team = entry.Team;
        positions[entry.Pos].teamOdds = entry.Odds;
    });

    const sortedPositions = Object.keys(positions)
        .map(Number)
        .sort((a, b) => a - b);

    const table = document.createElement("table");
    table.className = "firm-table";

    const header = table.insertRow();
    ["Pos", "Driver", "Team"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        header.appendChild(th);
    });

    sortedPositions.forEach(pos => {
        const row = table.insertRow();
        const posCell = row.insertCell();
        posCell.textContent = pos ?? "";
        if (positions[pos].driverOdds === 1) {
            if (pos<=11) {
                if (positions[pos].teamOdds === 1) {
                    rowCell.classList.add("locked");
                }
            } else {
                rowCell.classList.add("locked");
            }
        }
        const driverCell = row.insertCell();
        driverCell.textContent = positions[pos].driver ?? "";
        if (positions[pos].driverOdds === 1) {
            driverCell.classList.add("locked");
        } else if (positions[pos].driverOdds >= .99) {
            driverCell.classList.add("locked99");
        } else if (positions[pos].driverOdds >= .9) {
            driverCell.classList.add("locked9");
        } else if (positions[pos].driverOdds >= .8) {
            driverCell.classList.add("locked8");
        } else if (positions[pos].driverOdds >= .7) {
            driverCell.classList.add("locked7");
        }
        const teamCell = row.insertCell();
        teamCell.textContent = positions[pos].team ?? "";

        if (positions[pos].teamOdds === 1) {
            teamCell.classList.add("locked");
        } else if (positions[pos].teamOdds >= .99) {
            teamCell.classList.add("locked99");
        } else if (positions[pos].teamOdds >= .9) {
            teamCell.classList.add("locked9");
        } else if (positions[pos].teamOdds >= .8) {
            teamCell.classList.add("locked8");
        } else if (positions[pos].teamOdds >= .7) {
            teamCell.classList.add("locked7");
        }
    });

    firmPlaces.replaceChildren(table);
}

function updateFullTable(selectedRace) {

    const races = Object.keys(
        predictionData.races
    );

    console.log(races)
    
    const upcomingRace = races[races.length-1];
    console.log(upcomingRace)
    const raceData = predictionData.race_data[upcomingRace];

    let title=document.getElementById("finishOrderTitle")

    title.innerHTML=`${predictionData.races[upcomingRace][1]} Race Forecast`

    const driverList = [];

    Object.keys(raceData).forEach(driver => {

        driverList.push({
            driver: raceData[driver].driver_name,
            expFinish: raceData[driver].expected_finish,
            dnfProb: raceData[driver].dnf_probability,
            winProb: raceData[driver][1]
        });

    });

    buildDriverTable(driverList);
}

function buildDriverTable(driverList) {
    let index=0;
    if(ascending) {
        index=23;
    } else {
        index=0;
    }
    driverList.sort((a, b) => {

        let result;

        if (typeof a[currentSort] === "string") {
            result = a[currentSort].localeCompare(b[currentSort]);
        } else {
            result = a[currentSort] - b[currentSort];
        }

        return ascending ? result : -result;
    });

    const container = document.getElementById("finishOrder");

    const table = document.createElement("table");
    table.className = "firm-table";

    const header = table.insertRow();

    const columns = [
        ["driver", "Driver"],
        ["expFinish", "Expected Finish"],
        ["dnfProb", "DNF %"],
        ["winProb","Win Chance"]
    ];
    const th1 = document.createElement("th");
    th1.textContent = "Place";
    header.appendChild(th1);

    columns.forEach(([key, label]) => {

        const th = document.createElement("th");
        th.textContent = label;

        if (currentSort === key) {
            th.textContent += ascending ? " ▲" : " ▼";
        }

        th.style.cursor = "pointer";

        th.onclick = () => {

            if (currentSort === key) {
                ascending = !ascending;
            } else {
                currentSort = key;
                ascending = true;
            }

            buildDriverTable(driverList);
        };
        header.appendChild(th);
    });

    driverList.forEach(driver => {

        const row = table.insertRow();
        if(ascending) {
            index--;
            row.insertCell().textContent = index;
        } else {
            index++;
            row.insertCell().textContent = index;
        }
        row.insertCell().textContent = driver.driver;
        row.insertCell().textContent = driver.expFinish.toFixed(2);
        row.insertCell().textContent = (driver.dnfProb * 100).toFixed(1) + "%";

        if (driver.score === 0) {
            scoreCell.classList.add("noChance");
        }
        const winCell = row.insertCell();
        winCell.textContent = (driver.winProb*100).toFixed(2) + "%";

        if (driver.winProb === 0) {
            winCell.classList.add("noChance");
        }

    });

    container.replaceChildren(table);
}







async function initialize() {

    await loadData();

    const races = Object.keys(
        predictionData.races
    );

    const nextRace=races[races.length-2];

    updateFullTable(nextRace)

    updateUpdates();
    updateDriverChart();
    updateWDCChart();
    updateWCCChart();
    updateVolatilityChart();
}

initialize();