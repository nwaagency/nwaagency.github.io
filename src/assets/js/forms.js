/**
 * Nexora Web Agency - Quote Form Logic
 * Supports:
 * - 3-step navigation + progress indicators
 * - Step 1 validation: at least one service selected
 * - Step 2 baseline budget calculation from selected services
 * - Target slider sync + painted progress track
 * - Custom proposal mode with min/max validation
 * - Hidden Netlify field sync: budget_min, budget_max, budget_target
 */

document.addEventListener('DOMContentLoaded', () => {
  const quoteForm = document.getElementById('quote-form');
  if (!quoteForm) return;

  // -----------------------------
  // Core Step UI
  // -----------------------------
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const indicators = Array.from(document.querySelectorAll('.progress-step'));
  const nextBtns = Array.from(document.querySelectorAll('.btn-next'));
  const prevBtns = Array.from(document.querySelectorAll('.btn-prev'));
  const formContainer = document.querySelector('.form-container');

  let currentStep = 0;

  // -----------------------------
  // Step 1 / Budget Inputs
  // -----------------------------
  const checkboxes = Array.from(document.querySelectorAll('input[name="services"]'));

  // -----------------------------
  // Step 2 Elements
  // -----------------------------
  const slider = document.getElementById('budgetSlider');
  const rangeDisplay = document.getElementById('budget-range-display');
  const targetDisplay = document.getElementById('slider-value-display');
  const customNotice = document.getElementById('custom-price-notice');

  const modeRadios = Array.from(document.querySelectorAll('input[name="budget_mode"]'));
  const sliderPanel = document.getElementById('budget-slider-panel');
  const customPanel = document.getElementById('budget-custom-panel');

  const customMin = document.getElementById('customBudgetMin');
  const customMax = document.getElementById('customBudgetMax');

  // -----------------------------
  // Hidden Netlify Fields
  // -----------------------------
  const budgetMinInput = ensureHiddenInput(quoteForm, 'budget_min');
  const budgetMaxInput = ensureHiddenInput(quoteForm, 'budget_max');
  const budgetTargetInput = ensureHiddenInput(quoteForm, 'budget_target');

  function ensureHiddenInput(form, name) {
    let el = form.querySelector(`input[type="hidden"][name="${name}"]`);
    if (!el) {
      el = document.createElement('input');
      el.type = 'hidden';
      el.name = name;
      form.appendChild(el);
    }
    return el;
  }

  function formatZAR(num) {
    const safe = Number.isFinite(num) ? num : 0;
    return 'R' + safe.toLocaleString('en-ZA');
  }

  function scrollToFormTop() {
    if (!formContainer) return;
    window.scrollTo({
      top: formContainer.offsetTop - 100,
      behavior: 'smooth',
    });
  }

  // -----------------------------
  // Mode Helpers
  // -----------------------------
  function getMode() {
    const checked = modeRadios.find((radio) => radio.checked);
    return checked ? checked.value : 'target';
  }

  function setBudgetPanels() {
    const isCustom = getMode() === 'custom';

    if (sliderPanel) sliderPanel.style.display = isCustom ? 'none' : 'block';
    if (customPanel) customPanel.style.display = isCustom ? 'block' : 'none';
    if (slider) slider.disabled = isCustom;

    if (isCustom) {
      budgetTargetInput.value = '';
    } else {
      syncSliderTarget();
    }
  }

  function syncCustomRangeToHidden() {
    if (getMode() !== 'custom') return;

    const minVal = parseInt(customMin?.value || '', 10);
    const maxVal = parseInt(customMax?.value || '', 10);

    budgetMinInput.value = Number.isFinite(minVal) ? String(minVal) : '';
    budgetMaxInput.value = Number.isFinite(maxVal) ? String(maxVal) : '';

    if (Number.isFinite(minVal) && Number.isFinite(maxVal) && maxVal >= minVal) {
      budgetTargetInput.value = String(Math.round((minVal + maxVal) / 2));
    } else {
      budgetTargetInput.value = '';
    }
  }

  // -----------------------------
  // Budget Calculation
  // -----------------------------
  function getSelectedServiceStats() {
    let minTotal = 0;
    let maxTotal = 0;
    let hasCustom = false;
    let hasSelection = false;

    checkboxes.forEach((cb) => {
      if (!cb.checked) return;

      hasSelection = true;

      if (cb.dataset.custom === 'true') hasCustom = true;
      if (cb.dataset.min) minTotal += parseInt(cb.dataset.min, 10);
      if (cb.dataset.max) maxTotal += parseInt(cb.dataset.max, 10);
    });

    // Backward-compatible fallback behavior
    if (!hasSelection) {
      minTotal = 500;
      maxTotal = 15000;
    } else if (minTotal === 0 && maxTotal === 0 && hasCustom) {
      minTotal = 1500;
      maxTotal = 50000;
    } else if (hasCustom) {
      maxTotal += 25000;
    }

    if (maxTotal < minTotal) maxTotal = minTotal;

    return { minTotal, maxTotal, hasCustom, hasSelection };
  }

  function roundToStep(value, step) {
    if (!step || step <= 0) return Math.round(value);
    return Math.round(value / step) * step;
  }

  function paintSliderProgress() {
    if (!slider) return;

    const min = parseInt(slider.min, 10) || 0;
    const max = parseInt(slider.max, 10) || 100;
    const val = parseInt(slider.value, 10) || 0;
    const divisor = max - min || 1;
    const percent = ((val - min) / divisor) * 100;

    slider.style.background = `linear-gradient(
      90deg,
      var(--color-primary-accent) 0%,
      var(--color-primary-accent) ${percent}%,
      rgba(187, 134, 252, 0.28) ${percent}%,
      rgba(187, 134, 252, 0.28) 100%
    )`;
  }

  function syncSliderTarget() {
    if (!slider || !targetDisplay) return;

    const val = parseInt(slider.value, 10) || 0;
    targetDisplay.textContent = formatZAR(val);
    budgetTargetInput.value = String(val);
    paintSliderProgress();
  }

  function updateBudgetUI() {
    if (!slider || !rangeDisplay) return;

    const { minTotal, maxTotal, hasCustom } = getSelectedServiceStats();

    rangeDisplay.textContent = `${formatZAR(minTotal)} - ${formatZAR(maxTotal)}`;

    if (customMin) customMin.placeholder = formatZAR(minTotal);
    if (customMax) customMax.placeholder = formatZAR(maxTotal);
    if (customNotice) customNotice.style.display = hasCustom ? 'block' : 'none';

    budgetMinInput.value = String(minTotal);
    budgetMaxInput.value = String(maxTotal);

    slider.min = String(minTotal);
    slider.max = String(maxTotal);

    const range = maxTotal - minTotal;
    const step = range > 20000 ? 250 : 50;
    slider.step = String(step);

    const mid = minTotal + range / 2;
    const roundedMid = roundToStep(mid, step);
    const clamped = Math.min(maxTotal, Math.max(minTotal, roundedMid));

    slider.value = String(clamped);

    if (getMode() === 'target') {
      syncSliderTarget();
    } else {
      paintSliderProgress();
    }
  }

  // -----------------------------
  // Step Management
  // -----------------------------
  function updateFormSteps() {
    steps.forEach((stepEl, index) => {
      stepEl.classList.toggle('active', index === currentStep);
    });

    indicators.forEach((indicator, index) => {
      indicator.classList.remove('active', 'completed');
      if (index < currentStep) {
        indicator.classList.add('completed');
      } else if (index === currentStep) {
        indicator.classList.add('active');
      }
    });

    if (currentStep === 1) {
      updateBudgetUI();
      setBudgetPanels();
    }
  }

  function validateStep1() {
    const anySelected = checkboxes.some((cb) => cb.checked);
    if (!anySelected) {
      alert('Please select at least one service to continue.');
      return false;
    }
    return true;
  }

  function validateStep2() {
    if (getMode() !== 'custom') return true;

    const minVal = parseInt(customMin?.value || '', 10);
    const maxVal = parseInt(customMax?.value || '', 10);

    if (!Number.isFinite(minVal) || !Number.isFinite(maxVal) || minVal < 0 || maxVal < 0) {
      alert('Please enter a valid budget minimum and maximum.');
      return false;
    }

    if (maxVal < minVal) {
      alert('Your budget maximum must be greater than or equal to your minimum.');
      return false;
    }

    budgetMinInput.value = String(minVal);
    budgetMaxInput.value = String(maxVal);
    budgetTargetInput.value = String(Math.round((minVal + maxVal) / 2));

    return true;
  }

  // -----------------------------
  // Navigation Events
  // -----------------------------
  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep === 0 && !validateStep1()) return;
      if (currentStep === 1 && !validateStep2()) return;

      if (currentStep < steps.length - 1) {
        currentStep += 1;
        updateFormSteps();
        scrollToFormTop();
      }
    });
  });

  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep -= 1;
        updateFormSteps();
        scrollToFormTop();
      }
    });
  });

  // -----------------------------
  // Sync Events
  // -----------------------------
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      updateBudgetUI();
    });
  });

  if (slider) {
    slider.addEventListener('input', syncSliderTarget);
  }

  modeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      setBudgetPanels();
      updateBudgetUI();
      syncCustomRangeToHidden();
    });
  });

  if (customMin) {
    customMin.addEventListener('input', syncCustomRangeToHidden);
  }

  if (customMax) {
    customMax.addEventListener('input', syncCustomRangeToHidden);
  }

  // -----------------------------
  // Initial State
  // -----------------------------
  setBudgetPanels();
  updateFormSteps();
});