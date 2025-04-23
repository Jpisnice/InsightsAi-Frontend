import { SearchService } from './search';

// Define interfaces for our data structures
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
}

interface SearchMatch {
  entity: Person;
  quality: number;
  matchedString: string;
}

interface SearchResult {
  matches: SearchMatch[];
  query: {
    string: string;
    topN: number;
    minQuality: number;
  };
  meta: {
    entries: {
      queryDuration: number;
    };
  };
}

// Example data - replace with your actual data source
const largeDataset: Person[] = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  firstName: `User${i}`,
  lastName: `LastName${i % 100}`,
  email: `user${i}@example.com`,
  description: `This is a description for user ${i} with various keywords for testing search functionality`
}));

// Initialize search service
const searchService = new SearchService('./search-worker.js');

// Function to connect search to UI
function initializeSearch(): void {
  // Get search input element
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const resultsContainerElement = document.getElementById('search-results');
  const loadingIndicator = document.getElementById('loading-indicator');
  
  if (!searchInput || !resultsContainerElement || !loadingIndicator) {
    console.error('Required DOM elements not found');
    return;
  }
  
  // Create a non-null reference after validation
  const resultsContainer = resultsContainerElement;
  
  // Show loading indicator
  loadingIndicator.style.display = 'block';
  
  // Index the data
  searchService.indexData({ persons: largeDataset })
    .then(() => {
      // Hide loading indicator once indexing is complete
      loadingIndicator.style.display = 'none';
      console.log('Indexing complete, search is ready');
      
      // Set up search input handler
      searchInput.addEventListener('input', debounce(handleSearch, 250));
    })
    .catch(error => {
      console.error('Error indexing data:', error);
      loadingIndicator.style.display = 'none';
    });
  
  // Search handler function
  async function handleSearch(): Promise<void> {
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }
    
    try {
      const results = await searchService.search(query, 10, 0.3) as SearchResult;
      displayResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  }
  
  // Display search results in the UI
  function displayResults(results: SearchResult): void {
    resultsContainer.innerHTML = '';
    
    if (!results.matches || results.matches.length === 0) {
      resultsContainer.innerHTML = '<p>No results found</p>';
      return;
    }
    
    const resultsList = document.createElement('ul');
    resultsList.className = 'search-results-list';
    
    results.matches.forEach((match: SearchMatch) => {
      const listItem = document.createElement('li');
      const person = match.entity;
      const quality = Math.round(match.quality * 100);
      
      listItem.innerHTML = `
        <div class="result-item">
          <div class="result-name">${person.firstName} ${person.lastName}</div>
          <div class="result-email">${person.email}</div>
          <div class="result-quality">Match: ${quality}%</div>
        </div>
      `;
      
      resultsList.appendChild(listItem);
    });
    
    resultsContainer.appendChild(resultsList);
  }
}

// Utility function for debouncing search input
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);
