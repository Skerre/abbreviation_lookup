// Main application script for the UNDP Abbreviation Lookup Tool

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const searchInterfaceEl = document.getElementById('search-interface');
  const searchInputEl = document.getElementById('search-input');
  const searchButtonEl = document.getElementById('search-button');
  const showAllButtonEl = document.getElementById('show-all-button');
  const resultBoxEl = document.getElementById('result-box');
  const resultContentEl = document.getElementById('result-content');
  const modalEl = document.getElementById('modal');
  const abbreviationListEl = document.getElementById('abbreviation-list');
  const closeButtonEl = document.getElementById('close-button');
  const currentYearEl = document.getElementById('current-year');
  const infoLinkEl = document.getElementById('info-link');
  const infoModalEl = document.getElementById('info-modal');
  const infoCloseButtonEl = document.getElementById('info-close-button');

  // Set current year in the footer
  currentYearEl.textContent = new Date().getFullYear();

  // Initialize the application
  function init() {
    try {
      // Check if abbreviations data is available
      if (typeof abbreviationsData === 'undefined') {
        throw new Error('Abbreviations data not found!');
      }
      
      // Hide loading indicator and show search interface
      loadingEl.classList.add('hidden');
      searchInterfaceEl.classList.remove('hidden');
      
      // Set up event listeners
      setupEventListeners();
      
      // Disable right-click on the page to prevent context menu
      document.addEventListener('contextmenu', function(e) {
        if (modalEl && !modalEl.classList.contains('hidden')) {
          e.preventDefault();
        }
      });
    } catch (error) {
      showError(error.message);
    }
  }

  // Show error message
  function showError(message) {
    loadingEl.classList.add('hidden');
    errorEl.textContent = `Failed to load abbreviations: ${message}`;
    errorEl.classList.remove('hidden');
  }

  // Set up event listeners
  function setupEventListeners() {
    // Search button click
    searchButtonEl.addEventListener('click', handleSearch);
    
    // Enter key in search input
    searchInputEl.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        handleSearch();
      }
    });
    
    // Show all button click
    showAllButtonEl.addEventListener('click', toggleAllAbbreviations);
    
    // Close modal button click
    closeButtonEl.addEventListener('click', function() {
      modalEl.classList.add('hidden');
    });
    
    // Info link click
    infoLinkEl.addEventListener('click', function(e) {
      e.preventDefault();
      infoModalEl.classList.remove('hidden');
    });
    
    // Info close button click
    infoCloseButtonEl.addEventListener('click', function() {
      infoModalEl.classList.add('hidden');
    });
  }

  // Format definition
  function formatDefinition(value) {
    // Check if it's a URL and format it as a link if it is
    if (typeof value === 'string' && value.startsWith('http')) {
      return `<a href="${value}" target="_blank">${value}</a>`;
    } else {
      return value;
    }
  }

  // Handle search functionality
  function handleSearch() {
    const abbreviation = searchInputEl.value.trim().toUpperCase();
    if (abbreviation === '') return;
    
    if (abbreviation in abbreviationsData) {
      const values = abbreviationsData[abbreviation];
      let resultHTML = '';
      
      if (Array.isArray(values)) {
        values.forEach((value, index) => {
          const formattedValue = formatDefinition(value);
          resultHTML += `<div class="definition-item">${formattedValue}</div>`;
        });
      } else {
        resultHTML = `<div class="definition-item">${formatDefinition(values)}</div>`;
      }
      
      resultContentEl.innerHTML = resultHTML;
    } else {
      resultContentEl.textContent = 'No definition found.';
    }
    
    resultBoxEl.classList.remove('hidden');
  }

  // Toggle "Show All" modal
  function toggleAllAbbreviations() {
    // If modal is already visible, hide it
    if (!modalEl.classList.contains('hidden')) {
      modalEl.classList.add('hidden');
      return;
    }
    
    // Clear previous list
    abbreviationListEl.innerHTML = '';
    
    // Get the number of available abbreviations
    const abbreviationCount = Object.keys(abbreviationsData).length;
    
    // Update the modal header to include the count
    document.querySelector('.modal-header').textContent = `All Abbreviations (${abbreviationCount})`;
    
    // Create and append list items for all abbreviations
    Object.entries(abbreviationsData)
      .sort((a, b) => a[0].localeCompare(b[0])) // Sort alphabetically
      .forEach(([abbr, definition]) => {
        const li = document.createElement('li');
        li.className = 'abbreviation-item';
        
        const strong = document.createElement('strong');
        strong.textContent = `${abbr}:`;
        
        const definitionBox = document.createElement('div');
        definitionBox.className = 'definition-box';
        
        if (Array.isArray(definition)) {
          definition.forEach((def, index) => {
            const defItem = document.createElement('div');
            defItem.className = 'definition-item';
            
            // Check if it's a URL and format it as a link if it is
            if (typeof def === 'string' && def.startsWith('http')) {
              defItem.innerHTML = `<a href="${def}" target="_blank">${def}</a>`;
            } else {
              defItem.textContent = def;
            }
            
            definitionBox.appendChild(defItem);
          });
        } else {
          const defItem = document.createElement('div');
          defItem.className = 'definition-item';
          defItem.textContent = definition;
          definitionBox.appendChild(defItem);
        }
        
        li.appendChild(strong);
        li.appendChild(definitionBox);
        abbreviationListEl.appendChild(li);
      });
    
    // Show the modal
    modalEl.classList.remove('hidden');
  }

  // Initialize the application
  init();
});