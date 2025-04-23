import * as fuzzySearch from '@m31coding/fuzzy-search';

// Declare type for self in web worker context
declare const self: Worker & {
  fuzzySearch: typeof fuzzySearch;
};

self.fuzzySearch = fuzzySearch;

/**
 * Create searcher with the same configuration as the main thread
 */
function createSearcher() {
  return fuzzySearch.SearcherFactory.createDefaultSearcher();

  // If your dataset contains non-latin characters, build the searcher in the following way instead:
  /* const config = fuzzySearch.Config.createDefaultConfig();
    config.normalizerConfig.allowCharacter = (c) => true;
    return fuzzySearch.SearcherFactory.createSearcher(config); */
}

// Define interfaces for data types
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface Document {
  id: number;
  title?: string;
  content?: string;
  description?: string;
  [key: string]: any;
}

interface IndexingMeta {
  allEntries: any;
  [key: string]: any;
}

onmessage = async (e: MessageEvent) => {
  console.log('Worker received data to index');
  const searcher = createSearcher();
  
  let indexingMeta: IndexingMeta;
  
  // Check for different data formats
  if (e.data.persons) {
    indexingMeta = indexPersons(searcher, e.data.persons);
  } else if (e.data.documents) {
    indexingMeta = indexDocuments(searcher, e.data.documents);
  } else if (e.data.items) {
    indexingMeta = indexGenericItems(searcher, e.data.items, e.data.idField, e.data.textFields);
  } else {
    console.error('Unknown data format received in worker');
    postMessage({ error: 'Unknown data format' });
    return;
  }
  
  // Create memento to transfer the indexed data back to main thread
  const memento = new fuzzySearch.Memento();
  searcher.save(memento);
  
  // Send the indexed data back to the main thread
  postMessage({
    mementoObjects: memento.objects,
    indexingMeta: indexingMeta.allEntries
  });
};

function indexPersons(searcher: any, persons: Person[]): IndexingMeta {
  console.log(`Indexing ${persons.length} persons`);
  const indexingMeta = searcher.indexEntities(
    persons,
    (person: Person) => person.id,
    (person: Person) => [person.firstName, person.lastName, `${person.firstName} ${person.lastName}`]
  );
  console.log('Finished indexing persons');
  return indexingMeta;
}

function indexDocuments(searcher: any, documents: Document[]): IndexingMeta {
  console.log(`Indexing ${documents.length} documents`);
  const indexingMeta = searcher.indexEntities(
    documents,
    (doc: Document) => doc.id,
    (doc: Document) => [doc.title, doc.content, doc.description].filter(Boolean)
  );
  console.log('Finished indexing documents');
  return indexingMeta;
}

function indexGenericItems(
  searcher: any,
  items: any[],
  idField: string = 'id',
  textFields: string[] = ['text']
): IndexingMeta {
  console.log(`Indexing ${items.length} generic items`);
  const indexingMeta = searcher.indexEntities(
    items,
    (item: any) => item[idField],
    (item: any) => textFields.map(field => item[field]).filter(Boolean)
  );
  console.log('Finished indexing generic items');
  return indexingMeta;
}