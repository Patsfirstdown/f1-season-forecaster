let realData;
let predictionData;
let resultsData;
let oldData;
let driverClass;
let currentGrid;
let currentBox = document.getElementById("currentGrid");
let currentSearch = "";

let wdcFirstList = {
    2025: "Lando Norris",
    2024: "Max Verstappen",
    2023: "Max Verstappen",
    2022: "Max Verstappen",
    2021: "Max Verstappen",
    2020: "Lewis Hamilton",
    2019: "Lewis Hamilton",
    2018: "Lewis Hamilton",
    2017: "Lewis Hamilton",
    2016: "Nico Rosberg",
    2015: "Lewis Hamilton",
    2014: "Lewis Hamilton",
    2013: "Sebastian Vettel",
    2012: "Sebastian Vettel",
    2011: "Sebastian Vettel",
    2010: "Sebastian Vettel",
    2009: "Jenson Button",
    2008: "Lewis Hamilton",
    2007: "Kimi Räikkönen",
    2006: "Fernando Alonso",
    2005: "Fernando Alonso",
    2004: "Michael Schumacher",
    2003: "Michael Schumacher",
    2002: "Michael Schumacher",
    2001: "Michael Schumacher",
    2000: "Michael Schumacher",
    1999: "Mika Häkkinen",
    1998: "Mika Häkkinen",
    1997: "Jacques Villeneuve",
    1996: "Damon Hill",
    1995: "Michael Schumacher",
    1994: "Michael Schumacher",
    1993: "Alain Prost",
    1992: "Nigel Mansell",
    1991: "Ayrton Senna",
    1990: "Ayrton Senna",
    1989: "Alain Prost",
    1988: "Ayrton Senna",
    1987: "Nelson Piquet",
    1986: "Alain Prost",
    1985: "Alain Prost",
    1984: "Niki Lauda",
    1983: "Nelson Piquet",
    1982: "Keke Rosberg",
    1981: "Nelson Piquet",
    1980: "Alan Jones",
    1979: "Jody Scheckter",
    1978: "Mario Andretti",
    1977: "Niki Lauda",
    1976: "James Hunt",
    1975: "Niki Lauda",
    1974: "Emerson Fittipaldi",
    1973: "Jackie Stewart",
    1972: "Emerson Fittipaldi",
    1971: "Jackie Stewart",
    1970: "Jochen Rindt",
    1969: "Jackie Stewart",
    1968: "Graham Hill",
    1967: "Denny Hulme",
    1966: "Jack Brabham",
    1965: "Jim Clark",
    1964: "John Surtees",
    1963: "Jim Clark",
    1962: "Graham Hill",
    1961: "Phil Hill",
    1960: "Jack Brabham",
    1959: "Jack Brabham",
    1958: "Mike Hawthorn",
    1957: "Juan Fangio",
    1956: "Juan Fangio",
    1955: "Juan Fangio",
    1954: "Juan Fangio",
    1953: "Alberto Ascari",
    1952: "Alberto Ascari",
    1951: "Juan Fangio",
    1950: "Nino Farina"
};
let wdcSecondList = {
    2025: "Max Verstappen",
    2024: "Lando Norris",
    2023: "Sergio Perez",
    2022: "Charles Leclerc",
    2021: "Lewis Hamilton",
    2020: "Valtteri Bottas",
    2019: "Valtteri Bottas",
    2018: "Sebastian Vettel",
    2017: "Sebastian Vettel",
    2016: "Lewis Hamilton",
    2015: "Nico Rosberg",
    2014: "Nico Rosberg",
    2013: "Fernando Alonso",
    2012: "Fernando Alonso",
    2011: "Jenson Button",
    2010: "Fernando Alonso",
    2009: "Sebastian Vettel",
    2008: "Felipe Massa",
    2007: "Lewis Hamilton",
    2006: "Michael Schumacher",
    2005: "Kimi Räikkönen",
    2004: "Rubens Barrichello",
    2003: "Kimi Räikkönen",
    2002: "Rubens Barrichello",
    2001: "David Coulthard",
    2000: "Mika Häkkinen",
    1999: "Eddie Irvine",
    1998: "Michael Schumacher",
    1997: "Michael Schumacher",
    1996: "Jacques Villeneuve",
    1995: "Damon Hill",
    1994: "Damon Hill",
    1993: "Ayrton Senna",
    1992: "Riccardo Patrese",
    1991: "Nigel Mansell",
    1990: "Alain Prost",
    1989: "Ayrton Senna",
    1988: "Alain Prost",
    1987: "Nigel Mansell",
    1986: "Nigel Mansell",
    1985: "Michele Alboreto",
    1984: "Alain Prost",
    1983: "Alain Prost",
    1982: "Didier Pironi",
    1981: "Carlos Reutemann",
    1980: "Nelson Piquet",
    1979: "Gilles Villeneuve",
    1978: "Ronnie Peterson",
    1977: "Jody Scheckter",
    1976: "Niki Lauda",
    1975: "Emerson Fittipaldi",
    1974: "Clay Regazzoni",
    1973: "Emerson Fittipaldi",
    1972: "Jackie Stewart",
    1971: "Ronnie Peterson",
    1970: "Jacky Ickx",
    1969: "Jacky Ickx",
    1968: "Jackie Stewart",
    1967: "Jack Brabham",
    1966: "John Surtees",
    1965: "Graham Hill",
    1964: "Graham Hill",
    1963: "Graham Hill",
    1962: "Jim Clark",
    1961: "Wolfgang von Trips",
    1960: "Bruce McLaren",
    1959: "Tony Brooks",
    1958: "Stirling Moss",
    1957: "Stirling Moss",
    1956: "Stirling Moss",
    1955: "Stirling Moss",
    1954: "José Froilán González",
    1953: "Juan Fangio",
    1952: "Nino Farina",
    1951: "Alberto Ascari",
    1950: "Juan Fangio"
};
let wdcThirdList = {
    2025: "Oscar Piastri",
    2024: "Charles Leclerc",
    2023: "Lewis Hamilton",
    2022: "Sergio Perez",
    2021: "Valtteri Bottas",
    2020: "Max Verstappen",
    2019: "Max Verstappen",
    2018: "Kimi Räikkönen",
    2017: "Valtteri Bottas",
    2016: "Daniel Ricciardo",
    2015: "Sebastian Vettel",
    2014: "Daniel Ricciardo",
    2013: "Mark Webber",
    2012: "Kimi Räikkönen",
    2011: "Mark Webber",
    2010: "Mark Webber",
    2009: "Rubens Barrichello",
    2008: "Kimi Räikkönen",
    2007: "Fernando Alonso",
    2006: "Felipe Massa",
    2005: "Michael Schumacher",
    2004: "Jenson Button",
    2003: "Juan Pablo Montoya",
    2002: "Juan Pablo Montoya",
    2001: "Michael Schumacher",
    2000: "David Coulthard",
    1999: "Heinz-Harald Frentzen",
    1998: "David Coulthard",
    1997: "Heinz-Harald Frentzen",
    1996: "Michael Schumacher",
    1995: "David Coulthard",
    1994: "Michael Schumacher",
    1993: "Damon Hill",
    1992: "Michael Schumacher",
    1991: "Riccardo Patrese",
    1990: "Nelson Piquet",
    1989: "Riccardo Patrese",
    1988: "Gerhard Berger",
    1987: "Ayrton Senna",
    1986: "Nelson Piquet",
    1985: "Keke Rosberg",
    1984: "Elio de Angelis",
    1983: "René Arnoux",
    1982: "John Watson",
    1981: "Alan Jones",
    1980: "Carlos Reutemann",
    1979: "Alan Jones",
    1978: "Carlos Reutemann",
    1977: "Mario Andretti",
    1976: "Jody Scheckter",
    1975: "Carlos Pace",
    1974: "Jody Scheckter",
    1973: "François Cevert",
    1972: "Denny Hulme",
    1971: "Jackie Stewart",
    1970: "Clay Regazzoni",
    1969: "Bruce McLaren",
    1968: "Denny Hulme",
    1967: "Jim Clark",
    1966: "Jackie Stewart",
    1965: "Jackie Stewart",
    1964: "Jim Clark",
    1963: "Richie Ginther",
    1962: "Bruce McLaren",
    1961: "Stirling Moss",
    1960: "Innes Ireland",
    1959: "Stirling Moss",
    1958: "Tony Brooks",
    1957: "Peter Collins",
    1956: "Peter Collins",
    1955: "Eugenio Castellotti",
    1954: "Mike Hawthorn",
    1953: "Nino Farina",
    1952: "Piero Taruffi",
    1951: "José Froilán González",
    1950: "Luigi Fagioli"
};

const scoreState = {
    currentSort: "superScore",
    ascending: false,
    scoreList: [],
    scoreKey: "",
    container: null,
    displayKey: "",
    averageYears: null,
    limit: 10
};

async function loadData() {
    const response = await fetch("data/results.json");
    const response2 = await fetch("data/predictions.json");
    const response3 = await fetch("data/oldData.json");
    realData = await response.json();
    predictionData = await response2.json();
    oldData = await response3.json();

    currentGrid = []

    Object.keys(realData["stats"]).forEach(driver => {
        currentGrid.push(realData["stats"][driver]["name"])
    });
}

function renderComparisonTable(tableElement, rows) {

    tableElement.innerHTML = "";

    const thead = document.createElement("thead")
    const thr = document.createElement("tr")
    const thd0 = document.createElement("th")
    thd0.textContent = 'Category'
    const thd1 = document.createElement("th")
    thd1.textContent = 'Driver+Car Score'
    const thd2 = document.createElement("th")
    thd2.textContent = 'Driver Score'
    const thd3 = document.createElement("th")
    thd3.textContent = 'Combined Score'

    thr.appendChild(thd0)
    thr.appendChild(thd1)
    thr.appendChild(thd2)
    thr.appendChild(thd3)
    thead.appendChild(thr)
    tableElement.appendChild(thead)

    rows.forEach((row, index) => {

        const tr = document.createElement("tr");
        tr.className = index % 2 === 0 ? "higher" : "lower";

        const columns = ["score", "better", "combined"];
        let tdh = document.createElement("td");

        tdh.textContent = row.label;
        tr.appendChild(tdh);

        columns.forEach(col => {
            const td = document.createElement("td");
            if (Object.hasOwn(row[col], "year")) {
                td.textContent =
                    `${row[col].year} ${row[col].name}: ${(row[col].value).toFixed(3)}`;
            } else {
                td.textContent =
                    `${row[col].name}: ${(row[col].value).toFixed(3)}`;
            }
            tr.appendChild(td);
        });

        tableElement.appendChild(tr);

    });

}

function updateBest() {
    let bestSeasonScoreWDC=[0,0,0];
    let bestSeasonBetterScoreWDC=[0,0,0];
    let bestSeasonCombinedScoreWDC=[0,0,0];

    let worstSeasonScoreWDC=[0,100,0];
    let worstSeasonBetterScoreWDC=[0,100,0];
    let worstSeasonCombinedScoreWDC=[0,100,0];

    Object.keys(wdcFirstList).forEach(year => {
        resultsData = oldData["Single Driver"];
        let wdcDriver=wdcFirstList[year]
        let wdc2Driver=wdcSecondList[year]
        wdcDiffScore=(resultsData[wdcDriver][year]["score"])-(resultsData[wdc2Driver][year]["score"])
        wdcDiffBetterScore=(resultsData[wdcDriver][year]["betterScore"])-(resultsData[wdc2Driver][year]["betterScore"])
        wdcDiffCombinedScore=(resultsData[wdcDriver][year]["combinedScore"])-(resultsData[wdc2Driver][year]["combinedScore"])

        if(wdcDiffScore>bestSeasonScoreWDC[1]) {
            bestSeasonScoreWDC=[wdcDriver,wdcDiffScore,year,wdc2Driver]
        } else if(wdcDiffScore<worstSeasonScoreWDC[1]) {
            worstSeasonScoreWDC=[wdcDriver,wdcDiffScore,year,wdc2Driver]
        }
        if(wdcDiffBetterScore>bestSeasonBetterScoreWDC[1]) {
            bestSeasonBetterScoreWDC=[wdcDriver,wdcDiffBetterScore,year,wdc2Driver]
        } else if(wdcDiffBetterScore<worstSeasonBetterScoreWDC[1]) {
            worstSeasonBetterScoreWDC=[wdcDriver,wdcDiffBetterScore,year,wdc2Driver]
        }
        if(wdcDiffCombinedScore>bestSeasonCombinedScoreWDC[1]) {
            bestSeasonCombinedScoreWDC=[wdcDriver,wdcDiffCombinedScore,year,wdc2Driver]
        } else if(wdcDiffCombinedScore<worstSeasonCombinedScoreWDC[1]) {
            worstSeasonCombinedScoreWDC=[wdcDriver,wdcDiffCombinedScore,year,wdc2Driver]
        }
    });
    let scoreListAvg=[];
    let scoreListSeason=[];

    let bestAvgScore=[0,0];
    let bestAvgBetterScore=[0,0];
    let bestAvgCombinedScore=[0,0];

    let worstAvgScore=[0,100];
    let worstAvgBetterScore=[0,100];
    let worstAvgCombinedScore=[0,100];

    let bestSeasonScore=[0,0,0];
    let bestSeasonBetterScore=[0,0,0];
    let bestSeasonCombinedScore=[0,0,0];

    let worstSeasonScore=[0,100,0];
    let worstSeasonBetterScore=[0,100,0];
    let worstSeasonCombinedScore=[0,100,0];

    let currentbestAvgScore=[0,0];
    let currentbestAvgBetterScore=[0,0];
    let currentbestAvgCombinedScore=[0,0];

    let currentworstAvgScore=[0,100];
    let currentworstAvgBetterScore=[0,100];
    let currentworstAvgCombinedScore=[0,100];

    let currentbestSeasonScore=[0,0,0];
    let currentbestSeasonBetterScore=[0,0,0];
    let currentbestSeasonCombinedScore=[0,0,0];

    let currentworstSeasonScore=[0,100,0];
    let currentworstSeasonBetterScore=[0,100,0];
    let currentworstSeasonCombinedScore=[0,100,0];

    Object.keys(resultsData).forEach(driver => {
        Object.keys(resultsData[driver]).forEach(year => {
            if (currentGrid.includes(driver)) {
                if(resultsData[driver][year]["score"]>currentbestSeasonScore[1]) {
                    currentbestSeasonScore=[driver,resultsData[driver][year]["score"],year]
                } else if(resultsData[driver][year]["score"]<currentworstSeasonScore[1]) {
                    currentworstSeasonScore=[driver,resultsData[driver][year]["score"],year]
                }
                if(resultsData[driver][year]["betterScore"]>currentbestSeasonBetterScore[1]) {
                    currentbestSeasonBetterScore=[driver,resultsData[driver][year]["betterScore"],year]
                } else if(resultsData[driver][year]["betterScore"]<currentworstSeasonBetterScore[1]) {
                    currentworstSeasonBetterScore=[driver,resultsData[driver][year]["betterScore"],year]
                }
                if(resultsData[driver][year]["combinedScore"]>currentbestSeasonCombinedScore[1]) {
                    currentbestSeasonCombinedScore=[driver,resultsData[driver][year]["combinedScore"],year]
                } else if(resultsData[driver][year]["combinedScore"]<currentworstSeasonCombinedScore[1]) {
                    currentworstSeasonCombinedScore=[driver,resultsData[driver][year]["combinedScore"],year]
                }
            };
            if(resultsData[driver][year]["score"]>bestSeasonScore[1]) {
                bestSeasonScore=[driver,resultsData[driver][year]["score"],year]
            } else if(resultsData[driver][year]["score"]<worstSeasonScore[1]) {
                worstSeasonScore=[driver,resultsData[driver][year]["score"],year]
            }
            if(resultsData[driver][year]["betterScore"]>bestSeasonBetterScore[1]) {
                bestSeasonBetterScore=[driver,resultsData[driver][year]["betterScore"],year]
            } else if(resultsData[driver][year]["betterScore"]<worstSeasonBetterScore[1]) {
                worstSeasonBetterScore=[driver,resultsData[driver][year]["betterScore"],year]
            }
            if(resultsData[driver][year]["combinedScore"]>bestSeasonCombinedScore[1]) {
                bestSeasonCombinedScore=[driver,resultsData[driver][year]["combinedScore"],year]
            } else if(resultsData[driver][year]["combinedScore"]<worstSeasonCombinedScore[1]) {
                worstSeasonCombinedScore=[driver,resultsData[driver][year]["combinedScore"],year]
            }
        });
    });

    resultsData = oldData["All Time"]["Driver Averages"];
    Object.keys(resultsData).forEach(driver => {
        const seasonTotal = resultsData[driver]["seasons"]
        if (currentGrid.includes(driver)) {
            if(resultsData[driver]["score"]/seasonTotal>currentbestAvgScore[1]) {
                currentbestAvgScore=[driver,resultsData[driver]["score"]/seasonTotal]
            } else if(resultsData[driver]["score"]/seasonTotal<currentworstAvgScore[1]) {
                currentworstAvgScore=[driver,resultsData[driver]["score"]/seasonTotal]
            }
            if(resultsData[driver]["betterScore"]/seasonTotal>currentbestAvgBetterScore[1]) {
                currentbestAvgBetterScore=[driver,resultsData[driver]["betterScore"]/seasonTotal]
            } else if(resultsData[driver]["betterScore"]/seasonTotal<currentworstAvgBetterScore[1]) {
                currentworstAvgBetterScore=[driver,resultsData[driver]["betterScore"]/seasonTotal]
            }
            if(resultsData[driver]["combinedScore"]/seasonTotal>currentbestAvgCombinedScore[1]) {
                currentbestAvgCombinedScore=[driver,resultsData[driver]["combinedScore"]/seasonTotal]
            } else if(resultsData[driver]["combinedScore"]/seasonTotal<currentworstAvgCombinedScore[1]) {
                currentworstAvgCombinedScore=[driver,resultsData[driver]["combinedScore"]/seasonTotal]
            }
        }
        if (seasonTotal>=2) {
            if(resultsData[driver]["score"]/seasonTotal>bestAvgScore[1]) {
                bestAvgScore=[driver,resultsData[driver]["score"]/seasonTotal]
            } else if(resultsData[driver]["score"]/seasonTotal<worstAvgScore[1]) {
                worstAvgScore=[driver,resultsData[driver]["score"]/seasonTotal]
            }
            if(resultsData[driver]["betterScore"]/seasonTotal>bestAvgBetterScore[1]) {
                bestAvgBetterScore=[driver,resultsData[driver]["betterScore"]/seasonTotal]
            } else if(resultsData[driver]["betterScore"]/seasonTotal<worstAvgBetterScore[1]) {
                worstAvgBetterScore=[driver,resultsData[driver]["betterScore"]/seasonTotal]
            }
            if(resultsData[driver]["combinedScore"]/seasonTotal>bestAvgCombinedScore[1]) {
                bestAvgCombinedScore=[driver,resultsData[driver]["combinedScore"]/seasonTotal]
            } else if(resultsData[driver]["combinedScore"]/seasonTotal<worstAvgCombinedScore[1]) {
                worstAvgCombinedScore=[driver,resultsData[driver]["combinedScore"]/seasonTotal]
            }
        }
    });


    const singleSeasonTable = [
        {
            label: "Best Single Season",
            score: { name: bestSeasonScore[0], value: bestSeasonScore[1], year: bestSeasonScore[2]},
            better: { name: bestSeasonBetterScore[0], value: bestSeasonBetterScore[1], year: bestSeasonBetterScore[2]},
            combined: { name: bestSeasonCombinedScore[0], value: bestSeasonCombinedScore[1], year: bestSeasonCombinedScore[2]}
        },
        {
            label: "Worst Single Season",
            score: { name: worstSeasonScore[0], value: worstSeasonScore[1], year: worstSeasonScore[2]},
            better: { name: worstSeasonBetterScore[0], value: worstSeasonBetterScore[1], year: worstSeasonBetterScore[2]},
            combined: { name: worstSeasonCombinedScore[0], value: worstSeasonCombinedScore[1], year: worstSeasonCombinedScore[2]}
        },
        {
            label: "Best Career Average",
            score: { name: bestAvgScore[0], value: bestAvgScore[1]},
            better: { name: bestAvgBetterScore[0], value: bestAvgBetterScore[1]},
            combined: { name: bestAvgCombinedScore[0], value: bestAvgCombinedScore[1]}
        },
        {
            label: "Worst Career Average",
            score: { name: worstAvgScore[0], value: worstAvgScore[1]},
            better: { name: worstAvgBetterScore[0], value: worstAvgBetterScore[1]},
            combined: { name: worstAvgCombinedScore[0], value: worstAvgCombinedScore[1]}
        }
    ];
    
    const wdcComparisonRows = [
        {
            label: "Best Winning Margin",
            score: { name: bestSeasonScoreWDC[0], value: bestSeasonScoreWDC[1], year: bestSeasonScoreWDC[2]},
            better: { name: bestSeasonBetterScoreWDC[0], value: bestSeasonBetterScoreWDC[1], year: bestSeasonBetterScoreWDC[2]},
            combined: { name: bestSeasonCombinedScoreWDC[0], value: bestSeasonCombinedScoreWDC[1], year: bestSeasonCombinedScoreWDC[2]},
        },
        {
            label: "Worst Winning Margin",
            score: { name: worstSeasonScoreWDC[0], value: worstSeasonScoreWDC[1], year: worstSeasonScoreWDC[2]},
            better: { name: worstSeasonBetterScoreWDC[0], value: worstSeasonBetterScoreWDC[1], year: worstSeasonBetterScoreWDC[2]},
            combined: { name: worstSeasonCombinedScoreWDC[0], value: worstSeasonCombinedScoreWDC[1], year: worstSeasonCombinedScoreWDC[2]},
        },
    ];
    const currentDriverRows = [
        {
            label: "Best Single Season",
            score: { name: currentbestSeasonScore[0], value: currentbestSeasonScore[1], year: currentbestSeasonScore[2]},
            better: { name: currentbestSeasonBetterScore[0], value: currentbestSeasonBetterScore[1], year: currentbestSeasonBetterScore[2]},
            combined: { name: currentbestSeasonCombinedScore[0], value: currentbestSeasonCombinedScore[1], year: currentbestSeasonCombinedScore[2]}
        },
        {
            label: "Worst Single Season",
            score: { name: currentworstSeasonScore[0], value: currentworstSeasonScore[1], year: currentworstSeasonScore[2]},
            better: { name: currentworstSeasonBetterScore[0], value: currentworstSeasonBetterScore[1], year: currentworstSeasonBetterScore[2]},
            combined: { name: currentworstSeasonCombinedScore[0], value: currentworstSeasonCombinedScore[1], year: currentworstSeasonCombinedScore[2]}
        },
        {
            label: "Best Career Average",
            score: { name: currentbestAvgScore[0], value: currentbestAvgScore[1]},
            better: { name: currentbestAvgBetterScore[0], value: currentbestAvgBetterScore[1]},
            combined: { name: currentbestAvgCombinedScore[0], value: currentbestAvgCombinedScore[1]}
        },
        {
            label: "Worst Career Average",
            score: { name: currentworstAvgScore[0], value: currentworstAvgScore[1]},
            better: { name: currentworstAvgBetterScore[0], value: currentworstAvgBetterScore[1]},
            combined: { name: currentworstAvgCombinedScore[0], value: currentworstAvgCombinedScore[1]}
        }
    ];


    renderComparisonTable(
        document.getElementById("seasonTable"),
        singleSeasonTable
    );

    renderComparisonTable(
        document.getElementById("wdcComparisonTable"),
        wdcComparisonRows
    );

    renderComparisonTable(
        document.getElementById("currentDriversTable"),
        currentDriverRows
    );
}

function updateAllTimeScores(limit) {
    const scoreList=[];
    let count = 0;
    let driverMaxScores={}
    
    const containerScoreList =
    document.getElementById("scoreList");
    const absLimit = Math.abs(limit)

    const containerBetterScoreList =
    document.getElementById("betterScoreList");
    
    const containerCombinedScoreList =
        document.getElementById("combinedScoreList");
    let previousMaxScore = {}
    let wdc1remove;
    let wdc2remove;
    let wdc3remove;

    let previousYear="2025";
    let lastSeason;
    let previousSuperScoreAVG;
    let previousSuperScoreSeason;
    
    resultsData = oldData["All Time"]["Driver Averages"];
    resultsSeasonData = oldData["Single Driver"];
    Object.keys(resultsData).forEach(driver => {
        wdc1remove=0
        previousSuperScoreAVG=0
        previousSuperScoreSeason=0
        wdc2remove=0
        wdc3remove=0
        const seasonTotal = resultsData[driver]["seasons"]
        driverMaxScores[driver]=[0,0]
        previousMaxScore[driver]=[0,0]
        Object.keys(resultsSeasonData[driver]).forEach(year => {
            lastSeason=year;
            if(driverMaxScores[driver][0]<resultsSeasonData[driver][year]["combinedScore"]) {
                driverMaxScores[driver][0]=resultsSeasonData[driver][year]["combinedScore"];
            }
            if(driverMaxScores[driver][1]<resultsSeasonData[driver][year]["dnfFreeCombinedScore"]) {
                driverMaxScores[driver][1]=resultsSeasonData[driver][year]["dnfFreeCombinedScore"];
            }
            if (parseInt(year)+1 in resultsSeasonData[driver]) {
                if(previousMaxScore[driver][0]<resultsSeasonData[driver][year]["combinedScore"]) {
                    previousMaxScore[driver][0]=resultsSeasonData[driver][year]["combinedScore"];
                }
                if(previousMaxScore[driver][1]<resultsSeasonData[driver][year]["dnfFreeCombinedScore"]) {
                    previousMaxScore[driver][1]=resultsSeasonData[driver][year]["dnfFreeCombinedScore"];
                }
            } else if(year===previousYear) {
                if(driver===wdcFirstList[year]) {
                    wdc1remove=1
                } else if(driver===wdcSecondList[year]) {
                    wdc2remove=1
                } else if(driver===wdcThirdList[year]) {
                    wdc3remove=1
                }
                combinedRemove=resultsSeasonData[driver][year]["combinedScore"]
                dnfFreeRemove=resultsSeasonData[driver][year]["dnfFreeCombinedScore"]
            }
        });
        if (seasonTotal>=2) {
            let wdc1Count=Object.values(wdcFirstList).filter(val => val === driver).length;
            let wdc2Count=Object.values(wdcSecondList).filter(val => val === driver).length;
            let wdc3Count=Object.values(wdcThirdList).filter(val => val === driver).length;
            let superScoreAVG=((5*wdc1Count+2*wdc2Count+wdc3Count+resultsData[driver]["combinedScore"]+resultsData[driver]["dnfFreeCombinedScore"])/2)/seasonTotal
            let superScoreSeason=(driverMaxScores[driver][0]+driverMaxScores[driver][1])/2+wdc1Count+wdc2Count/2+wdc3Count/3
            if(lastSeason===previousYear) {
                previousSuperScoreAVG=((5*(wdc1Count-wdc1remove)+resultsData[driver]["combinedScore"]+resultsData[driver]["dnfFreeCombinedScore"]-combinedRemove-dnfFreeRemove)/2)/(seasonTotal-1)
                previousSuperScoreSeason=(previousMaxScore[driver][0]+previousMaxScore[driver][1])/2+(wdc1Count-wdc1remove)+(wdc2Count-wdc2remove)/2+(wdc3Count-wdc3remove)/3
            } else {
                previousSuperScoreAVG=superScoreAVG
                previousSuperScoreSeason=superScoreSeason
            }

            scoreList.push({
                driverName: driver,
                RookieYear: resultsData[driver]["RookieYear"],
                raceCount: resultsData[driver]["races"],
                superScore: superScoreAVG+superScoreSeason,
                wdcCount: wdc1Count,
                previousSuperScore: previousSuperScoreAVG+previousSuperScoreSeason
            });
        }
    });

    const maxCurrent = Math.max(...scoreList.map(d => d.superScore));
    const maxPrevious = Math.max(...scoreList.map(d => d.previousSuperScore));

    scoreList.forEach(driver => {
        driver.superScore = driver.superScore / maxCurrent * 100;
        driver.previousSuperScore = driver.previousSuperScore / maxPrevious * 100;
    });

    scoreList
    .sort((a, b) => b.superScore - a.superScore)
    .forEach((driver, index) => {
        driver.currentRank = index + 1;
    });

    scoreList
    .sort((a, b) => b.previousSuperScore - a.previousSuperScore)
    .forEach((driver, index) => {
        driver.previousRank = index + 1;
    });

    scoreList.forEach(driver => {
        driver.rankDelta = driver.previousRank - driver.currentRank;
        driver.scoreDelta = driver.superScore - driver.previousSuperScore;
    });

    renderScoreList(scoreList, "superScore", containerScoreList, limit, Object.keys(wdcFirstList),scoreState);
}

function renderScoreList(
    scoreList,
    scoreKey,
    container,
    limit,
    averageYears = null,
    state
) {
    state.scoreList = scoreList;
    state.scoreKey = scoreKey;
    state.container = container;
    state.averageYears = averageYears;
    state.limit = limit;

    const absLimit = Math.abs(limit);

    scoreList.sort((a, b) => {
        let result;
        if (typeof a[state.currentSort] === "string") {
            result = a[state.currentSort].localeCompare(b[state.currentSort]);
        } else {
            result = a[state.currentSort] - b[state.currentSort];
        }
        return state.ascending ? result : -result;
    });

    let filteredList = scoreList;

    if (currentSearch.length >= 2) {
        filteredList = scoreList.filter(item =>
            item.driverName.toLowerCase().includes(currentSearch)
        );
    }

    container.replaceChildren();
    let count=0;
    console.log(currentBox);
    console.log(currentBox.checked)

    if(currentBox.checked) {
        filteredList.slice(0, absLimit).forEach(item => {
            if (currentGrid.includes(item.driverName)) {
                count++;
        
                const row = document.createElement("div");
                
                row.className = 'score-rowALL'; 
        
                let divisor = scoreKey === "score" ? 100 : 6;
        
                const scoreHere = Math.max(
                    0.3,
                    Math.min(1, 1 - item[scoreKey] / divisor)
                );
        
                let driverClass = `class="wdcOtherALL"`;
                active=""
        
                if (currentGrid.includes(item.driverName)) {
                    active = `style="font-style:italic;"`;
                };
        
                // Average / span of years
        
                secondPlace=false;
        
                for (const year of averageYears) {
                    if (wdcFirstList[year] === item.driverName) {
                        driverClass = `class="wdcALL"`;
                        break;
                    } else if (wdcSecondList[year] === item.driverName) {
                        driverClass = `class="wdc2ALL"`;
                        secondPlace=true;
                    } else if (wdcThirdList[year] === item.driverName && !secondPlace) {
                        driverClass = `class="wdc3ALL"`;
                    }
                }
                let rankBigger='';
                if(item.rankDelta>0) {
                    rankBigger=`<span class="delta_positive">${item.rankDelta >= 0 ? "+" : ""}${item.rankDelta}</span>`
                } else if (item.rankDelta<0) {
                    rankBigger=`<span class="delta_negative">${item.rankDelta >= 0 ? "+" : ""}${item.rankDelta}</span>`
                }
                let scoreBigger='';
                if(item.scoreDelta>0) {
                    scoreBigger=`<span class="delta_positive">${item.scoreDelta >= 0 ? "+" : ""}${item.scoreDelta.toFixed(3)}</span>`
                } else if (item.scoreDelta<0) {
                    scoreBigger=`<span class="delta_negative">${item.scoreDelta >= 0 ? "+" : ""}${item.scoreDelta.toFixed(3)}</span>`
                }
                row.innerHTML = `
                    <span ${driverClass} ${active}>
                        ${item.currentRank}
                        ${rankBigger}
                    </span>
                    <span ${driverClass} ${active}>${item.RookieYear}</span>
                    <span ${driverClass} ${active}>${item.raceCount}</span>
                    <span ${driverClass} ${active}>${item.driverName}</span>
                    <span ${driverClass} ${active}>${item.wdcCount}</span>
                    <span style="color:white;text-align:left;">
                        ${item[scoreKey].toFixed(3)}
                        ${scoreBigger}
                    </span>
                `;
        
                container.appendChild(row);
            };
        });
    } else {
        filteredList.slice(0, absLimit).forEach(item => {
            count++;
    
            const row = document.createElement("div");
            
            row.className = 'score-rowALL'; 
    
            let divisor = scoreKey === "score" ? 100 : 6;
    
            const scoreHere = Math.max(
                0.3,
                Math.min(1, 1 - item[scoreKey] / divisor)
            );
    
            let driverClass = `class="wdcOtherALL"`;
            active=""
    
            if (currentGrid.includes(item.driverName)) {
                active = `style="font-style:italic;"`;
            };
    
            // Average / span of years
    
            secondPlace=false;
    
            for (const year of averageYears) {
                if (wdcFirstList[year] === item.driverName) {
                    driverClass = `class="wdcALL"`;
                    break;
                } else if (wdcSecondList[year] === item.driverName) {
                    driverClass = `class="wdc2ALL"`;
                    secondPlace=true;
                } else if (wdcThirdList[year] === item.driverName && !secondPlace) {
                    driverClass = `class="wdc3ALL"`;
                }
            }
            let rankBigger='';
            if(item.rankDelta>0) {
                rankBigger=`<span class="delta_positive">${item.rankDelta >= 0 ? "+" : ""}${item.rankDelta}</span>`
            } else if (item.rankDelta<0) {
                rankBigger=`<span class="delta_negative">${item.rankDelta >= 0 ? "+" : ""}${item.rankDelta}</span>`
            }
            let scoreBigger='';
            if(item.scoreDelta>0) {
                scoreBigger=`<span class="delta_positive">${item.scoreDelta >= 0 ? "+" : ""}${item.scoreDelta.toFixed(3)}</span>`
            } else if (item.scoreDelta<0) {
                scoreBigger=`<span class="delta_negative">${item.scoreDelta >= 0 ? "+" : ""}${item.scoreDelta.toFixed(3)}</span>`
            }
            row.innerHTML = `
                <span ${driverClass} ${active}>
                    ${item.currentRank}
                    ${rankBigger}
                </span>
                <span ${driverClass} ${active}>${item.RookieYear}</span>
                <span ${driverClass} ${active}>${item.raceCount}</span>
                <span ${driverClass} ${active}>${item.driverName}</span>
                <span ${driverClass} ${active}>${item.wdcCount}</span>
                <span style="color:white;text-align:left;">
                    ${item[scoreKey].toFixed(3)}
                    ${scoreBigger}
                </span>
            `;
    
            container.appendChild(row);
    
        });
    }


}

function sortAndRender(sortKey, state) {
    if (state.currentSort === sortKey) {
        state.ascending = !state.ascending;
    } else {
        state.currentSort = sortKey;
        state.ascending = true;
    }

    renderScoreList(
        state.scoreList,
        state.scoreKey,
        state.container,
        state.limit,
        state.displayKey,
        state.averageYears,
        state
    );
}

async function initialize() {
    await loadData();
    console.log("LOADED")
    updateBest()
    updateAllTimeScores(1000)
}

initialize();

document.getElementById("currentGrid").addEventListener("change", () => {
    updateBest();
    updateAllTimeScores(1000);
});

const driverSearch = document.getElementById("driverSearch");

driverSearch.addEventListener("input", () => {
    currentSearch = driverSearch.value.trim().toLowerCase();

    renderScoreList(
        scoreState.scoreList,
        scoreState.scoreKey,
        scoreState.container,
        scoreState.limit,
        scoreState.averageYears,
        scoreState
    );
});