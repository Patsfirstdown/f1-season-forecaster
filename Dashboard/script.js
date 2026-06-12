let predictionData;

async function loadData() {
    const response = await fetch("data/predictions.json");
    predictionData = await response.json();

    console.log(predictionData);
}

function populateRaceDropdown() {

    const raceSelect =
        document.getElementById("raceSelect");

    const races =
        Object.entries(predictionData.races);

    races.sort((a, b) => a[1] - b[1]);

    races.forEach(([raceName, round]) => {

        const option =
            document.createElement("option");

        option.value = raceName;
        option.textContent = raceName;

        raceSelect.appendChild(option);
    });
}

function populateDriverDropdown(raceName) {

    const driverSelect =
        document.getElementById("driverSelect");

    driverSelect.innerHTML = "";

    const drivers =
        Object.keys(
            predictionData.data[raceName]
        ).sort();

    drivers.forEach(driver => {

        const option =
            document.createElement("option");

        option.value = driver;
        option.textContent = driver;

        driverSelect.appendChild(option);
    });
}


loadData();
await loadData();
populateRaceDropdown();

document
.getElementById("raceSelect")
.addEventListener("change", function() {

    populateDriverDropdown(this.value);

});
