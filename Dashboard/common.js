async function createHeader() {
    document.getElementById(
        "mainHeader"
    ).innerHTML = `
        <ul class="nav">
            <li>
                <a class="header" href="upcoming_forecast.html" align="right">Next Race</a>
            </li>                
            <li>
                <a class="header" href="driver_race.html" align="right">Driver</a>
            </li>
            <li>
                <a class="header" href="wdc.html" align="left">WDC</a>
            </li>
            <li>
                <a class="header" href="wcc.html" align="left">WCC</a>
            </li>
            <li>
                <a class="header" href="analysis.html" align="left">Analysis</a>
            </li>
            <li>
                <a class="header" href="faq.html" align="center">FAQs</a>
            </li>
            <li>
                <a class="header" href="Real_data.html" align="right">Real Scores</a>
            </li>
            <li class="right_link">
                <a class="right_link" href="dashboard.html" align="right">Home</a>
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