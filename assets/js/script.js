let gainers = [];
let losers = [];

const fundCardTemplate = (fund, type) => `
  <div class="funds-card" data-code="${fund.code}">
    <div class="fund-mono">${fund.code[0]}</div>
    <div class="fund-info">
      <div class="fund-code">${fund.code}</div>
      <div class="fund-description">${fund.description}</div>
    </div>
    <div class="fund-stats">
      <div class="fund-nav">NAV: ${fund.nav}</div>
      <div class="fund-performance ${type === "gainers" ? "positive" : "negative"}">
        ${type === "gainers" ? "↑" : "↓"} ${fund.change}
      </div>
    </div>
  </div>
`;

const renderFunds = (funds, type) => {
  $(".spinner-border").show();
  $(".funds-list").html("");
  $(".view-all-btn").hide();

  const cards = funds.map((fund) => fundCardTemplate(fund, type)).join("");
  $(".funds-list").html(cards);
  $(".spinner-border").hide();
  $(".view-all-btn").show();
};

const initFunds = async () => {
  try {
    const response = await fetch("data/funds.json");
    if (!response.ok) throw new Error("Failed to load funds data");
    const data = await response.json();

    gainers = data.filter((f) => f.type === "gainer");
    losers = data.filter((f) => f.type === "loser");

    renderFunds(gainers, "gainers");
  } catch (err) {
    $(".funds-list").html("<p>Failed to load funds data.</p>");
  }
};

$(".fund-tab").on("click", (e) => {
  $(".fund-tab").removeClass("active");
  $(e.currentTarget).addClass("active");

  const tabType = $(e.currentTarget).data("tab");
  $(".funds-content-wrapper").removeClass("gainers losers").addClass(tabType);

  if (tabType === "gainers") renderFunds(gainers, "gainers");
  else renderFunds(losers, "losers");
});

$(document).on("click", ".funds-card", (e) => {
  const code = $(e.currentTarget).data("code");
  window.location.href = `fund-details.html?id=${code}`;
});

initFunds();

const getFundTitle = (fund) => `
  <div class="fund-mono">${fund.name[0]}</div>
  <div class="fund-info">
    <div class="fund-name">${fund.name}</div>
    <span class="fund-code">${fund.code}</span>
  </div>
`;

const getFundDetails = (fund) => `
  <table class="fund-details-table">
    <tbody>
      <tr>
        <td class="desc-bold">Net Asset Value:</td>
        <td class="desc-text">${fund.nav}</td>
      </tr>
      <tr>
        <td class="desc-bold">Change:</td>
        <td class="desc-text ${fund.change.startsWith("-") ? "negative" : "positive"}">
          ${fund.change}
        </td>
      </tr>
      <tr>
        <td class="desc-bold">Fund Category:</td>
        <td class="desc-text">${fund.category}</td>
      </tr>
      <tr>
        <td class="desc-bold">Manager:</td>
        <td class="desc-text">${fund.manager}</td>
      </tr>
    </tbody>
  </table>
`;

const getFundSummary = (fund) => `
  <p>
    ${fund.name}'s current Net Asset Value(NAV) is ${fund.nav}. Managed by ${fund.manager}, under ${fund.category}. 
    Today's return: ${fund.change}.
  </p>
  <span class="fund-date-time">${new Date().toLocaleString()}</span>
`;
const loadFundDetails = async () => {
  try {
    const fundCode = new URLSearchParams(window.location.search).get("id");
    if (!fundCode) return;
    const response = await fetch("data/funds.json");
    if (!response.ok) throw new Error("Failed to load funds data");

    const data = await response.json();
    const fund = data.find((fund) => fund.code === fundCode);

    $("#fund-details-wrapper").html(getFundTitle(fund));
    $(".fund-data").html(getFundDetails(fund));
    $(".fund-summary").html(getFundSummary(fund));
  } catch (err) {
    console.error("Error loading fund details:", err);
    const errorHtml = "<p>Failed to load fund details.</p>";
    $("#fund-details-wrapper").html(errorHtml);
    $(".fund-data, .fund-summary").empty();
  }
};

loadFundDetails();

const createPerformanceBadges = (period, value) => `
  <div class="performance-badge ${parseFloat(value) >= 0 ? "positive" : "negative"}">
    <span class="period">${period}:</span>
    <span class="value">${value}</span>
  </div>
`;

const loadPerformanceBadges = async () => {
  try {
    const response = await fetch("data/funds.json");
    if (!response.ok) throw new Error("Failed to load funds data");

    const funds = await response.json();
    const fundCode = new URLSearchParams(window.location.search).get("id");
    const selectedFund = fundCode ? funds.find((fund) => fund.code === fundCode) : "";

    const badgesHtml = Object.entries(selectedFund.performance)
      .map(([period, value]) => createPerformanceBadges(period, value))
      .join("");

    $("#funds-badges").html(`<div class="performance-badges">${badgesHtml}</div>`);
  } catch (err) {
    $("#funds-badges").html("<p>Error loading funds</p>");
  }
};

loadPerformanceBadges();

const loadFundChart = async () => {
  const fundCode = new URLSearchParams(window.location.search).get("id");
  if (!fundCode) return;

  $(".spinner-border").show();

  try {
    const funds = await fetch("data/funds.json").then((res) => res.json());
    const fund = funds.find((fund) => fund.code === fundCode);

    const ctx = $("#navChart")[0].getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(0,123,255,0.25)");
    gradient.addColorStop(1, "rgba(0,123,255,0)");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "NAV (PKR)",
            data: [],
            borderColor: "#007bff",
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(0,0,0,0.05)" }, title: { display: true, text: "NAV Value (PKR)" } },
        },
      },
    });

    const updateChart = (range) => {
      const data = fund.navHistory[range] || [];
      chart.data.labels = data.map((data) => data.date);
      chart.data.datasets[0].data = data.map((data) => data.nav);
      chart.update();
    };

    updateChart("1D");
    $(".spinner-border").hide();

    $(".time-btn")
      .off("click")
      .on("click", function () {
        $(".time-btn").removeClass("active");
        $(this).addClass("active");
        $(".spinner-border").show();
        updateChart($(this).data("range"));
        $(".spinner-border").hide();
      });
  } catch (error) {
    console.error(error);
    $(".spinner-border").hide();
  }
};

loadFundChart();
