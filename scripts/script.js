// script.js
import { countyData } from "../data/countyData.js";
import { providers } from "../data/providers-intake-data.js";

const yearSelect = document.getElementById("yearSelect");
const providerSelect = document.getElementById("providerSelect");
const genderSelect = document.getElementById("genderSelect");
const ageSelect = document.getElementById("ageSelect");
const cardContainer = document.getElementById("cardContainer");

providers.forEach((p) => {
  const opt = document.createElement("option");
  opt.value = p.provider;
  opt.textContent = p.provider;
  providerSelect.appendChild(opt);
});

function getProviderYearData(year, gender, ageGroup, selectedProviders) {
  const countyAggregates = {};

  providers.forEach((provider) => {
    if (
      selectedProviders.length &&
      !selectedProviders.includes(provider.provider)
    )
      return;

    const ydata = provider[year];
    if (!ydata) return;

    let value = 0;

    if (ageGroup !== "all") {
      // When an age is selected, gender is ignored
      value = ydata.ageBreakdown[ageGroup] || 0;
    } else if (gender === "male" || gender === "female") {
      value = ydata[gender] || 0;
    } else {
      value = (ydata.male || 0) + (ydata.female || 0);
    }

    provider.counties.forEach((county) => {
      if (!countyAggregates[county]) {
        countyAggregates[county] = { total: 0, providers: {} };
      }
      countyAggregates[county].total += value;
      countyAggregates[county].providers[provider.provider] =
        (countyAggregates[county].providers[provider.provider] || 0) + value;
    });
  });

  return countyAggregates;
}

function renderCards() {
  const year = +yearSelect.value;
  const gender = genderSelect.value;
  const age = ageSelect.value;
  const selectedProviders = Array.from(providerSelect.selectedOptions).map(
    (opt) => opt.value
  );

  const breakdown = getProviderYearData(year, gender, age, selectedProviders);

  cardContainer.innerHTML = "";
  const sortedEntries = Object.entries(breakdown).sort(([aCounty], [bCounty]) =>
    aCounty.localeCompare(bCounty)
  );
  sortedEntries.forEach(([county, data]) => {
    const censusData = getCensusForAgeGroup(county, age);
    const censusLabel = getCensusLabel(age);
  
    const div = document.createElement("div");
    div.className = "county-card";
  
    const providerName = Object.keys(data.providers).join(", ");
    const totalServed = Object.values(data.providers).reduce((sum, val) => sum + val, 0);
  
    div.innerHTML = `
      <div class="provider-badge">${providerName}</div>
      <div class="county-name">${county}</div>
  
      <div class="demographics">Provider's District Total:</strong> ${totalServed}</div>
  
      <div class="census">
        <strong>U.S. County ${censusLabel}:</strong>
        <ul>
          <li>Total: ${censusData.total}</li>
          <li>Male: ${censusData.male}</li>
          <li>Female: ${censusData.female}</li>
        </ul>
        <em>Population for age group: ${censusData.total}</em>
      </div>
    `;
  
    cardContainer.appendChild(div);
  });
  
}

// Ensure only one dropdown is active on initial load
function enforceInitialFilterMode() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  genderSelect.disabled = mode !== "gender";
  ageSelect.disabled = mode !== "age";
}

function getCensusLabel(ageGroup) {
  switch (ageGroup) {
    case "12_and_younger":
      return "Census (≤12)";
    case "13":
    case "14":
      return `Census (age ${ageGroup})`;
    case "15":
    case "16":
    case "17":
      return `Census (age ${ageGroup})`;
    case "18_and_older":
      return "Census (≥18)";
    default:
      return "Census (ages 10–19)";
  }
}

function getCensusForAgeGroup(county, ageGroup) {
  switch (ageGroup) {
    case "12_and_younger":
    case "13":
    case "14":
      return getAge10to14TotalsByCounty(county);
    case "15":
    case "16":
    case "17":
    case "18_and_older":
      return getAge15to19TotalsByCounty(county);
    default:
      // If "all", return both combined
      const a = getAge10to14TotalsByCounty(county);
      const b = getAge15to19TotalsByCounty(county);
      return {
        total: a.total + b.total,
        male: a.male + b.male,
        female: a.female + b.female,
      };
  }
}

/**
 * Get the population totals for age group 10–14 for a specific county.
 * @param {string} countyName - The name of the county.
 * @returns {{ total: number, male: number, female: number }}
 */
function getAge10to14TotalsByCounty(countyName) {
  const county = countyData[countyName];
  const group = county?.age10_14 || {};

  return {
    total: group.total || 0,
    male: group.male || 0,
    female: group.female || 0,
  };
}

/**
 * Get the population totals for age group 15–19 for a specific county.
 * @param {string} countyName - The name of the county.
 * @returns {{ total: number, male: number, female: number }}
 */
function getAge15to19TotalsByCounty(countyName) {
  const county = countyData[countyName];
  const group = county?.age15_19 || {};

  return {
    total: group.total || 0,
    male: group.male || 0,
    female: group.female || 0,
  };
}

// QC Check of Census Population Totals
// const faulknerTeens = getAge10to14TotalsByCounty("Faulkner");
// console.log("Faulkner age 10–14:", faulknerTeens.total, "M:", faulknerTeens.male, "F:", faulknerTeens.female);
// const salineOlderTeens = getAge15to19TotalsByCounty("Saline");
// console.log("Saline age 15–19:", salineOlderTeens.total, "M:", salineOlderTeens.male, "F:", salineOlderTeens.female);

enforceInitialFilterMode();

yearSelect.addEventListener("change", renderCards);
genderSelect.addEventListener("change", renderCards);
ageSelect.addEventListener("change", renderCards);
providerSelect.addEventListener("change", renderCards);

renderCards();
