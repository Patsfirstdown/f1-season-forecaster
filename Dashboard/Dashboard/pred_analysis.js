let realData;
let predictionData;
let resultsData;
let oldData;
let driverClass;
let currentGrid;
const d = new Date();
let year = d.getFullYear();
let allPredictionRows = {};
let subInfo=document.getElementById("subInfo")
let lastRace;
let races;
let driverSelection = document.getElementById("driverSelect");

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

const scoreState = {
    currentSort: "AME",
    ascending: false,
    scoreList: [],
    scoreKey: "",
    container: document.getElementById("output"),
    displayKey: "",
    averageYears: null,
    limit: 10000
};

async function loadData() {
    const response = await fetch("data/"+year+"/results.json");
    const response2 = await fetch("data/"+year+"/predictions.json");
    const response3 = await fetch("data/"+year+"/oldData.json");
    realData = await response.json();
    predictionData = await response2.json();
    oldData = await response3.json();

    races = Object.entries(predictionData.races)
        .sort((a, b) => a[1][0] - b[1][0]);

    lastRace=races[races.length - 1][0];

    currentGrid = []

    Object.keys(realData["stats"]).forEach(driver => {
        currentGrid.push(realData["stats"][driver]["name"])
    });
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + parseInt(startAt,10));
}

function populateDriverDropdown(raceName) {

    if (!raceName) {
        return;
    }

    const driverSelect =
        document.getElementById("driverSelect");

    driverSelect.innerHTML = "";

    const drivers =
        Object.keys(
            predictionData.wdc_data[raceName]
        ).sort();

    drivers.forEach(driver => {

        const option =
            document.createElement("option");

        option.value = driver;
        option.textContent = predictionData.race_data[raceName][driver].driver_name;

        driverSelect.appendChild(option);
    });
    if (drivers.includes("max_verstappen")) {
        driverSelect.value = "max_verstappen";
    }
}

function buildPredictionRows(resultsData) {

    const rows = {};
    const prediction = predictionData.wdc_data[lastRace]

    Object.keys(prediction).forEach((driver) => {
        let posOddDict={};
        let posPointsDict={};
        for (let i=1;i<23;i++) {
            if(prediction[driver][i].count>0) {
                posOddDict[i]=prediction[driver][i].count;
                posPointsDict[i]=prediction[driver][i].AvgPoints/(prediction[driver][i].count*10000);
            } else {
                posOddDict[i]=0;
                posPointsDict[i]=0;
            }

        }
        rows[driver]={
            driverName: prediction[driver].driver_name,
            team: prediction[driver].team_name,
            expectedFinish: prediction[driver].expected_finish,
            posOdds:posOddDict,
            posPoints:posPointsDict,
        };

    });

    return rows;

}

function updateAME(checkBox,metric) {
    let titleElement = document.getElementById("titleHere");
    titleElement.innerHTML=metric;

    output=document.getElementById("output")
    container=document.getElementById("output")

    scoreList={}

    output.innerHTML=checkBox
    if (checkBox==="Driver") {
        output.innerHTML=checkBox
        const driverStats = {};
        allPredictionRows.forEach(row => {

            if (!(row.driver in driverStats)) {

                driverStats[row.driver] = {

                    driverName: row.driverName,
                    driverId: row.driver,

                    ME: 0,
                    Starts: 0,
                    Finishes: 0,
                    TotalProb: 0,
                    dnfOdds: 0,
                };

            }

            const stats = driverStats[row.driver];

            stats.Starts++;
            stats.TotalProb+=row.finishOdds;
            stats.dnfOdds+=row.dnfChanceDNFONLY

            if (row.finished) {

                stats.Finishes++;
                stats.ME += row.error;
            }
        });

        Object.values(driverStats).forEach(stats => {
            stats.AME = stats.ME / stats.Finishes;
            stats.Prob = stats.TotalProb/stats.Starts;
            stats.DNF_Prob = (stats.dnfOdds/(stats.Starts-stats.Finishes));
        });
        const displayList = Object.values(driverStats);
        renderAMEList(displayList, container,"driverName",metric,"Driver");
    } else if (checkBox==="Race") {
        output.innerHTML=checkBox
        const raceStats = {};

        allPredictionRows.forEach(row => {

            if (!(row.eventId in raceStats)) {

                raceStats[row.eventId] = {

                    raceName: row.raceName,

                    ME: 0,
                    Starts: 0,
                    Finishes: 0,
                    TotalProb: 0,
                    dnfOdds: 0,

                };
            }

            const stats = raceStats[row.eventId];

            stats.Starts++;
            stats.TotalProb+=row.finishOdds;
            stats.dnfOdds+=row.dnfChanceDNFONLY
            if (row.finished) {
                stats.Finishes++;
                stats.ME += row.error;
            }
        });

        Object.values(raceStats).forEach(stats => {
            stats.AME = stats.ME / stats.Finishes;
            stats.Prob = stats.TotalProb/stats.Starts;
            stats.DNF_Prob = (stats.dnfOdds/(stats.Starts-stats.Finishes));
        });
        const displayList = Object.values(raceStats);
        renderAMEList(displayList, container,"raceName",metric,"Race");
    } else if (checkBox==="Team") {
        output.innerHTML=checkBox
        const teamStats = {};

        allPredictionRows.forEach(row => {

            if (!(row.team in teamStats)) {

                teamStats[row.team] = {

                    teamName: row.team,

                    ME: 0,
                    Starts: 0,
                    Finishes: 0,
                    TotalProb: 0,
                    dnfOdds: 0,

                };

            }

            const stats = teamStats[row.team];

            stats.Starts++;
            stats.TotalProb+=row.finishOdds;
            stats.dnfOdds+=row.dnfChanceDNFONLY
            if (row.finished) {

                stats.Finishes++;
                stats.ME += row.error;
            }
        });

        Object.values(teamStats).forEach(stats => {
            stats.AME = stats.ME / stats.Finishes;
            stats.Prob = stats.TotalProb/stats.Starts;
            stats.DNF_Prob = (stats.dnfOdds/(stats.Starts-stats.Finishes));
        });

        const displayList = Object.values(teamStats);

        renderAMEList(displayList, container,"teamName",metric,"Team");
    } else {
        function updateSearch() {

            const filteredRows =
                allPredictionRows.filter(row =>
                    row.driverName
                        .toLowerCase()
                );


            if(metric === "AME") {

                renderALLList(
                    filteredRows,
                    container,
                    "error",
                    "Absolute Error",
                    "asc"
                );

            } else if(metric === "Prob") {

                renderALLList(
                    filteredRows,
                    container,
                    "finishOdds",
                    "Finish Prob",
                    "desc"
                );

            } else if(metric === "DNF_Prob") {

                renderALLList(
                    filteredRows,
                    container,
                    "dnfChanceDNFONLY",
                    "DNF%",
                    "desc"
                );

            }

        }


        searchInput.addEventListener(
            "input",
            updateSearch
        );


        // Initial load with no search
        updateSearch();

    }
}

function updateDriver(metric,driver) {
    let titleElement = document.getElementById("titleHere");
    titleElement.innerHTML=metric;

    output=document.getElementById("output")
    container=document.getElementById("output")

    scoreList={}

    const driverStats = allPredictionRows[driver];
    renderDriverList(driverStats, container,"driverName",metric,"Driver",driver);

}

function renderDriverList(driverStats, container, namekey, focus, nameNonKey,driver) {
    let color = "#FFFFFF"
    let otherSign;
    let data=driverStats[focus];
    if(focus==="posOdds") {
        otherSign="%"
        subInfo.innerHTML="Average Mean Error of Expected Position"
    } else if(focus==="points") {
        otherSign="%"
        subInfo.innerHTML="Average DNF Odds of All Actual DNFs"
    } else if(focus==="-WILLDO----") {
        otherSign="%"
        subInfo.innerHTML="Average -WILLDO----"
    } else if(focus==="Prob") {
        otherSign="%"
        subInfo.innerHTML="Average Predicted Odds of All Actual Finish Positions"
    }
    
    container.replaceChildren();
    
    let titleContainer = document.getElementById("outputTitle")
    titleContainer.replaceChildren();
    
    const row1 = document.createElement("div");
    row1.className = "score-rowPRED";
    
    row1.innerHTML = `
    <span>Position</span>
    <span>${nameNonKey}</span>
    <span>Odds</span>
    <span>Points</span>
    `;
    
    titleContainer.appendChild(row1);
    
    for (let i=1; i<23; i++) {
        if(namekey==="driverName") {
            color=(predictionData.driverColor[driver])
        } else if (namekey==="teamName"){
            color=(predictionData.teamColor[item[namekey]])
        }
        let classNameHere="oneTwoIgnore"
        if(driverStats.posOdds[i]===0) {
            classNameHere="shrinkThis"
        }
        let inverted=invertColor(color)
        
        const row = document.createElement("div");
        row.className = "score-rowPRED";
        
        row.innerHTML = `
        <span class="${classNameHere}">${i}</span>
        <span class="${classNameHere}" style="color:${color}; text-shadow: 1px 1px 1px ${inverted};">${driverStats[namekey]}</span>
        <span class="${classNameHere}">${(driverStats.posOdds[i]*100).toFixed(2)}${otherSign}</span>
        <span class="${classNameHere}">${driverStats.posPoints[i].toFixed(2)}</span>
        `;
        
        container.appendChild(row);
        
    };
}


function renderAMEList(displayList, container,namekey,focus,nameNonKey) {
    let color = "#FFFFFF"
    let otherSign;
    if(focus==="AME") {
        displayList.sort((a, b) => a[focus] - b[focus]);
        otherSign=""
        subInfo.innerHTML="Average Mean Error of Expected Position"
    } else if(focus==="DNF_Prob") {
        displayList.sort((b, a) => a[focus] - b[focus]);
        otherSign="%"
        subInfo.innerHTML="Average DNF Odds of All Actual DNFs"
    } else if(focus==="-WILLDO----") {
        displayList.sort((b, a) => a[focus] - b[focus]);
        otherSign="%"
        subInfo.innerHTML="Average -WILLDO----"
    } else if(focus==="Prob") {
        displayList.sort((b, a) => a[focus] - b[focus]);
        otherSign="%"
        subInfo.innerHTML="Average Predicted Odds of All Actual Finish Positions"
    }
    
    const maxFocus = Math.max(
        ...displayList.map(item => item[focus])
    );
    
    container.replaceChildren();
    
    let titleContainer = document.getElementById("outputTitle")
    titleContainer.replaceChildren();
    
    const row1 = document.createElement("div");
    row1.className = "score-rowPRE_RESULT";
    
    row1.innerHTML = `
    <span>Rank</span>
    <span>${nameNonKey}</span>
    <span>${focus}</span>
    <span>Finishes</span>
    <span>Starts</span>
    `;
    
    titleContainer.appendChild(row1);
    
    
    displayList.forEach((item, index) => {
        if(namekey==="driverName") {
            color=(predictionData.driverColor[item.driverId])
        } else if (namekey==="teamName"){
            color=(predictionData.teamColor[item[namekey]])
        }
        let inverted=invertColor(color)
        
        const colorScaled = colorGrading(
            item[focus] / maxFocus
        );
        
        const row = document.createElement("div");
        row.className = "score-rowPRE_RESULT";
        
        row.innerHTML = `
        <span>${index + 1}</span>
        <span style="color:${color}; text-shadow: 1px 1px 1px ${inverted};">${item[namekey]}</span>
        <span style="color:${colorScaled};">${item[focus].toFixed(2)}${otherSign}</span>
        <span>${item.Finishes}</span>
        <span>${item.Starts}</span>
        `;
        
        container.appendChild(row);
        
    });
}

function renderALLList(displayList, container, focus, focusName, sortOrder) {
    let color;
    let maxFocus;
    
    displayList = displayList.filter(
        item => item[focus] !== null
    );
    if(sortOrder==="asc") {
        displayList.sort((a, b) => a[focus] - b[focus]);
    } else {
        displayList.sort((b, a) => a[focus] - b[focus]);
    }
    
    maxFocus = Math.max(
        ...displayList.map(item => item[focus])
    );
    
    container.replaceChildren();
    let titleContainer = document.getElementById("outputTitle")
    const row1 = document.createElement("div");
    row1.className = "score-rowPRE_RESULT_ALL";
    let rankCode;
    if(focus==="error") {
        row1.innerHTML = `
        <span>Rank</span>
        <span>Driver</span>
        <span>Race</span>
        <span>${focusName}</span>
        <span>Finished</span>
        `;
        rankCode="errorRank"
        subInfo.innerHTML="Absolute Difference Between Expected Position and Actual Finish Position"
        
    } else if(focus==="dnfChanceDNFONLY") {
        row1.innerHTML = `
        <span>Rank</span>
        <span>Driver</span>
        <span>Race</span>
        <span>${focusName}</span>
        <span>Finished</span>
        `;
        rankCode="DNFRank"
        subInfo.innerHTML="Predicted Odds of Actual DNF results"
    } else if(focus==="finishOdds") {
        row1.innerHTML = `
        <span>Rank</span>
        <span>Driver</span>
        <span>Race</span>
        <span>${focusName}</span>
        <span>Place</span>
        `;
        rankCode="finishOddsRank"
        subInfo.innerHTML="Predicted Odds of Actual Finish Position"
    }
    
    titleContainer.replaceChildren();
    
    titleContainer.appendChild(row1);
    
    displayList.forEach((item, index) => {
        color=(predictionData.driverColor[item.driver])
        let inverted=invertColor(color)
        
        const row = document.createElement("div");
        row.className = "score-rowPRE_RESULT_ALL";
        
        const colorScaled = colorGrading(
            item[focus] / maxFocus
        );
        if(focus!="error") {
            row.innerHTML = `
            <span>${item[rankCode]}</span>
            <span style="color:${color}; text-shadow: 1px 1px 1px ${inverted};">${item.driverName}</span>
            <span>${item.raceName}</span>
            <span style="color:${colorScaled};">${item[focus].toFixed(2)}%</span>
            <span>${item.actualFinish}</span>
            `;
        } else {
            row.innerHTML = `
            <span>${item[rankCode]}</span>
            <span style="color:${color}; text-shadow: 1px 1px 1px ${inverted};">${item.driverName}</span>
            <span>${item.raceName}</span>
            <span style="color:${colorScaled};">${item[focus].toFixed(2)}</span>
            <span>${item.finished ? "Finished" : "DNF"}</span>
            `;
        }
        
        container.appendChild(row);
        
    });
}

function addDriverSearch(metric) {

    const searchInput = document.getElementById("driverSearchBar");

    searchInput.addEventListener("input", () => {

        const searchValue = searchInput.value.toLowerCase();

        const filteredRows = allPredictionRows.filter(row =>
            row.driverName.toLowerCase().includes(searchValue)
        );

        if (metric === "AME") {

            renderALLList(
                filteredRows,
                container,
                "error",
                "Absolute Error",
                "asc"
            );

        } else if (metric === "Prob") {

            renderALLList(
                filteredRows,
                container,
                "finishOdds",
                "Finish Prob",
                "desc"
            );

        }

    });
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function colorGrading(percent) {

    const r = 139 + (116 * (1 - percent));
    const g = 255 * (1 - percent);
    const b = 255 * (1 - percent);

    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
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

function getSelectedStat() {
    return document.querySelector(
        'input[name="Filter"]:checked'
    ).value;
}

function getSelectedMetric() {
    return document.querySelector(
        'input[name="metric"]:checked'
    ).value;
}

async function initialize() {
    await loadData();
    resultsData = realData.results;
    allPredictionRows = buildPredictionRows(resultsData);
    populateDriverDropdown(lastRace)
    const selectedCheckedMetrics = getSelectedMetric();
    const selectedStatValue = getSelectedStat();
    console.log(selectedStatValue)
    if(selectedStatValue==="Driver") {
        const driverSelected = document.getElementById("driverSelect").value;
        updateDriver(selectedCheckedMetrics,driverSelected)
    } else {
        console.log("HI")
        updateAME(selectedStatValue,selectedCheckedMetrics);
    }
}

initialize();

const checkedOptions = document.querySelectorAll('input[name="Filter"]');
const checkedMetrics = document.querySelectorAll('input[name="metric"]');

const actuallyCheckedOptions = document.querySelectorAll('input[name="Filter"]:checked').value;
const actuallyCheckedMetrics = document.querySelectorAll('input[name="metric"]:checked').value;

checkedOptions.forEach(option => {
  option.addEventListener('change', (event) => {
    // The 'event.target' is the radio button that was just selected
    const selectedStatValue = event.target.value;
    const selectedCheckedMetrics = getSelectedMetric();
    if(selectedCheckedMetrics==="Driver") {
        const driverSelected = document.getElementById("driverSelect").value;
        updateDriver(selectedCheckedMetrics,driverSelected)
    } else {

        updateAME(selectedStatValue,selectedCheckedMetrics);
    }
    console.log(`Shipping updated to: ${selectedStatValue}`);
  });
});


checkedMetrics.forEach(option => {
  option.addEventListener('change', (event) => {
    // The 'event.target' is the radio button that was just selected
    const selectedMetricValue = event.target.value;
    const selectedStatValue = getSelectedStat();
    updateAME(selectedStatValue,selectedMetricValue);
    console.log(`Shipping updated to: ${selectedMetricValue}`);
  });
});

driverSelection
.addEventListener("change", function() {
    //check driverSelect
    const selectedStatValue = getSelectedStat();
    const selectedCheckedMetrics = getSelectedMetric();
    console.log(selectedCheckedMetrics)
    if(selectedStatValue==="Driver") {
        const driverSelected = document.getElementById("driverSelect").value;
        updateDriver(selectedCheckedMetrics,driverSelected)
    } else {
        updateAME(selectedStatValue,selectedCheckedMetrics);
    }
    console.log(`Shipping updated to: ${selectedStatValue}`);
});