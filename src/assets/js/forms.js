/**
 * Nexora Web Agency - Multi-Step Form Logic
 * Handles the DOM manipulation for the 3-step Quote Request form.
 */

document.addEventListener('DOMContentLoaded', () => {
  const quoteForm = document.getElementById('quote-form');
  
  if (!quoteForm) return; // Exit if not on the quote page

  const steps = document.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('.progress-step');
  const nextBtns = document.querySelectorAll('.btn-next');
  const prevBtns = document.querySelectorAll('.btn-prev');
  
  let currentStep = 0;

  // Function to update the UI based on the current step
  function updateFormSteps() {
    // 1. Toggle visibility of form sections
    steps.forEach((step, index) => {
      if (index === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // 2. Update progress indicators
    indicators.forEach((indicator, index) => {
      // Remove all active/completed classes first
      indicator.classList.remove('active', 'completed');
      
      if (index < currentStep) {
        indicator.classList.add('completed'); // Past steps
      } else if (index === currentStep) {
        indicator.classList.add('active'); // Current step
      }
    });
  }

  // Handle "Next" Button Clicks
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Basic Validation: Ensure required radio buttons in Step 2 are checked before proceeding
      if (currentStep === 1) {
        const budgetSelected = document.querySelector('input[name="budget"]:checked');
        if (!budgetSelected) {
          alert('Please select an estimated budget to continue.');
          return;
        }
      }

      if (currentStep < steps.length - 1) {
        currentStep++;
        updateFormSteps();
        window.scrollTo({ top: document.querySelector('.form-container').offsetTop - 100, behavior: 'smooth' });
      }
    });
  });

  // Handle "Back" Button Clicks
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateFormSteps();
        window.scrollTo({ top: document.querySelector('.form-container').offsetTop - 100, behavior: 'smooth' });
      }
    });
  });

  // Initialize the form view
  updateFormSteps();
});