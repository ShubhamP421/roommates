/* RoomMate - Filter & Search Logic for properties.html */

document.addEventListener('DOMContentLoaded', () => {
  const propertiesGrid = document.getElementById('properties-results-grid');
  if (!propertiesGrid) return; // Only execute on properties.html page

  // Parse URL Parameters if search was triggered from hero search box
  const urlParams = new URLSearchParams(window.location.search);
  const paramLocation = urlParams.get('location') || '';
  const paramMaxRent = urlParams.get('maxRent') || '';
  const paramType = urlParams.get('type') || '';

  // Input elements
  const locationInput = document.getElementById('filter-location');
  const minRentInput = document.getElementById('filter-min-rent');
  const maxRentInput = document.getElementById('filter-max-rent');
  const sortSelect = document.getElementById('sort-select');
  const resultsCountElem = document.getElementById('results-count');
  const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
  const filterSidebar = document.getElementById('filter-sidebar');

  // Pre-fill parameters if present
  if (locationInput && paramLocation) locationInput.value = paramLocation;
  if (maxRentInput && paramMaxRent) maxRentInput.value = paramMaxRent;
  if (paramType) {
    const typeRadio = document.querySelector(`input[name="filter-type"][value="${paramType}"]`);
    if (typeRadio) typeRadio.checked = true;
  }

  // Mobile Filter Sidebar Toggle
  if (mobileFilterToggle && filterSidebar) {
    mobileFilterToggle.addEventListener('click', () => {
      filterSidebar.classList.toggle('mobile-open');
    });
  }

  // Apply filters function
  function applyFilters() {
    let filtered = [...PROPERTIES_DATA];

    // 1. Location Search
    const locValue = locationInput ? locationInput.value.trim().toLowerCase() : '';
    if (locValue) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(locValue) ||
        p.area.toLowerCase().includes(locValue) ||
        p.city.toLowerCase().includes(locValue) ||
        p.title.toLowerCase().includes(locValue)
      );
    }

    // 2. Minimum Rent
    const minRent = minRentInput && minRentInput.value ? Number(minRentInput.value) : 0;
    if (minRent > 0) {
      filtered = filtered.filter(p => p.rent >= minRent);
    }

    // 3. Maximum Rent
    const maxRent = maxRentInput && maxRentInput.value ? Number(maxRentInput.value) : Infinity;
    if (maxRent < Infinity && maxRent > 0) {
      filtered = filtered.filter(p => p.rent <= maxRent);
    }

    // 4. Accommodation Type
    const selectedType = document.querySelector('input[name="filter-type"]:checked');
    if (selectedType && selectedType.value !== 'All') {
      filtered = filtered.filter(p => p.type.toLowerCase() === selectedType.value.toLowerCase());
    }

    // 5. Gender Preference
    const selectedGender = document.querySelector('input[name="filter-gender"]:checked');
    if (selectedGender && selectedGender.value !== 'Any') {
      filtered = filtered.filter(p => p.gender === 'Any' || p.gender.toLowerCase() === selectedGender.value.toLowerCase());
    }

    // 6. Facilities (Must include all checked facilities)
    const checkedFacilities = Array.from(document.querySelectorAll('input[name="filter-facility"]:checked')).map(c => c.value);
    if (checkedFacilities.length > 0) {
      filtered = filtered.filter(p => 
        checkedFacilities.every(fac => p.facilities.includes(fac))
      );
    }

    // 7. Availability Filter
    const availableOnlyCheckbox = document.getElementById('filter-available');
    if (availableOnlyCheckbox && availableOnlyCheckbox.checked) {
      filtered = filtered.filter(p => p.available);
    }

    // 8. Sorting
    const sortVal = sortSelect ? sortSelect.value : 'recommended';
    if (sortVal === 'price-low') {
      filtered.sort((a, b) => a.rent - b.rent);
    } else if (sortVal === 'price-high') {
      filtered.sort((a, b) => b.rent - a.rent);
    } else if (sortVal === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // Render results
    renderResults(filtered);
  }

  function renderResults(properties) {
    if (resultsCountElem) {
      resultsCountElem.textContent = `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} found`;
    }

    if (properties.length === 0) {
      propertiesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="ri-search-eye-line empty-icon"></i>
          <h3 class="empty-title">No properties match your filters</h3>
          <p class="empty-desc">Try relaxing your rent budget, location, or facility options to see more student stays.</p>
          <button class="btn btn-primary btn-sm" onclick="resetAllFilters()"><i class="ri-refresh-line"></i> Reset All Filters</button>
        </div>
      `;
      return;
    }

    propertiesGrid.innerHTML = properties.map(p => createPropertyCardHtml(p)).join('');
  }

  // Attach event listeners to all filter inputs
  if (locationInput) locationInput.addEventListener('input', applyFilters);
  if (minRentInput) minRentInput.addEventListener('input', applyFilters);
  if (maxRentInput) maxRentInput.addEventListener('input', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  document.querySelectorAll('input[name="filter-type"]').forEach(r => r.addEventListener('change', applyFilters));
  document.querySelectorAll('input[name="filter-gender"]').forEach(r => r.addEventListener('change', applyFilters));
  document.querySelectorAll('input[name="filter-facility"]').forEach(c => c.addEventListener('change', applyFilters));

  const availChk = document.getElementById('filter-available');
  if (availChk) availChk.addEventListener('change', applyFilters);

  // Global reset helper
  window.resetAllFilters = function() {
    if (locationInput) locationInput.value = '';
    if (minRentInput) minRentInput.value = '';
    if (maxRentInput) maxRentInput.value = '';
    
    const defaultType = document.querySelector('input[name="filter-type"][value="All"]');
    if (defaultType) defaultType.checked = true;

    const defaultGender = document.querySelector('input[name="filter-gender"][value="Any"]');
    if (defaultGender) defaultGender.checked = true;

    document.querySelectorAll('input[name="filter-facility"]').forEach(c => c.checked = false);
    if (availChk) availChk.checked = false;
    if (sortSelect) sortSelect.value = 'recommended';

    applyFilters();
  };

  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) resetBtn.addEventListener('click', window.resetAllFilters);

  // Initial Filter Run
  applyFilters();
});
