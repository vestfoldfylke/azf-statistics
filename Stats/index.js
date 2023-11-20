const statDb = require('../lib/stat-db')
const httpResponse = require('../lib/http-response')
const { createStatistic } = require('../lib/create-statistic')
const { logger, logConfig } = require('@vtfk/logger')

module.exports = async function (context, req) {
  logConfig({
    prefix: 'azf-statistics - Stat'
  })
  const { body } = req
  if (!body) return httpResponse(400, 'Please provide a request body')
  let stat
  try {
    logger('info', ['Creating statistics object'], context)
    stat = createStatistic(body)
    logger('info', ['Created statistics object', 'system', stat.system], context)
  } catch (error) {
    logger('error', ['Error creating statistics object', error.toString()], context)
    return httpResponse(400, error)
  }
  try {
    const db = await statDb()
    const collection = db.collection(stat.system)
    logger('info', ['Uploading statistics object to MongoDB', 'system', stat.system], context)
    const res = await collection.insertOne(stat)
    logger('info', ['Successfully uploaded statistics object to MongoDB', 'system', stat.system], context)
    return httpResponse(200, res)
  } catch (error) {
    logger('error', ['Error uploading statistics object to MongoDB', 'system', stat.system, 'error', error.toString()], context)
    return httpResponse(500, error)
  }
}
