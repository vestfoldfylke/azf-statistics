const { logger } = require("@vestfoldfylke/loglady")
const statDb = require("../stat-db")
const httpResponse = require("../http-response")
const groupDocuments = require("./group-documents")

module.exports = async (start, end) => {
  logger.logConfig({
    prefix: "azf-statistics - Grafana - Systems statistics"
  })

  try {
    logger.info("Fetching collections/system names")
    const db = await statDb()
    const collections = await db.listCollections().toArray()
    logger.info("Successfully fetched collections/system names - Length: {CollectionLength}", collections.length)

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

      logger.info("Successfully fetched {DocumentLength} documents from collection {CollectionObjectName}", documents.length, collectionObject.name)
      results.push(
        documents.map((document) => {
          return {
            timestamp: document.createdTimestamp,
            [collectionObject.name]: 1
          }
        })
      )
    }

    const result = groupDocuments(results.flat()).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    logger.info("Successfully fetched a total of {ResultLength} documents in time range {Start} <-> {End}", result.length, start, end)
    return httpResponse(200, result)
  } catch (error) {
    logger.errorException(error, "Error fetching collections/system names")
    return httpResponse(500, error)
  }
}
