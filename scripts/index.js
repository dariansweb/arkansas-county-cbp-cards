// 🧭 Instructions Toggle
const instructionsBtn = document.getElementById("toggleInstructions");
const instructionsDiv = document.getElementById("instructions");

instructionsBtn.addEventListener("click", () => {
  const isVisible = instructionsDiv.style.display === "block";
  instructionsDiv.style.display = isVisible ? "none" : "block";
  instructionsBtn.textContent = isVisible ? "Show Instructions" : "Hide Instructions";
});

// 🌀 Filter Logic
const modeRadios = document.querySelectorAll('input[name="mode"]');
const ageSelect = document.getElementById("ageSelect");
const genderSelect = document.getElementById("genderSelect");

// Listen for filter mode changes (radio buttons)
modeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;

    if (mode === "age") {
      ageSelect.disabled = false;
      genderSelect.disabled = true;
    } else {
      ageSelect.disabled = true;
      genderSelect.disabled = false;
    }

    renderCards(); // Refresh UI with new filter state
  });
});

// ♻️ Reset Button Logic
const resetBtn = document.getElementById("resetBtn");
const yearSelect = document.getElementById("yearSelect");
const providerSelect = document.getElementById("providerSelect");

resetBtn.addEventListener("click", () => {
  window.location.reload();
});


