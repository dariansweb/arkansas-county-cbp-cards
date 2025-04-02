const instructionsBtn = document.getElementById("toggleInstructions");
const instructionsDiv = document.getElementById("instructions");

instructionsBtn.addEventListener("click", () => {
  const isVisible = instructionsDiv.style.display === "block";
  instructionsDiv.style.display = isVisible ? "none" : "block";
  instructionsBtn.textContent = isVisible ? "Show Instructions" : "Hide Instructions";
});


const filterRadios = document.querySelectorAll('input[name="mode"]');
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");

// Toggle gender/age dropdowns
filterRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    genderSelect.disabled = mode !== "gender";
    ageSelect.disabled = mode !== "age";
  });
});

// Reset everything to default state and re-render
resetBtn.addEventListener("click", () => {
  // Reset year
  yearSelect.selectedIndex = 0;

  // Reset filter mode to gender
  document.querySelector('input[value="gender"]').checked = true;
  genderSelect.disabled = false;
  ageSelect.disabled = true;

  // Reset dropdowns
  genderSelect.value = "total";
  ageSelect.value = "all";

  // Select all providers
  Array.from(providerSelect.options).forEach((opt) => (opt.selected = true));

  renderCards();
});
