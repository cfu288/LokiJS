/* eslint-disable @typescript-eslint/no-var-requires */
import Loki from "../../src/lokijs";
import { Collection } from "../../src/modules/Collection";
import { LokiPersistenceAdapter } from "../../src/modules/loki-storage-adapter/LokiPersistenceAdapter";
const loki = Loki;

describe("IncrementalIndexedDBAdapter", function() {
  it("initializes Loki properly", function() {
    const adapter = (new IncrementalIndexedDBAdapter(
      "tests"
    ) as unknown) as LokiPersistenceAdapter;
    const db = new loki("test.db", {
      adapter: adapter,
    });
    const coll = db.addCollection("coll");

    expect(db.isIncremental).toBe(true);
    expect(coll.isIncremental).toBe(true);
    // @ts-ignore
    expect(adapter.chunkSize).toBe(100);
    expect(adapter.mode).toBe("incremental");
  });
  function checkDatabaseCopyIntegrity(source, copy) {
    source.collections.forEach(function(sourceCol: Collection<any>, i) {
      const copyCol = copy.collections[i];
      expect(copyCol.name).toBe(sourceCol.name);
      expect(copyCol.data.length).toBe(sourceCol.data.length);

      copyCol.data.every(function(copyEl, elIndex) {
        expect(JSON.stringify(copyEl)).toBe(
          JSON.stringify(source.collections[i].data[elIndex])
        );
      });
    });
  }
  it("checkDatabaseCopyIntegrity works", function() {
    const db = new loki("test.db");
    const col1 = db.addCollection("test_collection");

    const doc1 = { foo: "1" };
    const doc2: Record<string, string> = { foo: "2" };
    const doc3 = { foo: "3" };
    col1.insert([doc1, doc2, doc3]);
    doc2.bar = "true";
    col1.update(doc2);
    col1.remove(doc3);

    // none of these should throw
    checkDatabaseCopyIntegrity(db, db);
    checkDatabaseCopyIntegrity(db, db.copy());
    checkDatabaseCopyIntegrity(db, JSON.parse(db.serialize()));

    // this should throw
    // expect(function () {
    //   var copy = db.copy();
    //   copy.collections[0].data.push({ hello: '!'})
    //   checkDatabaseCopyIntegrity(db, copy);
    // }).toThrow();
  });
  // it('basically works', function(done) {
  //   var adapter = new IncrementalIndexedDBAdapter('tests');
  //   var db = new loki('test.db', { adapter: adapter });
  //   var col1 = db.addCollection('test_collection');

  //   col1.insert({ customId: 0, val: 'hello', constraints: 100 });
  //   col1.insert({ customId: 1, val: 'hello1' });
  //   var h2 = col1.insert({ customId: 2, val: 'hello2' });
  //   var h3 = col1.insert({ customId: 3, val: 'hello3' });
  //   var h4 = col1.insert({ customId: 4, val: 'hello4' });
  //   var h5 = col1.insert({ customId: 5, val: 'hello5' });

  //   h2.val = 'UPDATED';
  //   col1.update(h2);

  //   h3.val = 'UPDATED';
  //   col1.update(h3);
  //   h3.val2 = 'added!';
  //   col1.update(h3);

  //   col1.remove(h4);

  //   var h6 = col1.insert({ customId: 6, val: 'hello6' });

  //   db.saveDatabase(function (e) {
  //     expect(e).toBe(undefined);

  //     var adapter2 = new IncrementalIndexedDBAdapter('tests');
  //     var db2 = new loki('test.db', { adapter: adapter2 });

  //     db2.loadDatabase({}, function (e) {
  //       expect(e).toBe(undefined);

  //       checkDatabaseCopyIntegrity(db, db2);
  //       done()
  //     });
  //   });
  // })
  // it('works with a lot of fuzzed data', function() {
  // })
  // it('can delete database', function() {
  // })
  // it('stores data in the expected format', function() {
  // })
  // NOTE: Because PhantomJS doesn't support IndexedDB, I moved tests to spec/incrementalidb.html
  it("handles dirtyIds during save properly", function() {
    const adapter = new IncrementalIndexedDBAdapter("tests");
    const db = new loki("test.db", {
      adapter: (adapter as unknown) as LokiPersistenceAdapter,
    });
    const col1 = db.addCollection("test_collection");
    const col2 = db.addCollection("test_collection2");
    col2.dirty = false;

    const doc1 = { foo: "1" };
    const doc2: Record<string, string> = { foo: "2" };
    const doc3 = { foo: "3" };
    col1.insert([doc1, doc2, doc3]);
    doc2.bar = "true";
    col1.update(doc2);
    col1.remove(doc3);

    const dirty = col1.dirtyIds;
    expect(dirty.length).toBe(5);
    expect(col1.dirty).toBe(true);
    expect(col2.dirty).toBe(false);

    // simulate save - don't go through IDB, just check that logic is good
    let callCallback;
    adapter.saveDatabase = function(dbname, getLokiCopy, callback) {
      getLokiCopy();
      callCallback = callback;
    };

    // dirty ids zero out and roll back in case of error
    db.saveDatabase();
    expect(col1.dirtyIds).toEqual([]);
    expect(col1.dirty).toBe(false);
    callCallback(new Error("foo"));
    expect(col1.dirtyIds).toEqual(dirty);
    expect(col1.dirty).toBe(true);
    expect(col2.dirty).toBe(false);

    // new dirtied ids get added in case of rollback
    db.saveDatabase();
    const doc4 = { foo: "4" } as { foo: string; $loki: number };
    col1.insert(doc4);
    expect(col1.dirtyIds).toEqual([doc4.$loki]);
    const doc5 = { foo: "5" } as { foo: string; $loki: number };
    col2.insert(doc5);
    expect(col2.dirty).toBe(true);
    expect(col2.dirtyIds).toEqual([doc5.$loki]);
    callCallback(new Error("foo"));
    expect(col1.dirtyIds).toEqual([doc4.$loki].concat(dirty));
    expect(col1.dirty).toBe(true);
    expect(col2.dirtyIds).toEqual([doc5.$loki]);
    expect(col2.dirty).toBe(true);

    // if successful, dirty ids don't zero out
    db.saveDatabase();
    expect(col1.dirtyIds).toEqual([]);
    const doc6 = { foo: "6" } as { foo: string; $loki: number };
    col1.insert(doc6);
    expect(col1.dirtyIds).toEqual([doc6.$loki]);
    callCallback();
    expect(col1.dirtyIds).toEqual([doc6.$loki]);
  });
});
