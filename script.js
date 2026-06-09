/* -------------------------------------------------------------- ELEMENTS ------------------------------------------------------ */
const steps = document.querySelectorAll(".checkout-step");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const countryInput = document.getElementById("country");
const cityInput = document.getElementById("city");
const streetInput = document.getElementById("street");
const zipInput = document.getElementById("zip");

const cardNameInput = document.getElementById("cardName");
const cardNumberInput = document.getElementById("cardNumber");
const expiryInput = document.getElementById("expiry");
const cvvInput = document.getElementById("cvv");

const toStep2Btn = document.getElementById("toStep2");
const toStep3Btn = document.getElementById("toStep3");
const back1Btn = document.getElementById("back1");
const back2Btn = document.getElementById("back2");
const payBtn = document.getElementById("payBtn");

const checkoutWrapper = document.getElementById("checkoutWrapper");
const successScreen = document.getElementById("successMessage");
const summary = document.querySelector(".summary");
const progressFill = document.querySelector(".progress-fill");

/* --------------------------------------------------------- STEP CONTROL ------------------------------------------------------- */
function updateProgress(index) {
  const percent = ((index + 1) / steps.length) * 100;
  progressFill.style.width = percent + "%";
}

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.remove("active", "completed");
    if (i < index) step.classList.add("completed");
    if (i === index) step.classList.add("active");

    const content = step.querySelector(".step-content");
    if (content) {
      content.style.display = (i === index) ? "block" : "none";
      if (i === index) {
        const firstInput = content.querySelector("input");
        if (firstInput) firstInput.focus();
      }
    }
  });
  updateProgress(index);
}

/* --------------------------------------------------------------------------- ERROR HANDLING ------------------------------------------- */
function showError(input, message) {
  const error = input.nextElementSibling;
  input.classList.add("error");
  if (error) {
    error.textContent = message;
    error.style.display = "block";
  }
}

function clearError(input) {
  const error = input.nextElementSibling;
  input.classList.remove("error");
  if (error) error.style.display = "none";
}

/* ---------------------------------------------------------------------------- VALIDATION STEP 1 --------------------------------------- */
function validateStep1() {
  let valid = true;

  if (!nameInput.value.trim()) {
    showError(nameInput, "Name is required");
    valid = false;
  } else clearError(nameInput);

  if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    showError(emailInput, "Enter a valid email");
    valid = false;
  } else clearError(emailInput);

  if (!phoneInput.value.trim() || phoneInput.value.replace(/\D/g, "").length < 8) {
    showError(phoneInput, "Enter a valid phone number");
    valid = false;
  } else clearError(phoneInput);

  return valid;
}

/* ---------------------------------------------------------------- VALIDATION STEP 2 -------------------------------------------------- */
function validateStep2() {
  let valid = true;

  if (!countryInput.value.trim()) {
    showError(countryInput, "Country required");
    valid = false;
  } else clearError(countryInput);

  if (!cityInput.value.trim()) {
    showError(cityInput, "City required");
    valid = false;
  } else clearError(cityInput);

  if (!streetInput.value.trim()) {
    showError(streetInput, "Street required");
    valid = false;
  } else clearError(streetInput);

  if (!zipInput.value.trim()) {
    showError(zipInput, "ZIP required");
    valid = false;
  } else clearError(zipInput);

  return valid;
}

/* ---------------------------------------------------------------- VALIDATION STEP 3 -------------------------------------------------- */
function validatePayment() {
  let valid = true;

  if (!cardNameInput.value.trim()) {
    showError(cardNameInput, "Card holder name required");
    valid = false;
  } else clearError(cardNameInput);

  if (!cardNumberInput.value.replace(/\s/g, "").match(/^\d{16}$/)) {
    showError(cardNumberInput, "Card number must be 16 digits");
    valid = false;
  } else clearError(cardNumberInput);

  if (!expiryInput.value.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
    showError(expiryInput, "Enter valid expiry MM/YY");
    valid = false;
  } else clearError(expiryInput);

  if (!cvvInput.value.match(/^\d{3}$/)) {
    showError(cvvInput, "CVV must be 3 digits");
    valid = false;
  } else clearError(cvvInput);

  return valid;
}

/* ---------------------------------------------------------------- BUTTON EVENTS ------------------------------------------------------- */
toStep2Btn.addEventListener("click", () => {
  if (!validateStep1()) return;
  showStep(1);
});

toStep3Btn.addEventListener("click", () => {
  if (!validateStep2()) return;
  showStep(2);
});

back1Btn.addEventListener("click", () => showStep(0));
back2Btn.addEventListener("click", () => showStep(1));

/* ---------------------------------------------------------------- CARD FORMATTING ----------------------------------------------------- */
cardNumberInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.match(/.{1,4}/g)?.join(" ") || value;
  e.target.value = value;
});

expiryInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  }
  e.target.value = value;
});

/* -------------------------------------------------------------- PAYMENT ------------------------------------------------------- */
payBtn.addEventListener("click", () => {
  if (!validatePayment()) return;

  payBtn.disabled = true;
  payBtn.classList.add("loading");
  payBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

  setTimeout(() => {
    checkoutWrapper.style.display = "none";
    summary.style.display = "none";
    successScreen.style.display = "flex";

    // Confetti effect
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, 2000);
});

/* -------------------------------------------------------------------- INIT ----------------------------------------------------------- */
showStep(0);
