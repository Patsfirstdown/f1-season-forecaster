let realData;
let predictionData;
let resultsData;
let oldData;
let driverClass;
let driverDropdownText = document.getElementById("driverDropdownText");
let cscoreHeader = document.getElementById("combinedScoreHeader");
let bscoreHeader = document.getElementById("betterScoreHeader");
let scoreHeader = document.getElementById("scoreHeader");
const scoreState = {
    currentSort: "score",
    ascending: false,
    scoreList: [],
    scoreKey: "",
    container: null,
    displayKey: "",
    averageYears: null,
    limit: 10
};

const betterScoreState = {
    currentSort: "betterScore",
    ascending: false,
    scoreList: [],
    scoreKey: "",
    container: null,
    displayKey: "",
    averageYears: null,
    limit: 10
};

const combinedScoreState = {
    currentSort: "combinedScore",
    ascending: false,
    scoreList: [],
    scoreKey: "",
    container: null,
    displayKey: "",
    averageYears: null,
    limit: 10
};
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
    1953: "Juan Manuel Fangio",
    1952: "Giuseppe Farina",
    1951: "Alberto Ascari",
    1950: "Juan Manuel Fangio"
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

async function loadData() {
    const response = await fetch("data/results.json");
    const response2 = await fetch("data/predictions.json");
    const response3 = await fetch("data/oldData.json");
    realData = await response.json();
    predictionData = await response2.json();
    oldData = await response3.json()
}

function interpolateColor(score) {
    const start = { r: 232, g: 0, b: 45 };
    const end = { r: 255, g: 255, b: 255 };

    const r = Math.round(start.r + (end.r - start.r) * (1-score));
    const g = Math.round(start.g + (end.g - start.g) * (1-score));
    const b = Math.round(start.b + (end.b - start.b) * (1-score));

    return `rgb(${r}, ${g}, ${b})`;
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + parseInt(startAt,10));
}

function updateScoresWDC(limit,yearStart = 1, yearEnd = 3000) {
    resultsData = oldData["Years"];
    const scoreList=[];
    const absLimit=Math.abs(limit)

    Object.keys(wdcFirstList).forEach(year => {
        driver=wdcFirstList[year]
        if(year>=yearStart) {
            if(year<yearEnd) {
                if (Object.hasOwn(resultsData[year], driver)) {
                    scoreList.push({
                        driverName: driver,
                        yearHappen: year,
                        raceCount: resultsData[year][driver]["races"],
                        score: resultsData[year][driver]["score"],
                        betterScore: resultsData[year][driver]["betterScore"],
                        combinedScore: resultsData[year][driver]["combinedScore"]
                    });
                }
            }
        }
    });
    count=0

    if(limit>0) {
        scoreList.sort((a, b) => b.score - a.score);
    } else {
        scoreList.sort((b, a) => b.score - a.score);
    }

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";
    scoreList.forEach(item => {
        count++;
        if(count<=absLimit) {
            yearHappen=item.yearHappen
            
            const row = document.createElement("div");
            const scoreHere= Math.max(0.3, 1 - item.score);
            
            color=interpolateColor(scoreHere);
            
            driverClass=`class="wdc"`;
    
            row.className = "score-row";
            
            row.innerHTML = `
                <span ${driverClass};>${yearHappen}</span>
                <span ${driverClass}>${item.raceCount}</span>
                <span ${driverClass};>${item.driverName}</span>
                <span style="color:${color};">${(item.score).toFixed(3)}</span>
            `;
            container.appendChild(row);
        }
    });
    count=0

    if(limit>0) {
        scoreList.sort((a, b) => b.betterScore - a.betterScore);
    } else {
        scoreList.sort((b, a) => b.betterScore - a.betterScore);
    }

    const betterScorecontainer =
        document.getElementById("betterScoreList");

    betterScorecontainer.innerHTML = "";
    scoreList.forEach(item => {
        count++;
        if(count<=absLimit) {
            yearHappen=item.yearHappen
            
            const row = document.createElement("div");
            const scoreHere= Math.max(0.3, 1 - item.betterScore);
            
            color=interpolateColor(scoreHere);
            
            driverClass=`class="wdc"`;
    
            row.className = "score-row";
            
            row.innerHTML = `
                <span ${driverClass};>${yearHappen}</span>
                <span ${driverClass}>${item.raceCount}</span>
                <span ${driverClass};>${item.driverName}</span>
                <span style="color:${color};">${(item.betterScore).toFixed(3)}</span>
            `;
            betterScorecontainer.appendChild(row);
        }
    });
    count-0
    if(limit>0) {
        scoreList.sort((a, b) => b.combinedScore - a.combinedScore);
    } else {
        scoreList.sort((b, a) => b.combinedScore - a.combinedScore);
    }

    const combinedScorecontainer =
        document.getElementById("combinedScoreList");

    combinedScorecontainer.innerHTML = "";
    scoreList.forEach(item => {
        count++;
        if(count<=absLimit) {
            yearHappen=item.yearHappen
            
            const row = document.createElement("div");
            const scoreHere= Math.max(0.3, 1 - item.combinedScore);
            
            color=interpolateColor(scoreHere);
            
            driverClass=`class="wdc"`;
    
            row.className = "score-row";
            
            row.innerHTML = `
                <span ${driverClass};>${yearHappen}</span>
                <span ${driverClass}>${item.raceCount}</span>
                <span ${driverClass};>${item.driverName}</span>
                <span style="color:${color};">${(item.combinedScore).toFixed(3)}</span>
            `;
            combinedScorecontainer.appendChild(row);
        }
    });
}

function populateYearDropdown() {
    const yearSelect =
        document.getElementById("yearSelect");

    const years =
        Object.keys(oldData);

    years.sort((a, b) => a[1] - b[1]);

    for (const year of years) {
        if (year.includes("top")) {
            const option = document.createElement("option");
            numberHere = year.slice(-2)
            option.value = year;
            option.textContent = "Top "+numberHere+" Season Scores";
            yearSelect.appendChild(option);
        } else {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }
    const option = document.createElement("option");
    option.value = "WDCs";
    option.textContent = "WDC Scores";
    yearSelect.appendChild(option);
}

function populateDriverDropdown(year) {
    const driverSelect =
        document.getElementById("driverSelect");
    let drivers;
    driverSelect.options.length = 0;

    if(year==="Single Driver") {
        drivers =
            Object.keys(oldData["Years"]);
    } else {
        drivers =
            Object.keys(oldData[year]);
    }

    drivers.sort();
    const driverDropdownText = document.getElementById("driverDropdownText")

    for (const driver of drivers) {
        
        const option = document.createElement("option");
        option.value = driver;
        option.textContent = driver;
        driverSelect.appendChild(option);
        if (year==="Single Driver") {
            driverDropdownText.innerHTML = "Year Raced"
            driverSelect.selectedIndex = driverSelect.options.length - 1;
        } else if (year.includes("Span")) {
            driverDropdownText.innerHTML = "Span"
            driverSelect.selectedIndex = driverSelect.options.length - 1;
        } else if (year.includes("Cycle")) {
            driverDropdownText.innerHTML = "Regulation"
            driverSelect.selectedIndex = driverSelect.options.length - 1;
        } else if(year==="All Time") {
            driverDropdownText.innerHTML = "Data"
        }
    }
    if (year==="Years") {
        driverDropdownText.innerHTML = "Year"
        const option = document.createElement("option");
        option.value = "2026";
        option.textContent = "2026";
        driverSelect.appendChild(option);
        driverSelect.selectedIndex = driverSelect.options.length - 1;
    }
}

function populateExtraDropdown(span,yearSpan) {
    const extraSelect =
        document.getElementById("extraSelect");
    
    extraSelect.options.length = 0;
    const metricOptions = [];
    if (span==="Single Driver") {
        Object.keys(oldData["Years"][yearSpan]).forEach(driver => {
            metricOptions.push(driver)
        });
    } else {
        Object.keys(oldData[span][yearSpan]).forEach(keyName => {
            metricOptions.push(keyName)
        });
    } 
    for (const metric of metricOptions) {
        const option = document.createElement("option");
        option.value = metric;
        option.textContent = metric;
        extraSelect.appendChild(option);
    }
}

function updateAllTimeScores(avgOrSeason,limit) {
    const scoreList=[];
    let count = 0;
    resultsData = oldData["All Time"][avgOrSeason];
    const containerScoreList =
    document.getElementById("scoreList");
    const absLimit = Math.abs(limit)

    const containerBetterScoreList =
    document.getElementById("betterScoreList");
    
    const containerCombinedScoreList =
        document.getElementById("combinedScoreList");
    if(avgOrSeason==="Driver Averages") {
        Object.keys(resultsData).forEach(driver => {
            const seasonTotal = resultsData[driver]["seasons"]
            console.log(resultsData[driver])
            if (seasonTotal>=2) {
                scoreList.push({
                    driverName: driver,
                    yearHappen: resultsData[driver]["RookieYear"],
                    raceCount: resultsData[driver]["races"],
                    score: resultsData[driver]["score"]/seasonTotal,
                    betterScore: resultsData[driver]["betterScore"]/seasonTotal,
                    combinedScore: resultsData[driver]["combinedScore"]/seasonTotal
                });
            }
        });
    
        renderScoreList(scoreList, "score", containerScoreList, limit, "yearHappen", Object.keys(wdcFirstList),scoreState);
        renderScoreList(scoreList, "betterScore", containerBetterScoreList, limit, "yearHappen", Object.keys(wdcFirstList),betterScoreState);
        renderScoreList(scoreList, "combinedScore", containerCombinedScoreList, limit, "yearHappen", Object.keys(wdcFirstList),combinedScoreState);
    } else {
        Object.keys(resultsData).forEach(driver => {
            Object.keys(resultsData[driver]).forEach(year => {
                console.log(resultsData[driver])
                scoreList.push({
                    driverName: driver,
                    yearHappen: year,
                    raceCount: resultsData[driver][year]["races"],
                    score: resultsData[driver][year]["score"],
                    betterScore: resultsData[driver][year]["betterScore"],
                    combinedScore: resultsData[driver][year]["combinedScore"]
                })
            });
        });
        renderScoreList(scoreList, "score", containerScoreList, limit, "yearHappen",null,scoreState);
        renderScoreList(scoreList, "betterScore", containerBetterScoreList, limit, "yearHappen",null,betterScoreState);
        renderScoreList(scoreList, "combinedScore", containerCombinedScoreList, limit, "yearHappen",null,combinedScoreState);
    }
}

function updateYearScores(year,limit) {
    if(year==="2026") {
        resultsData = realData["stats"];    
    } else {
        resultsData = oldData["Years"][year];    
    }
    const absLimit = Math.abs(limit)
    console.log("UPDATING SINGLE DRIVER")
    const scoreList=[];
    let count = 0;
    const containerScoreList =
    document.getElementById("scoreList");

    const containerBetterScoreList =
    document.getElementById("betterScoreList");
    
    const containerCombinedScoreList =
    document.getElementById("combinedScoreList");


    Object.keys(resultsData).forEach(driver => {
        if(year==="2026") {
            scoreList.push({
                driverName: resultsData[driver]["name"],
                yearHappen: year,
                raceCount: resultsData[driver]["raceCount"],
                score: resultsData[driver]["score"],
                betterScore: resultsData[driver]["betterScore"],
                combinedScore: resultsData[driver]["combinedScore"]
            });
        } else {
            scoreList.push({
                driverName: driver,
                yearHappen: year,
                raceCount: resultsData[driver]["races"],
                score: resultsData[driver]["score"],
                betterScore: resultsData[driver]["betterScore"],
                combinedScore: resultsData[driver]["combinedScore"]
            });
        }
    });

    renderScoreList(scoreList, "score", containerScoreList, limit, "yearHappen",null,scoreState);
    renderScoreList(scoreList, "betterScore", containerBetterScoreList, limit, "yearHappen",null,betterScoreState);
    renderScoreList(scoreList, "combinedScore", containerCombinedScoreList, limit, "yearHappen",null,combinedScoreState);
}

function updatePartTimeScores(timeSpan,secondSpan,avgOrSeason,limit) {
    const scoreList=[];
    let count = 0;
    const containerScoreList =
    document.getElementById("scoreList");

    const absLimit = Math.abs(limit)

    const containerBetterScoreList =
    document.getElementById("betterScoreList");
    
    const containerCombinedScoreList =
        document.getElementById("combinedScoreList");

    if(avgOrSeason==="Driver Averages") {

        let minYear=parseInt(secondSpan.substring(0,5))
        console.log(minYear)
        let maxYear=parseInt(secondSpan.substring(5))
        console.log(maxYear)
        let yearLength=maxYear-minYear
        let yearRange = range(yearLength,minYear)

        resultsData = oldData[timeSpan][secondSpan][avgOrSeason];    
        Object.keys(resultsData).forEach(driver => {
            console.log(resultsData[driver])
            const seasonTotal = resultsData[driver]["seasons"]
            scoreList.push({
                driverName: driver,
                seasons: seasonTotal,
                raceCount: resultsData[driver]["races"],
                score: resultsData[driver]["score"]/seasonTotal,
                betterScore: resultsData[driver]["betterScore"]/seasonTotal,
                combinedScore: resultsData[driver]["combinedScore"]/seasonTotal
            });
        });
        renderScoreList(scoreList, "score", containerScoreList, limit, "seasons", yearRange,scoreState);
        renderScoreList(scoreList, "betterScore", containerBetterScoreList, limit, "seasons", yearRange,betterScoreState);
        renderScoreList(scoreList, "combinedScore", containerCombinedScoreList, limit, "seasons", yearRange,combinedScoreState);
    } else {
        Object.keys(resultsData).forEach(driver => {
            console.log(resultsData[driver])
            scoreList.push({
                driverName: driver,
                yearHappen: resultsData[driver]["year"],
                raceCount: resultsData[driver]["races"],
                score: resultsData[driver]["score"],
                betterScore: resultsData[driver]["betterScore"],
                combinedScore: resultsData[driver]["combinedScore"]
            });
        });
    
        renderScoreList(scoreList, "score", containerScoreList, limit, "yearHappen",null,scoreState);
        renderScoreList(scoreList, "betterScore", containerBetterScoreList, limit, "yearHappen",null,betterScoreState);
        renderScoreList(scoreList, "combinedScore", containerCombinedScoreList, limit, "yearHappen",null,combinedScoreState);
    }
}

function updateSingleDriverScores(driverInput, limit) {
    const absLimit = Math.abs(limit)
    console.log("UPDATING SINGLE DRIVER")
    const scoreList=[];
    let count = 0;
    const containerScoreList =
    document.getElementById("scoreList");

    const containerBetterScoreList =
    document.getElementById("betterScoreList");
    
    const containerCombinedScoreList =
    document.getElementById("combinedScoreList");

    console.log(oldData["Single Driver"])

    resultsData = oldData["Single Driver"][driverInput]

    Object.keys(resultsData).forEach(year => {
        scoreList.push({
            driverName: driverInput,
            yearHappen: year,
            raceCount: resultsData[year]["races"],
            score: resultsData[year]["score"],
            betterScore: resultsData[year]["betterScore"],
            combinedScore: resultsData[year]["combinedScore"]
        })
    });

    const driverHeader = document.createElement("h2")

    driverHeader.textContent = driverInput;
    driverHeader.className = "driverOther";

    let secondPlace = false;

    let minYear=Object.keys(oldData["Years"]).map(Number)[0]
    let yearLength=Object.keys(oldData["Years"]).length
    let yearRange = range(yearLength,minYear)

    for (const year of yearRange) {
        if(wdcFirstList[year]===driverInput) {
            driverHeader.className = "driverWDC1";
            break
        } else if(wdcSecondList[year]===driverInput) {
            driverHeader.className = "driverWDC2";
            secondPlace=true;
        } else if(wdcThirdList[year]===driverInput && !secondPlace) {
            driverHeader.className = "driverWDC3";
        }
    }

    driverInfo.append(driverHeader)

    renderScoreList(scoreList, "score", containerScoreList, limit, "yearHappen",null,scoreState);
    renderScoreList(scoreList, "betterScore", containerBetterScoreList, limit, "yearHappen",null,betterScoreState);
    renderScoreList(scoreList, "combinedScore", containerCombinedScoreList, limit, "yearHappen",null,combinedScoreState);
}

function updateHeaders(dropdown1,infoClass,extra) {

    console.log(dropdown1)
    console.log(infoClass)
    console.log(extra)

    if (dropdown1==="Years") {
        console.log("YEARS")
        if(infoClass==="Driver Averages") {
            scoreHeader.innerHTML="First Season"
            bscoreHeader.innerHTML="First Season"
            cscoreHeader.innerHTML="First Season"
        } else {
            scoreHeader.innerHTML="Year"
            bscoreHeader.innerHTML="Year"
            cscoreHeader.innerHTML="Year"
        }
    } else if (dropdown1.includes("Span")) {
        if(extra==="Driver Averages") {
            scoreHeader.innerHTML="Seasons"
            bscoreHeader.innerHTML="Seasons"
            cscoreHeader.innerHTML="Seasons"
        } else {
            scoreHeader.innerHTML=""
            bscoreHeader.innerHTML=""
            cscoreHeader.innerHTML=""
        }
    } else if (dropdown1.includes("Cycle")) {
        if(extra==="Driver Averages") {
            scoreHeader.innerHTML="Seasons"
            bscoreHeader.innerHTML="Seasons"
            cscoreHeader.innerHTML="Seasons"
        } else {
            scoreHeader.innerHTML=""
            bscoreHeader.innerHTML=""
            cscoreHeader.innerHTML=""
        }
    } else if (dropdown1==="Single Driver") {
        scoreHeader.innerHTML="Year"
        bscoreHeader.innerHTML="Year"
        cscoreHeader.innerHTML="Year"
    } else if (dropdown1==="WDCs") {
        scoreHeader.innerHTML="Year"
        bscoreHeader.innerHTML="Year"
        cscoreHeader.innerHTML="Year"
    } else if (dropdown1==="All Time") {
        if(infoClass==="Driver Averages") {
            scoreHeader.innerHTML="First Season"
            bscoreHeader.innerHTML="First Season"
            cscoreHeader.innerHTML="First Season"
        } else {
            scoreHeader.innerHTML="Year"
            bscoreHeader.innerHTML="Year"
            cscoreHeader.innerHTML="Year"
        }
    }
}

function randomDriver() {
    console.log("CLICK")

    driverInfo.innerHTML=""

    let extra = document.getElementById("extraSelect").value;
    let limit = 1000;

    let minYear=Object.keys(oldData["Years"]).map(Number)[0]
    let yearLength=Object.keys(oldData["Years"]).length
    let yearRange = range(yearLength,minYear)

    let yearSpan = yearRange[Math.floor(Math.random()*yearRange.length)];

    let driverInputs=Object.keys(oldData["Years"][yearSpan]);

    let driverInput = driverInputs[Math.floor(Math.random()*driverInputs.length)];

    updateSingleDriverScores(driverInput, limit)
}

function renderScoreList(
    scoreList,
    scoreKey,
    container,
    limit,
    displayKey,
    averageYears = null,
    state
) {
    state.scoreList = scoreList;
    state.scoreKey = scoreKey;
    state.container = container;
    state.displayKey = displayKey;
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

    console.log(scoreList)

    container.replaceChildren();

    scoreList.slice(0, absLimit).forEach(item => {

        const row = document.createElement("div");
        
        row.className = 'score-row'; 

        const divisor = scoreKey === "score" ? 100 : 1;
        const scoreHere = Math.max(
            0.3,
            Math.min(1, 1 - item[scoreKey] / divisor)
        );

        const color = interpolateColor(scoreHere);

        let driverClass = `class="wdcOther"`;

        if (averageYears !== null) {

            // Average / span of years

            secondPlace=false;

            for (const year of averageYears) {
                if (wdcFirstList[year] === item.driverName) {
                    driverClass = `class="wdc"`;
                    break;
                } else if (wdcSecondList[year] === item.driverName) {
                    driverClass = `class="wdc2"`;
                    secondPlace=true;
                } else if (wdcThirdList[year] === item.driverName && !secondPlace) {
                    driverClass = `class="wdc3"`;
                }
            }
            row.innerHTML = `
                <span ${driverClass}>${item[displayKey]}</span>
                <span ${driverClass}>${item.raceCount}</span>
                <span ${driverClass}>${item.driverName}</span>
                <span style="color:${color};">
                    ${item[scoreKey].toFixed(3)}
                </span>
            `;

        } else {

            // Single season
            const year = item.yearHappen;

            if (wdcFirstList[year] === item.driverName) {
                driverClass = `class="wdc"`;
            } else if (wdcSecondList[year] === item.driverName) {
                driverClass = `class="wdc2"`;
            } else if (wdcThirdList[year] === item.driverName) {
                driverClass = `class="wdc3"`;
            }
            row.className = "score-row";
    
            row.innerHTML = `
                <span ${driverClass}>${item[displayKey]}</span>
                <span ${driverClass}>${item.raceCount}</span>
                <span ${driverClass}>${item.driverName}</span>
                <span style="color:${color};">
                    ${item[scoreKey].toFixed(3)}
                </span>
            `;
        }


        container.appendChild(row);

    });

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
    const extraSelect = document.getElementById("extraDropdown");
    extraSelect.style.visibility = "collapse";

    populateYearDropdown();
    const year = document.getElementById("yearSelect").value;
    populateDriverDropdown(year);
    const secondYear = document.getElementById("driverSelect").value;
    const limit = document.getElementById("limitSelect").value;
    updateYearScores(secondYear,limit)
    updateHeaders(year,secondYear)
}

initialize();

let firstDropdown = document.getElementById("yearSelect");
let secondDropdown = document.getElementById("driverSelect");
let thirdDropdown = document.getElementById("extraSelect");
let visibleThirdDropdown = document.getElementById("extraDropdown");
let visibleSecondDropdown = document.getElementById("driverDropdown2");
let limitDropdown = document.getElementById("limitSelect");
let driverInfo = document.getElementById("driverInfo");

firstDropdown
.addEventListener("change", function() {
    //Year, 5 Year Span, 10 Year Span, Regulation Cycle, All Time
    const year = document.getElementById("yearSelect").value;
    let secondYear = document.getElementById("driverSelect").value;
    const limit = Number(document.getElementById("limitSelect").value);
    let extra = document.getElementById("extraSelect").value;

    driverInfo.innerHTML="";
    
    if(year==="Years") {
        console.log("YEARS")
        visibleSecondDropdown.style.visibility = "visible";
        populateDriverDropdown(year);
        secondYear = secondDropdown.value;
        updateYearScores(secondYear,limit)
        visibleThirdDropdown.style.visibility = "collapse";
    } else if(year==="All Time") {
        populateDriverDropdown(year);
        visibleSecondDropdown.style.visibility = "visible";
        visibleThirdDropdown.style.visibility = "collapse";
        secondYear = secondDropdown.value;
        updateAllTimeScores(secondYear,limit)
    } else if(year==="WDCs") {
        visibleSecondDropdown.style.visibility = "collapse";
        visibleThirdDropdown.style.visibility = "collapse";
        updateScoresWDC(limit)
    } else if(year==="Single Driver") {
        populateDriverDropdown(year);
        visibleSecondDropdown.style.visibility = "visible";
        visibleThirdDropdown.style.visibility = "visible";
        secondYear = secondDropdown.value;
        populateExtraDropdown(year,secondYear)
        extra = document.getElementById("extraSelect").value;
        updateSingleDriverScores(extra,limit)
    } else {
        populateDriverDropdown(year);
        visibleSecondDropdown.style.visibility = "visible";
        visibleThirdDropdown.style.visibility = "visible";
        secondYear = secondDropdown.value;
        populateExtraDropdown(year,secondYear)
        extra = document.getElementById("extraSelect").value;
        updatePartTimeScores(year,secondYear,extra,limit)
    }
    extra = document.getElementById("extraSelect").value;
    updateHeaders(year,secondYear,extra)
});

secondDropdown
.addEventListener("change", function() {
    //Drivers(All, List), WDC(if not years),
    const year = document.getElementById("yearSelect").value;
    let secondYear = document.getElementById("driverSelect").value;
    const limit = Number(document.getElementById("limitSelect").value);
    let extra = document.getElementById("extraSelect").value;

    driverInfo.innerHTML="";

    if(year==="Years") {
        updateYearScores(secondYear,limit)
    } else if(year==="All Time") {
        updateAllTimeScores(secondYear,limit)
        visibleThirdDropdown.style.visibility = "collapse";
    } else if(year==="WDCs") {
        updateScoresWDC(limit)
        visibleThirdDropdown.style.visibility = "collapse";
    } else if (year==="Single Driver") {
        secondYear = document.getElementById("driverSelect").value;
        visibleThirdDropdown.style.visibility = "visible";
        populateExtraDropdown(year,secondYear)
        extra = document.getElementById("extraSelect").value;
        updateSingleDriverScores(extra,limit)
    } else {
        populateExtraDropdown(year,secondYear)
        visibleThirdDropdown.style.visibility = "visible";
        extra = document.getElementById("extraSelect").value;
        updatePartTimeScores(year,secondYear,extra,limit)
    }
    extra = document.getElementById("extraSelect").value;
    updateHeaders(year,secondYear)
});

limitDropdown
.addEventListener("change", function() {
    //NOOOOOO
    const year = firstDropdown.value;
    let secondYear = secondDropdown.value;
    let extra = thirdDropdown.value;
    const limit = Number(document.getElementById("limitSelect").value);

    driverInfo.innerHTML="";

    if(year==="Years") {
        updateYearScores(secondYear,limit)
    } else if(year==="All Time") {
        updateAllTimeScores(secondYear,limit)
    } else if(year==="WDCs") {
        updateScoresWDC(limit)
    } else if(year==="Single Driver") {
        updateSingleDriverScores(extra,limit)
    } else {
        updatePartTimeScores(year,secondYear,extra,limit)
    }
});

thirdDropdown
.addEventListener("change", function() {
    //check driverSelect
    const year = document.getElementById("yearSelect").value;
    let secondYear = document.getElementById("driverSelect").value;
    let extra = document.getElementById("extraSelect").value;
    const limit = Number(document.getElementById("limitSelect").value);

    driverInfo.innerHTML="";

    updateHeaders(year,secondYear)
    if(year==="Single Driver") {
        updateSingleDriverScores(extra,limit)
    } else {
        updatePartTimeScores(year,secondYear,extra,limit)
    }
});

document
.getElementById("randomButton")
.addEventListener("click", function() {
    randomDriver()
});

scoreHeader.onclick = () => sortAndRender("yearHappen", scoreState);
racesHeader.onclick = () => sortAndRender("raceCount", scoreState);
driverHeader.onclick = () => sortAndRender("driverName", scoreState);
valueHeader.onclick = () => sortAndRender("score", scoreState);

betterScoreHeader.onclick = () => sortAndRender("yearHappen", betterScoreState);
betterRaceHeader.onclick = () => sortAndRender("raceCount", betterScoreState);
betterDriverHeader.onclick = () => sortAndRender("driverName", betterScoreState);
betterValueHeader.onclick = () => sortAndRender("betterScore", betterScoreState);

combinedScoreHeader.onclick = () => sortAndRender("yearHappen", combinedScoreState);
combinedRaceHeader.onclick = () => sortAndRender("raceCount", combinedScoreState);
combinedDriverHeader.onclick = () => sortAndRender("driverName", combinedScoreState);
combinedValueHeader.onclick = () => sortAndRender("combinedScore", combinedScoreState);