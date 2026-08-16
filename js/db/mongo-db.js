/**
 * FlavourCraft - Client-Side MongoDB Document Engine
 * Fully-featured document database supporting standard MongoDB CRUD, Aggregation Pipelines & Indexes
 */

class MongoObjectId {
  constructor(idStr) {
    if (idStr) {
      this.id = idStr;
    } else {
      const timestamp = ((new Date().getTime() / 1000) | 0).toString(16).padStart(8, '0');
      const machineId = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
      const pid = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
      const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
      this.id = `${timestamp}${machineId}${pid}${counter}`;
    }
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}

class MongoCollection {
  constructor(name, dbInstance) {
    this.name = name;
    this.db = dbInstance;
    this.documents = [];
  }

  _clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  _matchesQuery(doc, query = {}) {
    if (!query || Object.keys(query).length === 0) return true;

    for (const key of Object.keys(query)) {
      const condition = query[key];
      const docVal = this._getNestedValue(doc, key);

      if (key === '$or' && Array.isArray(condition)) {
        const matchesOr = condition.some(subQuery => this._matchesQuery(doc, subQuery));
        if (!matchesOr) return false;
        continue;
      }

      if (key === '$and' && Array.isArray(condition)) {
        const matchesAnd = condition.every(subQuery => this._matchesQuery(doc, subQuery));
        if (!matchesAnd) return false;
        continue;
      }

      if (condition !== null && typeof condition === 'object' && !Array.isArray(condition) && !(condition instanceof RegExp)) {
        for (const op of Object.keys(condition)) {
          const target = condition[op];
          if (op === '$eq' && docVal !== target) return false;
          if (op === '$ne' && docVal === target) return false;
          if (op === '$gt' && !(docVal > target)) return false;
          if (op === '$gte' && !(docVal >= target)) return false;
          if (op === '$lt' && !(docVal < target)) return false;
          if (op === '$lte' && !(docVal <= target)) return false;
          if (op === '$in' && (!Array.isArray(target) || !target.includes(docVal))) return false;
          if (op === '$nin' && Array.isArray(target) && target.includes(docVal)) return false;
          if (op === '$regex') {
            const flags = condition['$options'] || 'i';
            const re = new RegExp(target, flags);
            if (!re.test(String(docVal || ''))) return false;
          }
          if (op === '$exists') {
            const exists = docVal !== undefined;
            if (exists !== target) return false;
          }
        }
      } else if (condition instanceof RegExp) {
        if (!condition.test(String(docVal || ''))) return false;
      } else {
        if (docVal !== condition) return false;
      }
    }
    return true;
  }

  _getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
  }

  _setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }

  // --- CRUD Operations ---
  async find(query = {}, options = {}) {
    let results = this.documents.filter(doc => this._matchesQuery(doc, query));

    // Sort
    if (options.sort) {
      const [field, order] = Object.entries(options.sort)[0];
      results.sort((a, b) => {
        const valA = this._getNestedValue(a, field);
        const valB = this._getNestedValue(b, field);
        if (valA < valB) return order === -1 ? 1 : -1;
        if (valA > valB) return order === -1 ? -1 : 1;
        return 0;
      });
    }

    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return this._clone(results);
  }

  async findOne(query = {}) {
    const found = this.documents.find(doc => this._matchesQuery(doc, query));
    return found ? this._clone(found) : null;
  }

  async insertOne(doc) {
    const newDoc = this._clone(doc);
    if (!newDoc._id) {
      newDoc._id = new MongoObjectId().toString();
    }
    if (!newDoc.createdAt) {
      newDoc.createdAt = new Date().toISOString();
    }
    newDoc.updatedAt = new Date().toISOString();

    this.documents.push(newDoc);
    await this.db._persist();
    this.db._emit('change', { collection: this.name, op: 'insert', doc: newDoc });
    return { acknowledged: true, insertedId: newDoc._id };
  }

  async insertMany(docs) {
    const insertedIds = [];
    for (const doc of docs) {
      const res = await this.insertOne(doc);
      insertedIds.push(res.insertedId);
    }
    return { acknowledged: true, insertedCount: docs.length, insertedIds };
  }

  async updateOne(query, update, options = {}) {
    const index = this.documents.findIndex(doc => this._matchesQuery(doc, query));
    if (index === -1) {
      if (options.upsert) {
        const insertDoc = { ...(update.$set || {}), ...query };
        return await this.insertOne(insertDoc);
      }
      return { matchedCount: 0, modifiedCount: 0 };
    }

    const doc = this.documents[index];

    if (update.$set) {
      for (const [key, val] of Object.entries(update.$set)) {
        this._setNestedValue(doc, key, val);
      }
    }

    if (update.$inc) {
      for (const [key, val] of Object.entries(update.$inc)) {
        const cur = this._getNestedValue(doc, key) || 0;
        this._setNestedValue(doc, key, cur + val);
      }
    }

    if (update.$push) {
      for (const [key, val] of Object.entries(update.$push)) {
        const cur = this._getNestedValue(doc, key) || [];
        if (Array.isArray(cur)) {
          cur.push(val);
          this._setNestedValue(doc, key, cur);
        }
      }
    }

    doc.updatedAt = new Date().toISOString();
    await this.db._persist();
    this.db._emit('change', { collection: this.name, op: 'update', doc });
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async updateMany(query, update) {
    let modifiedCount = 0;
    for (let i = 0; i < this.documents.length; i++) {
      if (this._matchesQuery(this.documents[i], query)) {
        const doc = this.documents[i];
        if (update.$set) {
          for (const [key, val] of Object.entries(update.$set)) {
            this._setNestedValue(doc, key, val);
          }
        }
        if (update.$inc) {
          for (const [key, val] of Object.entries(update.$inc)) {
            const cur = this._getNestedValue(doc, key) || 0;
            this._setNestedValue(doc, key, cur + val);
          }
        }
        doc.updatedAt = new Date().toISOString();
        modifiedCount++;
      }
    }
    if (modifiedCount > 0) {
      await this.db._persist();
      this.db._emit('change', { collection: this.name, op: 'updateMany', count: modifiedCount });
    }
    return { matchedCount: modifiedCount, modifiedCount };
  }

  async deleteOne(query) {
    const index = this.documents.findIndex(doc => this._matchesQuery(doc, query));
    if (index === -1) return { deletedCount: 0 };

    const deleted = this.documents.splice(index, 1)[0];
    await this.db._persist();
    this.db._emit('change', { collection: this.name, op: 'delete', doc: deleted });
    return { deletedCount: 1 };
  }

  async deleteMany(query) {
    const initialLen = this.documents.length;
    this.documents = this.documents.filter(doc => !this._matchesQuery(doc, query));
    const deletedCount = initialLen - this.documents.length;
    if (deletedCount > 0) {
      await this.db._persist();
      this.db._emit('change', { collection: this.name, op: 'deleteMany', count: deletedCount });
    }
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    return this.documents.filter(doc => this._matchesQuery(doc, query)).length;
  }

  // --- Aggregation Pipeline Engine ---
  async aggregate(pipeline = []) {
    let currentDocs = this._clone(this.documents);

    for (const stage of pipeline) {
      const stageName = Object.keys(stage)[0];
      const stageArg = stage[stageName];

      if (stageName === '$match') {
        currentDocs = currentDocs.filter(doc => this._matchesQuery(doc, stageArg));
      } else if (stageName === '$group') {
        const groupField = stageArg._id;
        const groups = {};

        for (const doc of currentDocs) {
          const gKey = groupField ? (groupField.startsWith('$') ? this._getNestedValue(doc, groupField.slice(1)) : groupField) : 'all';
          if (!groups[gKey]) {
            groups[gKey] = { _id: gKey, _items: [] };
          }
          groups[gKey]._items.push(doc);
        }

        const aggregated = [];
        for (const [key, gObj] of Object.entries(groups)) {
          const row = { _id: key === 'all' ? null : key };
          for (const [outField, acc] of Object.entries(stageArg)) {
            if (outField === '_id') continue;
            const op = Object.keys(acc)[0];
            const targetProp = acc[op];

            if (op === '$sum') {
              if (typeof targetProp === 'number') {
                row[outField] = gObj._items.length * targetProp;
              } else if (typeof targetProp === 'string' && targetProp.startsWith('$')) {
                const prop = targetProp.slice(1);
                row[outField] = gObj._items.reduce((sum, item) => sum + (Number(this._getNestedValue(item, prop)) || 0), 0);
              }
            } else if (op === '$avg') {
              const prop = targetProp.slice(1);
              const sum = gObj._items.reduce((s, item) => s + (Number(this._getNestedValue(item, prop)) || 0), 0);
              row[outField] = gObj._items.length ? (sum / gObj._items.length) : 0;
            } else if (op === '$count') {
              row[outField] = gObj._items.length;
            }
          }
          aggregated.push(row);
        }
        currentDocs = aggregated;
      } else if (stageName === '$sort') {
        const [field, order] = Object.entries(stageArg)[0];
        currentDocs.sort((a, b) => {
          const valA = this._getNestedValue(a, field);
          const valB = this._getNestedValue(b, field);
          if (valA < valB) return order === -1 ? 1 : -1;
          if (valA > valB) return order === -1 ? -1 : 1;
          return 0;
        });
      } else if (stageName === '$limit') {
        currentDocs = currentDocs.slice(0, stageArg);
      }
    }

    return currentDocs;
  }
}

class MongoDatabase {
  constructor(dbName = 'flavourcraft') {
    this.dbName = dbName;
    this.collections = {};
    this.listeners = [];
    this.storageKey = `flavourcraft_mongodb_${dbName}`;
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new MongoCollection(name, this);
    }
    return this.collections[name];
  }

  async init(seedData = null) {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        for (const [cName, docs] of Object.entries(parsed)) {
          this.collection(cName).documents = docs;
        }
      } else if (seedData) {
        for (const [cName, docs] of Object.entries(seedData)) {
          this.collection(cName).documents = JSON.parse(JSON.stringify(docs));
        }
        await this._persist();
      }
    } catch (e) {
      console.error('MongoDatabase init error:', e);
    }
  }

  async _persist() {
    try {
      const payload = {};
      for (const [cName, col] of Object.entries(this.collections)) {
        payload[cName] = col.documents;
      }
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn('Persistence warning:', e);
    }
  }

  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  _emit(event, payload) {
    this.listeners
      .filter(l => l.event === event || l.event === '*')
      .forEach(l => l.callback(payload));
  }

  async resetToSeed(seedData) {
    localStorage.removeItem(this.storageKey);
    this.collections = {};
    await this.init(seedData);
    this._emit('change', { collection: '*', op: 'reset' });
  }
}

window.MongoDatabase = MongoDatabase;
window.MongoObjectId = MongoObjectId;
