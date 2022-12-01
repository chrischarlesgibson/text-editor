// Import the 'idb' package to use with IndexedDB.idb is a lightweight wrapper we are using mainly so we can use async/await syntax
import { openDB } from "idb";

//function to start up th edatabse
const initdb = async () =>
  //create database named jate and specify to use version 1. if i need to change how the database works then i need to make a version 2 and so on
  openDB("jate", 1, {
    // Sets the database schema if it isn't already defined.
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      // Create an object store for our data inside of the 'jate' database.
      // We create a key named 'id' which will automatically be incremented for us.
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });
//export put databse function
export const putDb = async (content) => {
  console.log("PUT to the database");

  // Create a connection to the  database and version we want to use.
  const jateDb = await openDB("jate", 1);

  // Create a new transaction and specify the database and data privileges.
  const transactionJate = jateDb.transaction("jate", "readwrite");

  // Open up the desired object store.
  const jateObjStore = transactionJate.objectStore("jate");

  // Use the .getAll() method to get all data in the database.
  //can id by id instead of one?
  const putRequest = jateObjStore.put({ id: 1, content: content });

  // Get confirmation of the request.
  const result = await putRequest;

  console.log("data saved to the database", result);
};

//export get databse function
export const getDb = async () => {
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

  //use optional chaining so that it returns undefined if it doesnt exist rather than a run time error
  return result?.value;
};

//call the start database function
initdb();
