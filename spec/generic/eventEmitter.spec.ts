import Sylvie from "../../src/sylviejs";
const loki = Sylvie;

describe("eventEmitter", function () {
  let db;
  let users;

  beforeEach(function () {
    (db = new loki("test", {
      persistenceMethod: null,
    })),
      (users = db.addCollection("users", {
        asyncListeners: false,
      }));

    users.insert({
      name: "joe",
    });
  });

  it("async", function testAsync() {
    expect(db.asyncListeners).toBe(false);
  });

  it("emit", function () {
    const index = db.on("test", function test(obj) {
      expect(obj).toEqual(42);
    });

    db.emit("test", 42);
    db.removeListener("test", index);

    expect(db.events["test"].length).toEqual(0);

    expect(function testEvent() {
      db.emit("testEvent");
    }).toThrow(new Error("No event testEvent defined"));
  });
});
