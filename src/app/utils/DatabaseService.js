import Dexie from 'dexie';

const db = new Dexie('personal-pass');
db.version(1).stores({
  accounts: "account_id"
});

export default db;
