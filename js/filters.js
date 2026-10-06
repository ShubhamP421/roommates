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
  const minRatingSelect = document.getElementById('filter-min-rating');
  const sortSelect = document.getElementById('sort-select');
  const resultsCountElem = document.getElementById('results-count');
  const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
  const filterSidebar = document.getElementById('filter-sidebar');
  const applyFiltersBtn = document.getElementById('apply-filters-btn');

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
      const isOpen = filterSidebar.classList.toggle('mobile-open');
      mobileFilterToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function readFilterState() {
    const selectedType = document.querySelector('input[name="filter-type"]:checked');
    const selectedGender = document.querySelector('input[name="filter-gender"]:checked');

    return {
      location: locationInput ? locationInput.value.trim().toLowerCase() : '',
      minRent: minRentInput && minRentInput.value ? Number(minRentInput.value) : 0,
      maxRent: maxRentInput && maxRentInput.value ? Number(maxRentInput.value) : Infinity,
      type: selectedType ? selectedType.value : 'All',
      gender: selectedGender ? selectedGender.value : 'Any',
      minRating: minRatingSelect ? Number(minRatingSelect.value) : 0,
      facilities: Array.from(document.querySelectorAll('input[name="filter-facility"]:checked')).map(input => input.value),
      available: Boolean(document.getElementById('filter-available')?.checked),
      sort: sortSelect ? sortSelect.value : 'recommended'
    };
  }

  let appliedFilters = readFilterState();

  // Apply filters function
  function applyFilters(filters = appliedFilters) {
    let filtered = [...PROPERTIES_DATA];

    // 1. Location Search
    const locValue = filters.location;
    if (locValue) {
      filtered = filtered.filter(p => [
        p.location, p.area, p.city, p.title, p.description, p.type,
        ...(Array.isArray(p.facilities) ? p.facilities : [])
      ].some(value => String(value || '').toLowerCase().includes(locValue)));
    }

    // 2. Minimum Rent
    if (filters.minRent > 0) {
      filtered = filtered.filter(p => p.rent >= filters.minRent);
    }

    // 3. Maximum Rent
    if (filters.maxRent < Infinity && filters.maxRent > 0) {
      filtered = filtered.filter(p => p.rent <= filters.maxRent);
    }

    // 4. Accommodation Type
    if (filters.type !== 'All') {
      filtered = filtered.filter(p => String(p.type || '').toLowerCase() === filters.type.toLowerCase());
    }

    // 5. Gender Preference
    if (filters.gender !== 'Any') {
      filtered = filtered.filter(p => {
        const gender = String(p.gender || p.gender_preference || 'Any').toLowerCase();
        return gender === 'any' || gender === filters.gender.toLowerCase();
      });
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(p => Number(p.rating) >= filters.minRating);
    }

    // 6. Facilities (Must include all checked facilities)
    if (filters.facilities.length > 0) {
      filtered = filtered.filter(p => 
        filters.facilities.every(fac => Array.isArray(p.facilities) && p.facilities.includes(fac))
      );
    }

    // 7. Availability Filter
    if (filters.available) {
      filtered = filtered.filter(p => p.available);
    }

    // 8. Sorting
    const sortVal = filters.sort;
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

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      appliedFilters = readFilterState();
      applyFilters(appliedFilters);
      filterSidebar?.classList.remove('mobile-open');
      mobileFilterToggle?.setAttribute('aria-expanded', 'false');
    });
  }

  const availChk = document.getElementById('filter-available');
  document.addEventListener('properties:updated', () => applyFilters(appliedFilters));

  // Global reset helper
  window.resetAllFilters = function() {
    if (locationInput) locationInput.value = '';
    if (minRentInput) minRentInput.value = '';
    if (maxRentInput) maxRentInput.value = '';
    if (minRatingSelect) minRatingSelect.value = '0';
    
    const defaultType = document.querySelector('input[name="filter-type"][value="All"]');
    if (defaultType) defaultType.checked = true;

    const defaultGender = document.querySelector('input[name="filter-gender"][value="Any"]');
    if (defaultGender) defaultGender.checked = true;

    document.querySelectorAll('input[name="filter-facility"]').forEach(c => c.checked = false);
    if (availChk) availChk.checked = false;
    if (sortSelect) sortSelect.value = 'recommended';

    appliedFilters = readFilterState();
    applyFilters(appliedFilters);
  };

  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) resetBtn.addEventListener('click', window.resetAllFilters);

  // Initial Filter Run
  applyFilters(appliedFilters);
});
