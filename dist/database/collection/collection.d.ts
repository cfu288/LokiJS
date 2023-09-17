import { CloneMethods } from "../../utils/clone";
import DynamicView from "../dynamic-view";
import { DynamicViewOptions } from "../dynamic-view/dynamic-view-options";
import { ChangeOps } from "../sylvie/change-ops";
import { SylvieEventEmitter } from "../sylvie-event-emitter";
import { ResultSet } from "../result-set/result-set";
import { ExactIndex } from "../indexes/exact-index";
import { UniqueIndex } from "../indexes/unique-index";
import { ChainTransform } from "./chain-transform";
import { CollectionOptions } from "./collection-options";
import { CollectionDocument } from "./collection-document";
import { CollectionBinaryIndex } from "./collection-binary-index";
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
 * @see {@link Sylvie#addCollection} for normal creation of collections
 */
export declare class Collection<ColT extends Partial<CollectionDocument>> extends SylvieEventEmitter {
    data: ColT[];
    isIncremental: boolean;
    name: string;
    idIndex: number[] | null;
    binaryIndices: CollectionBinaryIndex;
    constraints: {
        unique: Record<string, UniqueIndex>;
        exact: Record<string, ExactIndex<number>>;
    };
    uniqueNames: string[];
    transforms: Record<string, (Record<string, any> & {
        type: string;
    })[]>;
    objType: string;
    dirty: boolean;
    cachedIndex: number[] | null;
    cachedBinaryIndex: CollectionBinaryIndex | null;
    cachedData: ColT[] | null;
    adaptiveBinaryIndices: boolean;
    transactional: boolean;
    cloneObjects: boolean;
    cloneMethod: CloneMethods;
    disableMeta: boolean;
    disableChangesApi: boolean;
    disableDeltaChangesApi: boolean;
    autoupdate: boolean;
    serializableIndices: boolean;
    disableFreeze: boolean;
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
    commitLog: {
        timestamp: number;
        message: string;
        data: string;
    }[];
    no_op: () => void;
    constructor(name: string, options?: Partial<CollectionOptions>);
    createChange<T extends Partial<CollectionDocument>>(name: string, op: "U" | "I" | "R", obj: T, old?: T): void;
    insertMeta<T extends Partial<CollectionDocument>>(obj: T): void;
    updateMeta<T extends CollectionDocument>(obj: T): T;
    createInsertChange<T extends Partial<CollectionDocument>>(obj: T): void;
    createUpdateChange(obj: CollectionDocument, old: CollectionDocument): void;
    insertMetaWithChange<T extends Partial<CollectionDocument>>(obj: T): void;
    updateMetaWithChange<T extends CollectionDocument>(obj: T, old: T): T;
    addAutoUpdateObserver<T extends CollectionDocument>(object: T): void;
    removeAutoUpdateObserver<T extends object>(object: T): void;
    /**
     * Adds a named collection transform to the collection
     * @param {string} name - name to associate with transform
     * @param {array} transform - an array of transformation 'step' objects to save into the collection
     
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
     */
    getTransform(name: string): (Record<string, any> & {
        type: string;
    })[];
    /**
     * Updates a named collection transform to the collection
     * @param {string} name - name to associate with transform
     * @param {object} transform - a transformation object to save into collection
     
     */
    setTransform(name: string, transform: (Record<string, any> & {
        type: string;
    })[]): void;
    /**
     * Removes a named collection transform from the collection
     * @param {string} name - name of collection transform to remove
     
     */
    removeTransform(name: string): void;
    byExample(template: Record<string, any>): {
        $and: any[];
    };
    findObject(template: Record<string, any>): ColT;
    findObjects(template: Record<string, any>): ColT[];
    ttlDaemonFuncGen(): () => void;
    /**
     * Updates or applies collection TTL settings.
     * @param {int} age - age (in ms) to expire document from collection
     * @param {int} interval - time (in ms) to clear collection of aged documents.
     
     */
    setTTL(age: number, interval: number): void;
    /**
     * create a row filter that covers all documents in the collection
     */
    prepareFullDocIndex(): any[];
    /**
     * Will allow reconfiguring certain collection options.
     * @param {boolean} options.adaptiveBinaryIndices - collection indices will be actively rebuilt rather than lazily
     
     */
    configureOptions: (options?: {
        adaptiveBinaryIndices?: boolean;
    }) => void;
    /**
     * Ensure binary index on a certain field
     * @param {string} property - name of property to create binary index on
     * @param {boolean=} force - (Optional) flag indicating whether to construct index immediately
     
     */
    ensureIndex(property: string, force?: boolean): void;
    /**
     * Perform checks to determine validity/consistency of all binary indices
     * @param {object=} options - optional configuration object
     * @param {boolean} [options.randomSampling=false] - whether (faster) random sampling should be used
     * @param {number} [options.randomSamplingFactor=0.10] - percentage of total rows to randomly sample
     * @param {boolean} [options.repair=false] - whether to fix problems if they are encountered
     * @returns {string[]} array of index names where problems were found.
     
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
     * @example
     * var pview = users.addDynamicView('progeny');
     * pview.applyFind({'age': {'$lte': 40}});
     * pview.applySimpleSort('name');
     *
     * var results = pview.data();
     **/
    addDynamicView(name?: string, options?: Partial<DynamicViewOptions>): DynamicView<ColT>;
    /**
     * Remove a dynamic view from the collection
     * @param {string} name - name of dynamic view to remove
     **/
    removeDynamicView(name: any): void;
    /**
     * Look up dynamic view reference from within the collection
     * @param {string} name - name of dynamic view to retrieve reference of
     * @returns {DynamicView} A reference to the dynamic view with that name
     **/
    getDynamicView(name: any): DynamicView<ColT>;
    /**
     * Applies a 'mongo-like' find query object and passes all results to an update function.
     * For filter function querying you should migrate to [updateWhere()]{@link Collection#updateWhere}.
     *
     * @param {object|function} filterObject - 'mongo-like' query object (or deprecated filterFunction mode)
     * @param {function} updateFunction - update function to run against filtered documents
     */
    findAndUpdate(filterObject: any, updateFunction: any): void;
    /**
     * Applies a 'mongo-like' find query object removes all documents which match that filter.
     *
     * @param {object} filterObject - 'mongo-like' query object
     */
    findAndRemove(filterObject?: Record<string, any>): void;
    /**
     * Adds object(s) to collection, ensure object(s) have meta properties, clone it if necessary, etc.
     * @param {(object|array)} doc - the document (or array of documents) to be inserted
     * @param {boolean=} overrideAdaptiveIndices - (optional) if `true`, adaptive indicies will be
     *   temporarily disabled and then fully rebuilt after batch. This will be faster for
     *   large inserts, but slower for small/medium inserts in large collections
     * @returns {(object|array)} document or documents inserted
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
    insert<T extends ColT>(doc: T, overrideAdaptiveIndices?: boolean): T;
    insert<T extends ColT>(doc: T[], overrideAdaptiveIndices?: boolean): T[];
    /**
     * Adds a single object, ensures it has meta properties, clone it if necessary, etc.
     * @param {object} doc - the document to be inserted
     * @param {boolean} bulkInsert - quiet pre-insert and insert event emits
     * @returns {object} document or 'undefined' if there was a problem inserting it
     */
    insertOne<T extends ColT>(doc: T, bulkInsert?: boolean): T | undefined;
    /**
     * Empties the collection of all data but leaves indexes and options intact by default.
     * @param {object=} options - configure clear behavior
     * @param {bool=} [options.removeIndices=false] - whether to remove indices in addition to data
     */
    clear(options?: {
        removeIndices?: boolean;
    }): void;
    /**
     * Updates an object and notifies collection that the document has changed.
     * @param {CollectionDocument} doc - document to update within the collection
     * @returns the document that was updated
     */
    update<T extends ColT>(doc: T | T[]): any;
    /**
     * Add object to collection
     */
    add<T extends ColT>(obj: T): T;
    /**
     * Applies a filter function and passes all results to an update function.
     *
     * @param {function} filterFunction - filter function whose results will execute update
     * @param {function} updateFunction - update function to run against filtered documents
     
     */
    updateWhere(filterFunction: any, updateFunction: any): void;
    /**
     * Remove all documents matching supplied filter function.
     * For 'mongo-like' querying you should migrate to [findAndRemove()]{@link Collection#findAndRemove}.
     * @param {function|object} query - query object to filter on
     
     */
    removeWhere(query: ((...args: any[]) => any) | Record<string, any>): void;
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
    removeBatch<T extends ColT>(batch: T[] | number[]): void;
    /**
     * Remove a document from the collection
     * @param {object | array | number} newDoc - document(s) to remove from collection. If number, remove by id
     
     * @returns CollectionDocument | null - null if document not found, otherwise removed document. Array of new documents is not returned
     */
    remove<T extends ColT>(doc: T): T | null;
    remove<T extends ColT>(doc: T[]): null;
    remove(doc: number): null;
    get<T extends ColT>(id: number): T | null;
    get<T extends ColT>(id: number, returnPosition: true): [T, number] | null;
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
    calculateRangeStart(prop: string, val: any, adaptive: boolean | null, usingDotNotation?: boolean): number;
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
     
     */
    by(field: string, value?: string): any;
    /**
     * Find one object by index property, by property equal to value
     * @param {object} query - query object used to perform search with
     * @returns {(object|null)} First matching document, or null if none
     
     */
    findOne(query?: {}): ColT;
    /**
     * Chain method, used for beginning a series of chained find() and/or view() operations
     * on a collection.
     *
     * @param {string|array=} transform - named transform or array of transform steps
     * @param {object=} parameters - Object containing properties representing parameters to substitute
     * @returns {ResultSet} (this) resultset, or data array if any map or join functions where called
     
     */
    chain(transform?: ChainTransform, parameters?: any | any[]): ResultSet<ColT> | any;
    /**
     * Find method, api is similar to mongodb.
     * for more complex queries use [chain()]{@link Collection#chain} or [where()]{@link Collection#where}.
     * @example {@tutorial Query Examples}
     * @param {object} query - 'mongo-like' query object
     * @returns {array} Array of matching documents
     
     */
    find(query?: Record<string, any>): ColT[];
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
    async(fun: () => void, callback: () => void): void;
    /**
     * Query the collection by supplying a javascript filter function.
     * @example
     * var results = coll.where(function(obj) {
     *   return obj.legs === 8;
     * });
     *
     * @param {function} fun - filter function to run against all collection docs
     * @returns {array} all documents which pass your filter function
     
     */
    where(fun: any): ColT[];
    /**
     * Map Reduce operation
     *
     * @param {function} mapFunction - function to use as map function
     * @param {function} reduceFunction - function to use as reduce function
     * @returns {data} The result of your mapReduce operation
     
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
     
     */
    eqJoin(joinData: ColT[] | ResultSet<ColT> | Collection<ColT>, leftJoinProp: string, rightJoinProp: string, mapFun: () => void, dataOptions: {
        removeMeta: boolean;
        forceClones: boolean;
        forceCloneMethod: CloneMethods;
    }): ResultSet<ColT>;
    /**
     * (Staging API) create a stage and/or retrieve it
     
     */
    getStage(name: string): CollectionDocument;
    /**
     * (Staging API) create a copy of an object and insert it into a stage
     
     */
    stage(stageName: string, obj: CollectionDocument): any;
    /**
     * (Staging API) re-attach all objects to the original collection, so indexes and views can be rebuilt
     * then create a message to be inserted in the commitlog
     * @param {string} stageName - name of stage
     * @param {string} message
     
     */
    commitStage(stageName: string, message: string): void;
    /**
     
     */
    extract(field: any): any[];
    /**
     
     */
    max(field: any): any;
    /**
     
     */
    min(field: any): any;
    /**
     
     */
    maxRecord(field: any): {
        index: number;
        value: any;
    };
    /**
     
     */
    minRecord(field: any): {
        index: number;
        value: any;
    };
    /**
     
     */
    extractNumerical(field: any): number[];
    /**
     * Calculates the average numerical value of a property
     *
     * @param {string} field - name of property in docs to average
     * @returns {number} average of property in all docs in the collection
     
     */
    avg(field: any): number;
    /**
     * Calculate standard deviation of a field
     
     * @param {string} field
     */
    stdDev(field: any): number;
    /**
     
     * @param {string} field
     */
    mode(field: any): any;
    /**
     
     * @param {string} field - property name
     */
    median(field: any): number;
    lokiConsoleWrapper: {
        log(message: string): void;
        warn(message: string): void;
        error(message: string): void;
    };
}
