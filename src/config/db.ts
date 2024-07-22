export const Stores = {
  templates: {
    keyPath: "id",
  },
  images: {
    keyPath: "id",
  },
  importData: {
    keyPath: "sourceName",
  },
} as const;

export type StoreTypes = keyof typeof Stores;
export type KeyPath<T extends StoreTypes> = (typeof Stores)[T]["keyPath"];

class DB {
  private db: Promise<IDBDatabase>;
  constructor(database: string, version: 1) {
    this.db = this.initDb(database, version);
  }

  public async writeItem<T>(storeName: StoreTypes, item: T) {
    const promise = new Promise<void>((resolve, reject) => {
      this.db.then(db => {
        const trans = db.transaction([storeName], "readwrite");
        const store = trans.objectStore(storeName);
        const req = store.put(item);

        req.onsuccess = () => {
          resolve();
        };

        req.onerror = ev => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          reject((ev.target as any).result);
        };
      });
    });
    return await promise;
  }

  public async getItemById<T>(storeName: StoreTypes, id: string) {
    return await this.readItem<T>(storeName, id);
  }

  public async getAll<T>(storeName: StoreTypes) {
    return await this.readList<T>(storeName);
  }

  private async readList<T>(storeName: StoreTypes) {
    const promise = new Promise((resolve, reject) => {
      this.db.then(db => {
        const trans = db.transaction([storeName], "readonly");
        const store = trans.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = ev => {
          const target = ev.target;
          if (!target)
            return reject(
              new Error(
                `Error getting result from IndexedDB store: '${storeName}'. Event target does not exist`
              )
            );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = (target as unknown as { result: any }).result;
          resolve(result);
        };
        req.onerror = ev => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          reject((ev.target as any).result as any);
        };
      });
    });
    return (await promise) as T;
  }

  private async readItem<T>(storeName: string, key: string): Promise<T> {
    const promise = new Promise((resolve, reject) => {
      this.db.then(db => {
        const trans = db.transaction([storeName], "readonly");
        const store = trans.objectStore(storeName);
        const req = store.get(key);

        req.onsuccess = ev => {
          const target = ev.target;
          if (!target)
            return reject(
              new Error(
                `Error getting result from IndexedDB store: '${storeName}'. Event target does not exist`
              )
            );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = (target as unknown as { result: any }).result;
          resolve(result);
        };

        req.onerror = ev => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          reject((ev.target as any).result as any);
        };
      });
    });
    return (await promise) as T;
  }

  private async initDb(database: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(database, version);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const key in Stores) {
          const storeProps = Stores[key as StoreTypes];
          const { keyPath } = storeProps;
          const store = db.createObjectStore(key, { keyPath });
          store.createIndex("id", "id", { unique: true });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        resolve(db);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

const db = new DB("templater", 1);

export default db;
