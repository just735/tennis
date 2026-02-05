const fs = require('fs')
const path = require('path')
const initSqlJs = require('sql.js')
const config = require('../config')

const dataDir = path.dirname(config.dbPath)
fs.mkdirSync(dataDir, { recursive: true })

const schemaPath = path.join(__dirname, 'schema.sql')
const schema = fs.readFileSync(schemaPath, 'utf-8')

let dbPromise = null

const loadDatabase = async () => {
  if (dbPromise) return dbPromise
  dbPromise = initSqlJs().then((SQL) => {
    let db
    if (fs.existsSync(config.dbPath)) {
      const fileBuffer = fs.readFileSync(config.dbPath)
      db = new SQL.Database(fileBuffer)
    } else {
      db = new SQL.Database()
    }
    db.exec(schema)
    return db
  })
  return dbPromise
}

const persist = (db) => {
  const data = db.export()
  fs.writeFileSync(config.dbPath, Buffer.from(data))
}

const run = async (sql, params = []) => {
  const db = await loadDatabase()
  const stmt = db.prepare(sql)
  stmt.bind(params)
  stmt.step()
  stmt.free()
  const result = db.exec('SELECT last_insert_rowid() as id')
  const lastID = result?.[0]?.values?.[0]?.[0] || null
  persist(db)
  return { lastID }
}

const get = async (sql, params = []) => {
  const db = await loadDatabase()
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const row = stmt.step() ? stmt.getAsObject() : null
  stmt.free()
  return row
}

const all = async (sql, params = []) => {
  const db = await loadDatabase()
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

module.exports = {
  run,
  get,
  all
}
