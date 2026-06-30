async function createHeader() {
    document.getElementById(
        "mainHeader"
    ).innerHTML = `
        <ul class="nav">
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/driver_race" align="right">Race</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/wdc" align="left">WDC</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/wcc" align="left">WCC</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/analysis" align="left">Analysis</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/faq" align="center">FAQs</a>
                </li>
                <li>
                    <a class="header" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/Real_data" align="right">Real Scores</a>
                </li>
                <li class="right_link">
                    <a class="right_link" href="https://patsfirstdown.github.io/f1-season-forecaster/Dashboard/dashboard" align="right">Home</a>
                </li>
            </ul>
    `;

}

async function createFooter() {
    document.getElementById(
        "footerForm"
    ).innerHTML = `
        <table class="footerForm">
                <theader>
                    <tr>
                        <td>
                            <a class="footerForm" href="https://www.instagram.com/jayden.pickin.official">Instagram</a>
                        </td>
                        <td>
                            <a class="footerForm" href="https://linkedin.com/in/jayden-pickin">LinkedIn</a>
                        </td>
                        <td>
                            <a class="footerForm" href="https://forms.gle/3WqT9ftSMu1ftFBM6">Feedback</a>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" class="disclaimer">
                            Data provided via FastF1 and Formula 1 timing data. This project is unofficial and not affiliated with Formula 1.
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
