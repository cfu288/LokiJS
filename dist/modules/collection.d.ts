import { CloneMethods } from "../utils/clone";
import { DynamicView } from "./dynamic-view";
import { ChangeOps } from "./sylvie";
import { SylvieEventEmitter } from "./sylvie-event-emitter";
import { ResultSet } from "./result-set";
import { ExactIndex } from "./index/exact-index";
import { UniqueIndex } from "./index/unique-index";
export type ChainTransform = string | {
    type: string;
    value?: any;
    mapFunction?: (_: any) => any;
    reduceFunction?: (values: any[]) => any;
}[];
interface CollectionOptions {
    unique: string | string[];
    exact: string[];
    adaptiveBinaryIndices: boolean;
    transactional: boolean;
    cloneObjects: boolean;
    cloneMethod: CloneMethods;
    asyncListeners: boolean;
    disableMeta: boolean;
    disableChangesApi: boolean;
    disableDeltaChangesApi: boolean;
    autoupdate: boolean;
    serializableIndices: boolean;
    disableFreeze: boolean;
    ttl: number;
    ttlInterval: number;
    indices: string | string[];
    clone: boolean;
}
export type CollectionDocument = object & Record<string, any> & CollectionDocumentBase;
export interface CollectionDocumentBase {
    meta?: CollectionDocumentMeta;
    $loki?: number;
}
export interface CollectionDocumentMeta {
    created?: number;
    revision?: number;
    updated?: number;
}
/**
 * Collection class that handles documents of same type
 * @constructor Collection
 * @implements SylvieEventEmitter
 * @param {string} name - collection name
 * @param {(array|object)=} options - (optional) array of property names to be indicized OR a configuration object
 * @param {array=} [options.unique=[]] - array of property names to define unique constraints for
 * @param {array=} [options.exact=[]] - array of property names to define exact constraints for
 * @param {array=} [options.indices=[]] - array property names to define binary indexes for
 * @param {boolean} [options.adaptiveBinaryIndices=true] - collection indices will be actively rebuilt rather than lazily
 * @param {boolean} [options.asyncListeners=false] - whether listeners are invoked asynchronously
 * @param {boolean} [options.disableMeta=false] - set to true to disable meta property on documents
 * @param {boolean} [options.disableChangesApi=true] - set to false to enable Changes API
 * @param {boolean} [options.disableDeltaChangesApi=true] - set to false to enable Delta Changes API (requires Changes API, forces cloning)
 * @param {boolean} [options.autoupdate=false] - use Object.observe to update objects automatically
 * @param {boolean} [options.clone=false] - specify whether inserts and queries clone to/from user
 * @param {boolean} [options.serializableIndices=true[]] - converts date values on binary indexed properties to epoch time
 * @param {boolean} [options.disableFreeze=true] - when false all docs are frozen
 * @param {string} [options.cloneMethod='parse-stringify'] - 'parse-stringify', 'jquery-extend-deep', 'shallow', 'shallow-assign'
 * @param {int=} options.ttl - age of document (in ms.) before document is considered aged/stale.
 * @param {int=} options.ttlInterval - time interval for clearing out 'aged' documents; not set by default.
 * @see {@link Loki#addCollection} for normal creation of collections
 */
export declare class Collection<ColT extends Partial<CollectionDocument>> extends SylvieEventEmitter {
    data: ColT[];
    isIncremental: boolean;
    name: string;
    idIndex: number[];
    binaryIndices: Record<string, {
        name: string;
        dirty: boolean;
        values: any[];
    }>;
    constraints: {
        unique: Record<string, UniqueIndex>;
        exact: Record<string, ExactIndex<number>>;
    };
    uniqueNames: string[];
    transforms: Record<string, (Record<string, any> & {
        type: string;
    })[]>;
    objType: any;
    dirty: boolean;
    cachedIndex: any;
    cachedBinaryIndex: any;
    cachedData: any;
    adaptiveBinaryIndices: any;
    transactional: any;
    cloneObjects: any;
    cloneMethod: any;
    disableMeta: any;
    disableChangesApi: any;
    disableDeltaChangesApi: any;
    autoupdate: any;
    serializableIndices: any;
    disableFreeze: any;
    ttl: {
        age?: number;
        ttlInterval?: number;
        daemon?: ReturnType<typeof setInterval>;
    };
    maxId: number;
    DynamicViews: DynamicView<ColT>[];
    changes: ChangeOps[];
    dirtyIds: number[];
    observerCallback: (changes: any) => void;
    getChangeDelta: (obj: any, old: any) => any;
    getObjectDelta: (oldObject: any, newObject: any) => any;
    getChanges: () => any;
    flushChanges: () => void;
    setChangesApi: (enabled: any) => void;
    cachedDirtyIds: number[];
    /**
     * stages: a map of uniquely identified 'stages', which hold copies of objects to be
     * manipulated without affecting the data in the original collection
     */
    stages: Record<string, CollectionDocument>;
    /**
     * a collection of objects recording the changes applied through a commmitStage
     */
    commitLog: any[];
    no_op: () => void;
    constructor(name: string, options?: Partial<CollectionOptions>);
    createChange(name: string, op: "U" | "I" | "R", obj: object, old?: object): void;
    insertMeta(obj: CollectionDocument): void;
    updateMeta(obj: CollectionDocument): CollectionDocument;
    createInsertChange(obj: CollectionDocument): void;
    createUpdateChange(obj: CollectionDocument, old: CollectionDocument): void;
    insertMetaWithChange(obj: CollectionDocument): void;
    updateMetaWithChange(obj: CollectionDocument, old: CollectionDocument): CollectionDocument;
    addAutoUpdateObserver(object: object): void;
    removeAutoUpdateObserver(object: object): void;
    /**
     * Adds a named collection transform to the collection
     * @param {string} name - name to associate with transform
     * @param {array} transform - an array of transformation 'step' objects to save into the collection
     * @memberof Collection
     * @example
     * users.addTransform('progeny', [
     *   {
     *     type: 'find',
     *     value: {
     *       'age': {'$lte': 40}
     *     }
     *   }
     * ]);
     *
     * var results = users.chain('progeny').data();
     */
    addTransform(name: string, transform: (Record<string, any> & {
        type: string;
    })[]): void;
    /**
     * Retrieves a named transform from the collection.
     * @param {string} name - name of the transform to lookup.
     * @memberof Collection
     */
    getTransform(name: string): (Record<string, any> & {
        type: string;
    })[];
    /**
     * Updates a named collection transform to the collection
     * @param {string} name - name to associate with transform
     * @param {object} transform - a transformation object to save into collection
     * @memberof Collection
     */
    setTransform(name: string, transform: (Record<string, any> & {
        type: string;
    })[]): void;
    /**
     * Removes a named collection transform from the collection
     * @param {string} name - name of collection transform to remove
     * @memberof Collection
     */
    removeTransform(name: string): void;
    byExample(template: Record<string, any>): {
        $and: any[];
    };
    findObject(template: Record<string, any>): any;
    findObjects(template: Record<string, any>): ColT[];
    ttlDaemonFuncGen(): () => void;
    /**
     * Updates or applies collection TTL settings.
     * @param {int} age - age (in ms) to expire document from collection
     * @param {int} interval - time (in ms) to clear collection of aged documents.
     * @memberof Collection
     */
    setTTL(age: number, interval: number): void;
    /**
     * create a row filter that covers all documents in the collection
     */
    prepareFullDocIndex(): any[];
    /**
     * Will allow reconfiguring certain collection options.
     * @param {boolean} options.adaptiveBinaryIndices - collection indices will be actively rebuilt rather than lazily
     * @memberof Collection
     */
    configureOptions: (options?: {
        adaptiveBinaryIndices?: boolean;
    }) => void;
    /**
     * Ensure binary index on a certain field
     * @param {string} property - name of property to create binary index on
     * @param {boolean=} force - (Optional) flag indicating whether to construct index immediately
     * @memberof Collection
     */
    ensureIndex(property: string, force?: boolean): void;
    /**
     * Perform checks to determine validity/consistency of all binary indices
     * @param {object=} options - optional configuration object
     * @param {boolean} [options.randomSampling=false] - whether (faster) random sampling should be used
     * @param {number} [options.randomSamplingFactor=0.10] - percentage of total rows to randomly sample
     * @param {boolean} [options.repair=false] - whether to fix problems if they are encountered
     * @returns {string[]} array of index names where problems were found.
     * @memberof Collection
     * @example
     * // check all indices on a collection, returns array of invalid index names
     * var result = coll.checkAllIndexes({ repair: true, randomSampling: true, randomSamplingFactor: 0.15 });
     * if (result.length > 0) {
     *   results.forEach(function(name) {
     *     console.log('problem encountered with index : ' + name);
     *   });
     * }
     */
    checkAllIndexes(options?: {
        randomSampling: boolean;
        randomSamplingFactor: number;
        repair: boolean;
    }): string[];
    /**
     * Perform checks to determine validity/consistency of a binary index
     * @param {string} property - name of the binary-indexed property to check
     * @param {object=} options - optional configuration object
     * @param {boolean} [options.randomSampling=false] - whether (faster) random sampling should be used
     * @param {number} [options.randomSamplingFactor=0.10] - percentage of total rows to randomly sample
     * @param {boolean} [options.repair=false] - whether to fix problems if they are encountered
     * @returns {boolean} whether the index was found to be valid (before optional correcting).
     * @memberof Collection
     * @example
     * // full test
     * var valid = coll.checkIndex('name');
     * // full test with repair (if issues found)
     * valid = coll.checkIndex('name', { repair: true });
     * // random sampling (default is 10% of total document count)
     * valid = coll.checkIndex('name', { randomSampling: true });
     * // random sampling (sample 20% of total document count)
     * valid = coll.checkIndex('name', { randomSampling: true, randomSamplingFactor: 0.20 });
     * // random sampling (implied boolean)
     * valid = coll.checkIndex('name', { randomSamplingFactor: 0.20 });
     * // random sampling with repair (if issues found)
     * valid = coll.checkIndex('name', { repair: true, randomSampling: true });
     */
    checkIndex(property: string, options?: {
        randomSampling?: boolean;
        randomSamplingFactor?: number;
        repair?: boolean;
    }): boolean;
    getBinaryIndexValues(property: string): any[];
    /**
     * Returns a named unique index
     * @param {string} field - indexed field name
     * @param {boolean} force - if `true`, will rebuild index; otherwise, function may return null
     */
    getUniqueIndex(field: string, force?: boolean): UniqueIndex;
    ensureUniqueIndex(field: any): UniqueIndex;
    /**
     * Ensure all binary indices
     * @param {boolean} force - whether to force rebuild of existing lazy binary indices
     * @memberof Collection
     */
    ensureAllIndexes(force?: boolean): void;
    /**
     * Internal method used to flag all lazy index as dirty
     */
    flagBinaryIndexesDirty(): void;
    /**
     * Internal method used to flag a lazy index as dirty
     */
    flagBinaryIndexDirty(index: any): void;
    /**
     * Quickly determine number of documents in collection (or query)
     * @param {object=} query - (optional) query object to count results of
     * @returns {number} number of documents in the collection
     * @memberof Collection
     */
    count: (query?: Record<string, any>) => number;
    /**
     * Rebuild idIndex
     */
    ensureId(): void;
    /**
     * Rebuild idIndex async with callback - useful for background syncing with a remote server
     */
    ensureIdAsync(callback: any): void;
    /**
     * Add a dynamic view to the collection
     * @param {string} name - name of dynamic view to add
     * @param {object=} options - options to configure dynamic view with
     * @param {boolean} [options.persistent=false] - indicates if view is to main internal results array in 'resultdata'
     * @param {string} [options.sortPriority='passive'] - 'passive' (sorts performed on call to data) or 'active' (after updates)
     * @param {number} options.minRebuildInterval - minimum rebuild interval (need clarification to docs here)
     * @returns {DynamicView} reference to the dynamic view added
     * @memberof Collection
     * @example
     * var pview = users.addDynamicView('progeny');
     * pview.applyFind({'age': {'$lte': 40}});
     * pview.applySimpleSort('name');
     *
     * var results = pview.data();
     **/
    addDynamicView(name: any, options: any): DynamicView<ColT>;
    /**
     * Remove a dynamic view from the collection
     * @param {string} name - name of dynamic view to remove
     * @memberof Collection
     **/
    removeDynamicView(name: any): void;
    /**
     * Look up dynamic view reference from within the collection
     * @param {string} name - name of dynamic view to retrieve reference of
     * @returns {DynamicView} A reference to the dynamic view with that name
     * @memberof Collection
     **/
    getDynamicView(name: any): DynamicView<ColT>;
    /**
     * Applies a 'mongo-like' find query object and passes all results to an update function.
     * For filter function querying you should migrate to [updateWhere()]{@link Collection#updateWhere}.
     *
     * @param {object|function} filterObject - 'mongo-like' query object (or deprecated filterFunction mode)
     * @param {function} updateFunction - update function to run against filtered documents
     * @memberof Collection
     */
    findAndUpdate(filterObject: any, updateFunction: any): void;
    /**
     * Applies a 'mongo-like' find query object removes all documents which match that filter.
     *
     * @param {object} filterObject - 'mongo-like' query object
     * @memberof Collection
     */
    findAndRemove(filterObject?: Record<string, any>): void;
    /**
     * Adds object(s) to collection, ensure object(s) have meta properties, clone it if necessary, etc.
     * @param {(object|array)} doc - the document (or array of documents) to be inserted
     * @param {boolean=} overrideAdaptiveIndices - (optional) if `true`, adaptive indicies will be
     *   temporarily disabled and then fully rebuilt after batch. This will be faster for
     *   large inserts, but slower for small/medium inserts in large collections
     * @returns {(object|array)} document or documents inserted
     * @memberof Collection
     * @example
     * users.insert({
     *     name: 'Odin',
     *     age: 50,
     *     address: 'Asgard'
     * });
     *
     * // alternatively, insert array of documents
     * users.insert([{ name: 'Thor', age: 35}, { name: 'Loki', age: 30}]);
     */
    insert(doc: any, overrideAdaptiveIndices?: boolean): any;
    /**
     * Adds a single object, ensures it has meta properties, clone it if necessary, etc.
     * @param {object} doc - the document to be inserted
     * @param {boolean} bulkInsert - quiet pre-insert and insert event emits
     * @returns {object} document or 'undefined' if there was a problem inserting it
     */
    insertOne(doc: any, bulkInsert?: boolean): any;
    /**
     * Empties the collection.
     * @param {object=} options - configure clear behavior
     * @param {bool=} [options.removeIndices=false] - whether to remove indices in addition to data
     * @memberof Collection
     */
    clear(options?: {
        removeIndices?: boolean;
    }): void;
    /**
     * Updates an object and notifies collection that the document has changed.
     * @param {object} doc - document to update within the collection
     * @memberof Collection
     */
    update(doc: CollectionDocument | CollectionDocument[]): any;
    /**
     * Add object to collection
     */
    add(obj: any): any;
    /**
     * Applies a filter function and passes all results to an update function.
     *
     * @param {function} filterFunction - filter function whose results will execute update
     * @param {function} updateFunction - update function to run against filtered documents
     * @memberof Collection
     */
    updateWhere(filterFunction: any, updateFunction: any): void;
    /**
     * Remove all documents matching supplied filter function.
     * For 'mongo-like' querying you should migrate to [findAndRemove()]{@link Collection#findAndRemove}.
     * @param {function|object} query - query object to filter on
     * @memberof Collection
     */
    removeWhere(query: (...args: any[]) => any | object): void;
    removeDataOnly(): void;
    /**
     * Internal method to remove a batch of documents from the collection.
     * @param {number[]} positions - data/idIndex positions to remove
     */
    removeBatchByPositions(positions: number[]): any;
    /**
     *  Internal method called by remove()
     * @param {object[]|number[]} batch - array of documents or $loki ids to remove
     */
    removeBatch(batch: CollectionDocument[] | number[]): void;
    /**
     * Remove a document from the collection
     * @param {object} doc - document to remove from collection
     * @memberof Collection
     */
    remove(doc: CollectionDocument): CollectionDocument;
    /**
     * Get by Id - faster than other methods because of the searching algorithm
     * @param {int} id - $loki id of document you want to retrieve
     * @param {boolean} returnPosition - if 'true' we will return [object, position]
     * @returns {(object|array|null)} Object reference if document was found, null if not,
     *     or an array if 'returnPosition' was passed.
     * @memberof Collection
     */
    get(id: number, returnPosition?: boolean): object | Array<any> | null;
    /**
     * Perform binary range lookup for the data[dataPosition][binaryIndexName] property value
     *    Since multiple documents may contain the same value (which the index is sorted on),
     *    we hone in on range and then linear scan range to find exact index array position.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    getBinaryIndexPosition(dataPosition: number, binaryIndexName: string): number;
    /**
     * Adaptively insert a selected item to the index.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    adaptiveBinaryIndexInsert(dataPosition: number, binaryIndexName: string): void;
    /**
     * Adaptively update a selected item within an index.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    adaptiveBinaryIndexUpdate(dataPosition: number, binaryIndexName: string): void;
    /**
     * Adaptively remove a selected item from the index.
     * @param {number|number[]} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    adaptiveBinaryIndexRemove(dataPosition: number | number[], binaryIndexName: string, removedFromIndexOnly?: boolean): any;
    /**
     * Internal method used for index maintenance and indexed searching.
     * Calculates the beginning of an index range for a given value.
     * For index maintainance (adaptive:true), we will return a valid index position to insert to.
     * For querying (adaptive:false/undefined), we will :
     *    return lower bound/index of range of that value (if found)
     *    return next lower index position if not found (hole)
     * If index is empty it is assumed to be handled at higher level, so
     * this method assumes there is at least 1 document in index.
     *
     * @param {string} prop - name of property which has binary index
     * @param {any} val - value to find within index
     * @param {bool?} adaptive - if true, we will return insert position
     */
    calculateRangeStart(prop: string, val: any, adaptive: boolean | null, usingDotNotation: boolean): number;
    /**
     * Internal method used for indexed $between.  Given a prop (index name), and a value
     * (which may or may not yet exist) this will find the final position of that upper range value.
     */
    calculateRangeEnd(prop: string, val: any, usingDotNotation: boolean): number;
    /**
     * calculateRange() - Binary Search utility method to find range/segment of values matching criteria.
     *    this is used for collection.find() and first find filter of resultset/dynview
     *    slightly different than get() binary search in that get() hones in on 1 value,
     *    but we have to hone in on many (range)
     * @param {string} op - operation, such as $eq
     * @param {string} prop - name of property to calculate range for
     * @param {object} val - value to use for range calculation.
     * @returns {array} [start, end] index array positions
     */
    calculateRange(op: string, prop: string, val: any): [start: number, end: number];
    /**
     * Retrieve doc by Unique index
     * @param {string} field - name of uniquely indexed property to use when doing lookup
     * @param {value} value - unique value to search for
     * @returns {object} document matching the value passed
     * @memberof Collection
     */
    by(field: string, value?: string): any;
    /**
     * Find one object by index property, by property equal to value
     * @param {object} query - query object used to perform search with
     * @returns {(object|null)} First matching document, or null if none
     * @memberof Collection
     */
    findOne(query?: {}): any;
    /**
     * Chain method, used for beginning a series of chained find() and/or view() operations
     * on a collection.
     *
     * @param {string|array=} transform - named transform or array of transform steps
     * @param {object=} parameters - Object containing properties representing parameters to substitute
     * @returns {ResultSet} (this) resultset, or data array if any map or join functions where called
     * @memberof Collection
     */
    chain(transform?: ChainTransform, parameters?: unknown): ResultSet<ColT>;
    /**
     * Find method, api is similar to mongodb.
     * for more complex queries use [chain()]{@link Collection#chain} or [where()]{@link Collection#where}.
     * @example {@tutorial Query Examples}
     * @param {object} query - 'mongo-like' query object
     * @returns {array} Array of matching documents
     * @memberof Collection
     */
    find(query?: Record<string, object>): ColT[];
    /**
     * Find object by unindexed field by property equal to value,
     * simply iterates and returns the first element matching the query
     */
    findOneUnindexed(prop: any, value: any): any;
    /**
     * Transaction methods
     */
    /** start the transation */
    startTransaction: () => void;
    /** commit the transation */
    commit: () => void;
    /** roll back the transation */
    rollback: () => void;
    async(fun: any, callback: any): void;
    /**
     * Query the collection by supplying a javascript filter function.
     * @example
     * var results = coll.where(function(obj) {
     *   return obj.legs === 8;
     * });
     *
     * @param {function} fun - filter function to run against all collection docs
     * @returns {array} all documents which pass your filter function
     * @memberof Collection
     */
    where(fun: any): ColT[];
    /**
     * Map Reduce operation
     *
     * @param {function} mapFunction - function to use as map function
     * @param {function} reduceFunction - function to use as reduce function
     * @returns {data} The result of your mapReduce operation
     * @memberof Collection
     */
    mapReduce: (mapFunction: any, reduceFunction: any) => any;
    /**
     * Join two collections on specified properties
     *
     * @param {array|ResultSet|Collection} joinData - array of documents to 'join' to this collection
     * @param {string} leftJoinProp - property name in collection
     * @param {string} rightJoinProp - property name in joinData
     * @param {function=} mapFun - (Optional) map function to use
     * @param {object=} dataOptions - options to data() before input to your map function
     * @param {bool} dataOptions.removeMeta - allows removing meta before calling mapFun
     * @param {boolean} dataOptions.forceClones - forcing the return of cloned objects to your map object
     * @param {string} dataOptions.forceCloneMethod - Allows overriding the default or collection specified cloning method.
     * @returns {ResultSet} Result of the mapping operation
     * @memberof Collection
     */
    eqJoin(joinData: any, leftJoinProp: any, rightJoinProp: any, mapFun: any, dataOptions: any): ResultSet<ColT>;
    /**
     * (Staging API) create a stage and/or retrieve it
     * @memberof Collection
     */
    getStage(name: string): CollectionDocument;
    /**
     * (Staging API) create a copy of an object and insert it into a stage
     * @memberof Collection
     */
    stage(stageName: string, obj: CollectionDocument): any;
    /**
     * (Staging API) re-attach all objects to the original collection, so indexes and views can be rebuilt
     * then create a message to be inserted in the commitlog
     * @param {string} stageName - name of stage
     * @param {string} message
     * @memberof Collection
     */
    commitStage(stageName: string, message: string): void;
    /**
     * @memberof Collection
     */
    extract(field: any): any[];
    /**
     * @memberof Collection
     */
    max(field: any): any;
    /**
     * @memberof Collection
     */
    min(field: any): any;
    /**
     * @memberof Collection
     */
    maxRecord(field: any): {
        index: number;
        value: any;
    };
    /**
     * @memberof Collection
     */
    minRecord(field: any): {
        index: number;
        value: any;
    };
    /**
     * @memberof Collection
     */
    extractNumerical(field: any): number[];
    /**
     * Calculates the average numerical value of a property
     *
     * @param {string} field - name of property in docs to average
     * @returns {number} average of property in all docs in the collection
     * @memberof Collection
     */
    avg(field: any): number;
    /**
     * Calculate standard deviation of a field
     * @memberof Collection
     * @param {string} field
     */
    stdDev(field: any): number;
    /**
     * @memberof Collection
     * @param {string} field
     */
    mode(field: any): any;
    /**
     * @memberof Collection
     * @param {string} field - property name
     */
    median(field: any): number;
    lokiConsoleWrapper: {
        log(message: string): void;
        warn(message: string): void;
        error(message: string): void;
    };
}
export {};
