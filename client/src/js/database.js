import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (id, content) => {
  try {
    console.log("PUT to the database");

    // Create a connection to the  database and version we want to use.
    const jateDb = await openDB("jate", 1);

    // Create a new transaction and specify the database and data privileges.
    const transactionJate = jateDb.transaction("jate", "readwrite");

    // Open up the desired object store.
    const jateObjStore = transactionJate.objectStore("jate");

    // Use the .getAll() method to get all data in the database.
    const putRequest = jateObjStore.put({ id: id, content: content });

    // Get confirmation of the request.
    const result = await putRequest;

    console.log("🚀 - data saved to the database", result);
  } catch {
    console.error("putDb not implemented");
  }
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  try {
    console.log("GET from the database");

    // Create a connection to the  database and version we want to use.
    const jateDb = await openDB("jate", 1);

    // Create a new transaction and specify the database and data privileges.
    const transactionJate = jateDb.transaction("jate", "readonly");

    // Open up the desired object store.
    const jateObjStore = transactionJate.objectStore("jate");

    // Use the .getAll() method to get all data in the database.
    const getAllRequest = jateObjStore.getAll();

    // Get confirmation of the request.
    const result = await getAllRequest;

    console.log("result.value", result);
    return result;
  } catch {
    console.error("getDb not implemented");
  }
};

initdb();
