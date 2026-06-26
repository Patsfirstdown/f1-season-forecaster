async function createHeader() {
    document.getElementById(
        "mainHeader"
    ).innerHTML = `
        <ul class="nav">
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/driver_race" align="right">Race</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/wdc.html" align="left">WDC</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/wcc.html" align="left">WCC</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/analysis.html" align="left">Analysis</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/faq.html" align="center">FAQs</a>
                </li>
                <li class="right_link">
                    <a class="right_link" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/dashboard.html" align="right">Home</a>
                </li>
            </ul>
    `;

}

async function loadFooter() {
    document.getElementById(
        "footerForm"
    ).innerHTML = `
        <table class="footerForm">
                <theader>
                    <tr>
                        <td>
                            Data provided via FastF1 and Formula 1 timing data. This project is unofficial and not affiliated with Formula 1.
                        </td>
                        <td>
                            <a class="footerForm" href="https://www.instagram.com/jayden.pickin.official">Instagram</a>
                        </td>
                        <td>
                            <a class="footerForm" href="https://linkedin.com/in/jayden-pickin">LinkedIn</a>
                        </td>
                    </tr>
                </theader>
            </table>
    `;
}
document.addEventListener("DOMContentLoaded", () => {
    createHeader();
    createFooter();
});
