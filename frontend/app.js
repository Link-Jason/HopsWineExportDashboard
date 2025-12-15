// Hops & Wine Export Friction Dashboard
// This script favors business reasoning over low-level engineering detail.
// Each calculation step is annotated with how it informs trade decisions.

const productSelect = document.getElementById("productSelect");
const countrySelect = document.getElementById("countrySelect");
const weightOperationalInput = document.getElementById("weightOperational");
const weightRelationalInput = document.getElementById("weightRelational");
const scenarioMultiplierInput = document.getElementById("scenarioMultiplier");
const tariffAdjustmentInput = document.getElementById("tariffAdjustment");

const frictionIndexEl = document.getElementById("frictionIndex");
const operationalFrictionEl = document.getElementById("operationalFriction");
const relationalFrictionEl = document.getElementById("relationalFriction");
const tipEl = document.getElementById("tip");
const confidenceEl = document.getElementById("confidence");
const colorLabelEl = document.getElementById("colorLabel");

const printBtn = document.getElementById("printBtn");

let products = [];
let countries = [];
let chart;

async function init() {
  await Promise.all([loadProducts(), loadCountries()]);
  attachListeners();
  calculateAndRender(); // initial render with defaults
}

async function loadProducts() {
  const res = await fetch("../data/products.json");
  products = await res.json();
  products.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = p.name;
    productSelect.appendChild(option);
  });
}

async function loadCountries() {
  const res = await fetch("../data/countries.json");
  countries = await res.json();
  countries.forEach((c) => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    countrySelect.appendChild(option);
  });
}

function attachListeners() {
  [
    productSelect,
    countrySelect,
    weightOperationalInput,
    weightRelationalInput,
    scenarioMultiplierInput,
    tariffAdjustmentInput,
  ].forEach((el) => el.addEventListener("change", calculateAndRender));

  printBtn.addEventListener("click", () => window.print());
}

function buildQuery() {
  const params = new URLSearchParams({
    productId: productSelect.value,
    countryId: countrySelect.value,
    weightOperational: weightOperationalInput.value || "1",
    weightRelational: weightRelationalInput.value || "1",
    scenarioMultiplier: scenarioMultiplierInput.value || "1",
    tariffAdjustment: tariffAdjustmentInput.value || "0",
  });
  return `/api/calculate?${params.toString()}`;
}

async function calculateAndRender() {
  // Guard until data loads
  if (!productSelect.value || !countrySelect.value) return;

  const url = buildQuery();
  const res = await fetch(url);
  if (!res.ok) {
    tipEl.textContent = "Could not fetch calculation. Check inputs.";
    return;
  }
  const data = await res.json();
  renderResults(data);
}

function renderResults(data) {
  const { frictionIndex, operationalFriction, relationalFriction, color, tip, confidence } = data;

  frictionIndexEl.textContent = frictionIndex.toFixed(1);
  operationalFrictionEl.textContent = operationalFriction.toFixed(1);
  relationalFrictionEl.textContent = relationalFriction.toFixed(1);
  tipEl.textContent = tip;
  confidenceEl.textContent = `${confidence}%`;

  applyColor(frictionIndexEl, color);
  applyColor(colorLabelEl, color, true);
  colorLabelEl.textContent = color;

  renderChart(operationalFriction, relationalFriction, color);
}

function applyColor(el, color, isBadge = false) {
  el.classList.remove("color-green", "color-yellow", "color-red");
  if (color === "Green") el.classList.add("color-green");
  if (color === "Yellow") el.classList.add("color-yellow");
  if (color === "Red") el.classList.add("color-red");
  if (isBadge) {
    el.style.background =
      color === "Green"
        ? "rgba(34,197,94,0.15)"
        : color === "Yellow"
        ? "rgba(234,179,8,0.2)"
        : "rgba(239,68,68,0.2)";
  }
}

function renderChart(operational, relational, color) {
  const ctx = document.getElementById("frictionChart").getContext("2d");
  const palette = {
    Green: "#22c55e",
    Yellow: "#eab308",
    Red: "#ef4444",
  };
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Operational", "Relational"],
      datasets: [
        {
          label: "Friction",
          data: [operational, relational],
          backgroundColor: [palette[color], palette[color]],
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.formattedValue} (lower is better)`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Friction score" },
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#e5e7eb" },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#e5e7eb" },
        },
      },
    },
  });
}

init();

