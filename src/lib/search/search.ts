/**
 * Implements fuzzy search functionality with worker thread for large datasets.
 */

import * as fuzzySearch from '@m31coding/fuzzy-search';

/**
 * Make sure to build the searcher in the exact same way in both the main thread and the worker thread.
 */
function createSearcher() {
  return fuzzySearch.SearcherFactory.createDefaultSearcher();

  // If your dataset contains non-latin characters, build the searcher in the following way instead:
  /* const config = fuzzySearch.Config.createDefaultConfig();
    config.normalizerConfig.allowCharacter = (c) => true;
    return fuzzySearch.SearcherFactory.createSearcher(config); */
}

export class SearchService {
  private searcher: any = null;
  private worker: Worker;
  private isReady: boolean = false;
  private readyCallbacks: (() => void)[] = [];
  
  constructor(workerPath = './search-worker.js') {
    this.worker = new Worker(workerPath);
    this.setupWorkerListeners();
  }

  /**
   * Sets up listeners for worker messages
   */
  private setupWorkerListeners() {
    this.worker.onmessage = (e) => {
      console.log('Received data from worker');
      const memento = new fuzzySearch.Memento(e.data.mementoObjects);
      this.searcher = createSearcher();
      this.searcher.load(memento);
      
      console.log('Searcher is ready');
      this.isReady = true;
      
      // Call all callbacks waiting for searcher to be ready
      this.readyCallbacks.forEach(callback => callback());
      this.readyCallbacks = [];
    };
  }

  /**
   * Indexes the provided data in the worker thread
   */
  public indexData(data: any) {
    this.isReady = false;
    this.worker.postMessage(data);
    return new Promise<void>((resolve) => {
      this.readyCallbacks.push(resolve);
    });
  }

  /**
   * Performs a search with the given query string
   * @param queryString The string to search for
   * @param topN Maximum number of results to return
   * @param minQuality Minimum quality threshold for matches (0-1)
   * @returns Promise with search results
   */
  public search(queryString: string, topN: number = 10, minQuality: number = 0.3): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        this.readyCallbacks.push(() => {
          resolve(this.performSearch(queryString, topN, minQuality));
        });
      } else {
        resolve(this.performSearch(queryString, topN, minQuality));
      }
    });
  }

  private performSearch(queryString: string, topN: number = 10, minQuality: number = 0.3) {
    const query = new fuzzySearch.Query(queryString, topN, minQuality);
    return this.searcher.getMatches(query);
  }
}

// Example usage - you can remove this in production
const persons = [
  { id: 23501, firstName: 'Alice', lastName: 'King' },
  { id: 99234, firstName: 'Bob', lastName: 'Bishop' },
  { id: 5823, firstName: 'Carol', lastName: 'Queen' },
  { id: 11923, firstName: 'Charlie', lastName: 'Rook' }
];

// Example of how to use the SearchService
// const searchService = new SearchService();
// searchService.indexData({ persons: persons }).then(() => {
//   searchService.search('alice kign').then(result => {
//     console.log('Search results:', result);
//   });
// });