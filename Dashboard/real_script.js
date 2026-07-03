let realData;
let predictionData;
let resultsData;
let oldData;
let driverClass;
let driverDropdownText = document.getElementById("driverDropdownText")
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
    2010: "Sebastian Vettel"
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
    2010: "Fernando Alonso"
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
    2010: "Mark Webber"
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

function updateDriverBetterScore(yearInput,driverInput) {
    resultsData = oldData[yearInput][driverInput];

    const betterList = [];
    Object.keys(resultsData).forEach(dataPoint => {
        betterList.push({
            driverName: driverInput,
            yearHappen: dataPoint,
            probability: resultsData[dataPoint].betterScore
        });
    });

    const warning=document.getElementById("yearWarning");
    warning.innerHTML = '';

    betterList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("betterScoreList");

    container.innerHTML = "";

    betterList.forEach(item => {

        yearHappen=item.yearHappen

        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);

        color=interpolateColor(scoreHere);

        driverClass=`class="wdcOther"`;

        if(wdcFirstList[yearHappen]===item.driverName) {
            driverClass=`class="wdc"`;
        } else if(wdcSecondList[yearHappen]===item.driverName) {
            driverClass=`class="wdc2"`;
        } else if(wdcThirdList[yearHappen]===item.driverName) {
            driverClass=`class="wdc3"`;
        }

        row.className = "score-row";
        
        row.innerHTML = `
            <span ${driverClass};>${yearHappen}</span>
            <span ${driverClass};>${item.driverName}</span>
            <span style="color:${color};">${(item.probability).toFixed(3)}</span>
        `;
        container.appendChild(row);

    });
}

function updateDriverScore(yearInput,driverInput) {
    resultsData = oldData[yearInput][driverInput];
    const scoreList = [];
    Object.keys(resultsData).forEach(driver => {
        scoreList.push({
            driverName: driverInput,
            yearHappen: driver,
            probability: resultsData[driver].score
        });
    });

    const warning=document.getElementById("yearWarning");
    warning.innerHTML = '';

    scoreList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {

        yearHappen=item.yearHappen

        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);

        color=interpolateColor(scoreHere);

        driverClass=`class="wdcOther"`;
        console.log(wdcFirstList[yearHappen])
        console.log(item.driverName)
        if(wdcFirstList[yearHappen]===item.driverName) {
            driverClass=`class="wdc"`;
        } else if(wdcSecondList[yearHappen]===item.driverName) {
            driverClass=`class="wdc2"`;
        } else if(wdcThirdList[yearHappen]===item.driverName) {
            driverClass=`class="wdc3"`;
        }

        row.className = "score-row";
        
        row.innerHTML = `
            <span ${driverClass};>${yearHappen}</span>
            <span ${driverClass};>${item.driverName}</span>
            <span style="color:${color};">${(item.probability*100).toFixed(3)}</span>
        `;
        container.appendChild(row);

    });
}

function updateBetterScoreYears(yearInput,driverInput) {
    if (driverInput==="2026") {
        resultsData = realData["stats"];
    } else {
        resultsData = oldData[yearInput][driverInput];
    }

    const scoreList = [];
    Object.keys(resultsData).forEach(driver => {

        scoreList.push({
            driverName: resultsData[driver]["name"],
            yearHappen: driverInput,
            probability: resultsData[driver]["betterScore"]
        });
    });

    const warning=document.getElementById("yearWarning");
    warning.innerHTML = '';

    scoreList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("betterScoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {
        
        yearHappen=item.yearHappen
        
        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);
        
        color=interpolateColor(scoreHere);
        
        driverClass=`class="wdcOther"`;
        
        if(wdcFirstList[yearHappen]===item.driverName) {
            driverClass=`class="wdc"`;
        } else if(wdcSecondList[yearHappen]===item.driverName) {
            driverClass=`class="wdc2"`;
        } else if(wdcThirdList[yearHappen]===item.driverName) {
            driverClass=`class="wdc3"`;
        }

        row.className = "score-row";
        
        row.innerHTML = `
            <span ${driverClass};>${yearHappen}</span>
            <span ${driverClass};>${item.driverName}</span>
            <span style="color:${color};">${(item.probability).toFixed(3)}</span>
        `;
        container.appendChild(row);

    });
}

function updateScoreYears(yearInput,driverInput) {
    if (driverInput==="2026") {
        resultsData = realData["stats"];
    } else {
        resultsData = oldData[yearInput][driverInput];
    }

    const scoreList = [];

    Object.keys(resultsData).forEach(driver => {

        scoreList.push({
            driverName: resultsData[driver]["name"],
            yearHappen: driverInput,
            probability: resultsData[driver]["score"]
        });
    });

    const warning=document.getElementById("yearWarning");
    warning.innerHTML = '';

    scoreList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {
        
        yearHappen=item.yearHappen
        
        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);
        
        color=interpolateColor(scoreHere);
        
        driverClass=`class="wdcOther"`;
        
        if(wdcFirstList[yearHappen]===item.driverName) {
            driverClass=`class="wdc"`;
        } else if(wdcSecondList[yearHappen]===item.driverName) {
            driverClass=`class="wdc2"`;
        } else if(wdcThirdList[yearHappen]===item.driverName) {
            driverClass=`class="wdc3"`;
        }

        row.className = "score-row";
        
        row.innerHTML = `
            <span ${driverClass};>${yearHappen}</span>
            <span ${driverClass};>${item.driverName}</span>
            <span style="color:${color};">${(item.probability*100).toFixed(3)}</span>
        `;
        container.appendChild(row);

    });
}

function updateBetterScoreRank10(yearInput,driverInput) {
    resultsData = oldData[yearInput][driverInput]["betterScores"];

    const scoreList = [];
    Object.keys(resultsData).forEach(driver => {
        scoreList.push({
            driverName: resultsData[driver]["driver"],
            yearHappen: resultsData[driver]["year"],
            probability: resultsData[driver]["score"]
        });
    });

    const warning=document.getElementById("yearWarning");
    warning.innerHTML = '';

    if(yearInput==="Bottom x Drivers"){
        scoreList.sort((b, a) => b.probability - a.probability);
    } else {
        scoreList.sort((a, b) => b.probability - a.probability);
    }

    const container =
        document.getElementById("betterScoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {
        
        yearHappen=item.yearHappen
        
        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);
        
        color=interpolateColor(scoreHere);
        
        driverClass=`class="wdcOther"`;
        
        if(wdcFirstList[yearHappen]===item.driverName) {
            driverClass=`class="wdc"`;
        } else if(wdcSecondList[yearHappen]===item.driverName) {
            driverClass=`class="wdc2"`;
        } else if(wdcThirdList[yearHappen]===item.driverName) {
            driverClass=`class="wdc3"`;
        }

        row.className = "score-row";
        
        row.innerHTML = `
            <span ${driverClass};>${yearHappen}</span>
            <span ${driverClass};>${item.driverName}</span>
            <span style="color:${color};">${(item.probability).toFixed(3)}</span>
        `;
        container.appendChild(row);

    });
}

function updateScoreRank10(yearInput,driverInput) {
    resultsData = oldData[yearInput][driverInput]["scores"];

    const scoreList = [];

    Object.keys(resultsData).forEach(driver => {
        scoreList.push({
            driverName: resultsData[driver]["driver"],
            yearHappen: resultsData[driver]["year"],
            probability: resultsData[driver]["score"]
        });
    });

    const warning=document.getElementById("yearWarning");
    warning.innerHTML = '';
    if(yearInput==="Bottom x Drivers"){
        scoreList.sort((b, a) => b.probability - a.probability);
    } else {
        scoreList.sort((a, b) => b.probability - a.probability);
    }

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {
        
        yearHappen=item.yearHappen
        
        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);
        
        color=interpolateColor(scoreHere);
        
        driverClass=`class="wdcOther"`;
        
        if(wdcFirstList[yearHappen]===item.driverName) {
            driverClass=`class="wdc"`;
        } else if(wdcSecondList[yearHappen]===item.driverName) {
            driverClass=`class="wdc2"`;
        } else if(wdcThirdList[yearHappen]===item.driverName) {
            driverClass=`class="wdc3"`;
        }

        row.className = "score-row";
        
        row.innerHTML = `
            <span ${driverClass};>${yearHappen}</span>
            <span ${driverClass};>${item.driverName}</span>
            <span style="color:${color};">${(item.probability).toFixed(3)}</span>
        `;
        container.appendChild(row);

    });
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + parseInt(startAt,10));
}

function updateBetterScoreYearSpan(yearInput,driverInput,metricInput) {
    let maxSeasons = 0;
    let firstYear = driverInput.slice(0,4)
    let lastYear = driverInput.slice(-4)

    season_year_range=lastYear-firstYear+1

    seasonYears=range(season_year_range,firstYear)
    if(metricInput != "Driver Average") {
        resultsData = oldData[yearInput][driverInput][metricInput]["betterScores"];
    } else {
        resultsData = oldData[yearInput][driverInput][metricInput];
    }

    const scoreList = [];
    if(metricInput != "Driver Average") {
        Object.keys(resultsData).forEach(driver => {
            scoreList.push({
                driverName: resultsData[driver]["driver"],
                yearHappen: resultsData[driver]["year"],
                probability: resultsData[driver]["score"]
            });
        });
    } else {
        Object.keys(resultsData).forEach(driver => {
            if (resultsData[driver]["score"]["SeasonCount"]>maxSeasons) {
                maxSeasons=resultsData[driver]["score"]["SeasonCount"]
            };
            scoreList.push({
                driverName: driver,
                yearHappen: resultsData[driver]["year"],
                score: resultsData[driver]["betterScore"]["TotalScore"],
                seasons: resultsData[driver]["score"]["SeasonCount"]
            });
        });
    }

    const warning=document.getElementById("yearWarning");
    warning.innerHTML = '';

    if(yearInput==="Bottom x Drivers"){
        scoreList.sort((b, a) => b.probability - a.probability);
    } else if (metricInput === "Driver Average") {
        scoreList.sort((a,b) => b.score/b.seasons - a.score/a.seasons)
    } else {
    scoreList.sort((a, b) => b.probability - a.probability);
    }

    const container =
        document.getElementById("betterScoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {
        
        yearHappen=item.yearHappen
        
        const scoreHere= Math.max(0.3, 1 - item.probability);
        
        color=interpolateColor(scoreHere);
        
        driverClass=`class="wdcOther"`;
        
        
        if(metricInput != "Driver Average") {
            const row = document.createElement("div");
            row.className = "score-row";
            if(wdcFirstList[yearHappen]===item.driverName) {
                driverClass=`class="wdc"`;
            } else if(wdcSecondList[yearHappen]===item.driverName) {
                driverClass=`class="wdc2"`;
            } else if(wdcThirdList[yearHappen]===item.driverName) {
                driverClass=`class="wdc3"`;
            }
            row.innerHTML = `
                <span ${driverClass};>${yearHappen}</span>
                <span ${driverClass};>${item.driverName}</span>
                <span style="color:${color};">${(item.probability*100).toFixed(3)}</span>
            `;
            container.appendChild(row);
        }  else {
            if (item.seasons>=Math.floor(maxSeasons/2)) {
                for (const yearOfyears of seasonYears) {
                    if(item.driverName === wdcFirstList[yearOfyears]) {
                        driverClass=`class="wdc"`
                    }
                }
                const row = document.createElement("div");
                row.className = "score-row";
                row.innerHTML = `
                    <span ${driverClass};>${item.driverName}</span>
                    <span style="color:${color};">${(item.score/item.seasons).toFixed(3)}</span>
                `;
                container.appendChild(row);
            }
        }
    });
}

function updateScoreYearSpan(yearInput,driverInput,metricInput) {
    let maxSeasons = 0;
    let firstYear = driverInput.slice(0,4)
    let lastYear = driverInput.slice(-4)

    season_year_range=lastYear-firstYear+1

    seasonYears=range(season_year_range,firstYear)
    if(metricInput != "Driver Average") {
        resultsData = oldData[yearInput][driverInput][metricInput]["scores"];
    } else {
        resultsData = oldData[yearInput][driverInput][metricInput];
    }

    const scoreList = [];
    if(metricInput != "Driver Average") {
        Object.keys(resultsData).forEach(driver => {
            scoreList.push({
                driverName: resultsData[driver]["driver"],
                yearHappen: resultsData[driver]["year"],
                probability: resultsData[driver]["score"]
            });
        });
    }  else {
        Object.keys(resultsData).forEach(driver => {
            if (resultsData[driver]["score"]["SeasonCount"]>maxSeasons) {
                maxSeasons=resultsData[driver]["score"]["SeasonCount"]
            };
            scoreList.push({
                driverName: driver,
                yearHappen: resultsData[driver]["year"],
                score: resultsData[driver]["score"]["TotalScore"],
                seasons: resultsData[driver]["score"]["SeasonCount"]
            });
        });
    }

    const warning=document.getElementById("yearWarning");
    warning.innerHTML = '';
    if(yearInput==="Bottom x Drivers"){
        scoreList.sort((b, a) => b.probability - a.probability);
    } else if (metricInput === "Driver Average") {
        scoreList.sort((a,b) => b.score/b.seasons - a.score/a.seasons)
    } else {
        scoreList.sort((a, b) => b.probability - a.probability);
    }

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {
        
        yearHappen=item.yearHappen
        
        const scoreHere= Math.max(0.3, 1 - item.probability);
        
        color=interpolateColor(scoreHere);
        
        driverClass=`class="wdcOther"`;
        
        if(metricInput != "Driver Average") {
            const row = document.createElement("div");
            row.className = "score-row";
            if(wdcFirstList[yearHappen]===item.driverName) {
                driverClass=`class="wdc"`;
            } else if(wdcSecondList[yearHappen]===item.driverName) {
                driverClass=`class="wdc2"`;
            } else if(wdcThirdList[yearHappen]===item.driverName) {
                driverClass=`class="wdc3"`;
            }
            row.innerHTML = `
                <span ${driverClass};>${yearHappen}</span>
                <span ${driverClass};>${item.driverName}</span>
                <span style="color:${color};">${(item.probability*100).toFixed(3)}</span>
            `;
            container.appendChild(row);
        }  else {
            if(item.seasons>=Math.floor(maxSeasons/2)) {
                for (const yearOfyears of seasonYears) {
                    if(item.driverName === wdcFirstList[yearOfyears]) {
                        driverClass=`class="wdc"`
                    }
                }
                const row = document.createElement("div");
                row.className = "score-row";
                row.innerHTML = `
                    <span ${driverClass};>${item.driverName}</span>
                    <span style="color:${color};">${(item.score/item.seasons*100).toFixed(3)}</span>
                `;
                container.appendChild(row);
            }
        }

    });
}

function updateScoresWDC() {
    resultsData = oldData["Drivers"];

    const scoreList=[];

    Object.keys(wdcFirstList).forEach(year => {
        driver=wdcFirstList[year]
        console.log(driver)
        console.log(resultsData[driver][year])
        scoreList.push({
            driverName: driver,
            yearHappen: year,
            probability: resultsData[driver][year]["score"]
        });
        console.log(scoreList)
    });

    scoreList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("scoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {
        
        yearHappen=item.yearHappen
        
        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);
        
        color=interpolateColor(scoreHere);
        
        driverClass=`class="wdc"`;

        row.className = "score-row";
        
        row.innerHTML = `
            <span ${driverClass};>${yearHappen}</span>
            <span ${driverClass};>${item.driverName}</span>
            <span style="color:${color};">${(item.probability*100).toFixed(3)}</span>
        `;
        container.appendChild(row);
    });
}

function updateBetterScoresWDC() {
    resultsData = oldData["Drivers"];

    const scoreList=[];

    Object.keys(wdcFirstList).forEach(year => {
        driver=wdcFirstList[year]
        scoreList.push({
            driverName: driver,
            yearHappen: year,
            probability: resultsData[driver][year]["betterScore"]
        });
    });

    scoreList.sort((a, b) => b.probability - a.probability);

    const container =
        document.getElementById("betterScoreList");

    container.innerHTML = "";

    scoreList.forEach(item => {
        
        yearHappen=item.yearHappen
        
        const row = document.createElement("div");
        const scoreHere= Math.max(0.3, 1 - item.probability);
        
        color=interpolateColor(scoreHere);
        
        driverClass=`class="wdc"`;

        row.className = "score-row";
        
        row.innerHTML = `
            <span ${driverClass};>${yearHappen}</span>
            <span ${driverClass};>${item.driverName}</span>
            <span style="color:${color};">${(item.probability).toFixed(3)}</span>
        `;
        container.appendChild(row);
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

    if(year==="Drivers") {
        console.log("DRIVERS")
        drivers =
            Object.keys(oldData["Years"]);
    } else {
        drivers =
            Object.keys(oldData[year]);
    }

    drivers.sort();

    for (const driver of drivers) {
        if (year.includes("Bottom")) {
            const option = document.createElement("option");
            const numberHere = driver.slice(-2);
            option.value = driver;
            option.textContent = "Bottom "+numberHere+" Season Scores";
            driverSelect.appendChild(option);
        } else if (year.includes("Top")) {
            const option = document.createElement("option");
            numberHere = driver.slice(-2)
            option.value = driver;
            option.textContent = "Top "+numberHere+" Season Scores";
            yearSelect.appendChild(option);
        } else {
            const option = document.createElement("option");
            option.value = driver;
            option.textContent = driver;
            driverSelect.appendChild(option);
        }
    }
    if (year==="Years") {
        const option = document.createElement("option");
        option.value = 2026;
        option.textContent = 2026;
        driverSelect.appendChild(option);
        driverSelect.selectedIndex = driverSelect.options.length - 1;
    }
}

function populateExtraDropdown(span,yearSpan) {
    const extraSelect =
        document.getElementById("extraSelect");
    
    extraSelect.options.length = 0;
    const metricOptions = [];
    console.log(span)
    console.log(oldData["Years"][yearSpan])
    if (span==="Drivers") {
        Object.keys(oldData["Years"][yearSpan]).forEach(driver => {
            console.log(oldData["Years"][yearSpan][driver])
            metricOptions.push(oldData["Years"][yearSpan][driver]["name"])
        });
        console.log(metricOptions)
    } else {
        Object.keys(oldData[span][yearSpan]).forEach(keyName => {
            metricOptions.push(keyName)
        });
    } 
    console.log(metricOptions)
    for (const metric of metricOptions) {
        const option = document.createElement("option");
        option.value = metric;
        option.textContent = metric;
        extraSelect.appendChild(option);
    }
}

async function initialize() {

    await loadData();
    const extraSelect = document.getElementById("extraDropdown");
    extraSelect.style.visibility = "collapse";

    populateYearDropdown();

    const year = document.getElementById("yearSelect").value;
     if (year!="WDCs") {
        driverDropdownText.innerHTML = "Year";
        populateDriverDropdown(year);
        const driver = document.getElementById("driverSelect").value;
        updateScoreYears(year,driver);
        updateBetterScoreYears(year,driver);
    } else {
        updateScoresWDC()
        updateBetterScoresWDC()
    }
}

initialize();

document
.getElementById("yearSelect")
.addEventListener("change", function() {
    const year = document.getElementById("yearSelect").value;
    if(year==="Years") {
        driverDropdownText.innerHTML = "Year";
    } else if (year==="Bottom x Drivers") {
        driverDropdownText.innerHTML = "Number of Drivers";
    } else if (year==="Top x Drivers") {
        driverDropdownText.innerHTML = "Number of Drivers";
    } else if (year==="Drivers") {
        driverDropdownText.innerHTML = "Season";
    } else if (year==="5 Year Span") {
        driverDropdownText.innerHTML = "5 Years";
    } else if (year==="Regulation") {
        driverDropdownText.innerHTML = "Regulation Period";
    }
    const dropdown = document.getElementById("driverSelect");
    const driverDropdown = document.getElementById("driverDropdown2");
    const extraSelect = document.getElementById("extraDropdown");
     if (year==="WDCs") {
        driverDropdown.style.visibility = "collapse";
        extraSelect.style.visibility = "collapse";
        updateScoresWDC()
        updateBetterScoresWDC()
    } else {
        driverDropdown.style.visibility = "visible";
        populateDriverDropdown(year);
    
        const driver = document.getElementById("driverSelect").value;
        
        if (year==="Years"){
            extraSelect.style.visibility = "collapse";
            updateScoreYears(year,driver);
            updateBetterScoreYears(year,driver);
        } else if (year.includes("x Drivers")) {
            extraSelect.style.visibility = "collapse";
            updateBetterScoreRank10(year,driver);
            updateScoreRank10(year,driver);
        } else if (year==="Drivers") {
            populateExtraDropdown(year,driver);
            extraSelect.style.visibility = "visible";
            const driverData = document.getElementById("extraSelect").value;
            updateDriverScore(year,driverData);
            updateDriverBetterScore(year,driverData);
        } else {
            extraSelect.style.visibility = "visible";
            populateExtraDropdown(year,driver);
            const metric = document.getElementById("extraSelect").value;
            updateBetterScoreYearSpan(year,driver,metric);
            updateScoreYearSpan(year,driver,metric);
        }
    }
});
document
.getElementById("driverSelect")
.addEventListener("change", function() {
    const driver = document.getElementById("driverSelect").value;
    const year = document.getElementById("yearSelect").value;
    const extraSelect = document.getElementById("extraDropdown");
    extraSelect.style.visibility = "collapse";
    if (year==="Years"){
        updateScoreYears(year,driver);
        updateBetterScoreYears(year,driver);
    } else if (year.includes("x Drivers")) {
        updateBetterScoreRank10(year,driver)
        updateScoreRank10(year,driver)
    } else if (year==="Drivers") {
        extraSelect.style.visibility = "visible";
        populateExtraDropdown(year,driver)
        const driverData = document.getElementById("extraSelect").value;
        updateDriverScore(year,driverData);
        updateDriverBetterScore(year,driverData);
    } else {
        extraSelect.style.visibility = "visible";
        populateExtraDropdown(year,driver)
        const metric = document.getElementById("extraSelect").value;
        updateBetterScoreYearSpan(year,driver,metric);
        updateScoreYearSpan(year,driver,metric);
    }
});
document
.getElementById("extraSelect")
.addEventListener("change", function() {
    const driver = document.getElementById("driverSelect").value;
    const year = document.getElementById("yearSelect").value;
    const metric = document.getElementById("extraSelect").value;
    if(year==="5 Year Span") {
        updateBetterScoreYearSpan(year,driver,metric)
        updateScoreYearSpan(year,driver,metric)
    } else if (year==="Regulations") {
        updateBetterScoreYearSpan(year,driver,metric)
        updateScoreYearSpan(year,driver,metric)
    } else {
        updateDriverScore(year,metric);
        updateDriverBetterScore(year,metric);
    }
});