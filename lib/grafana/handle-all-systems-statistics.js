const { logger, logConfig } = require('@vtfk/logger')
const statDb = require('../stat-db')
const httpResponse = require('../http-response')
const groupDocuments = require('./group-documents')

module.exports = async function (context, start, end) {
  logConfig({
    prefix: 'azf-statistics - Grafana - Systems statistics'
  })

  try {
    logger('info', ['Fetching collections/system names'], context)
    const db = await statDb()
    const collections = await db.listCollections().toArray()
    logger('info', [`Successfully fetched collections/system names - Length: ${collections.length}`], context)

    const results = []
    const filter = {
      createdTimestamp: {
        $gte: start,
        $lte: end
      }
    }

    for (const collectionObject of collections) {
      const collection = db.collection(collectionObject.name)
      const documents = await collection.find(filter).toArray()
      if (documents.length === 0) {
        continue
      }

      logger('info', [`Successfully fetched ${documents.length} documents from collection ${collectionObject.name}`], context)
      results.push(
        documents.map(document => {
          return {
            timestamp: document.createdTimestamp,
            [collectionObject.name]: 1
          }
        })
      )
    }

    const result = groupDocuments(results.flat()).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    logger('info', [`Successfully fetched a total of ${result.length} documents in time range ${start} <-> ${end}`], context)
    return httpResponse(200, result)
  } catch (error) {
    logger('error', ['Error fetching collections/system names', error.toString()], context)
    return httpResponse(500, error)
  }
}
