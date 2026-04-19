const { logger } = require("@vestfoldfylke/loglady")
const statDb = require("../stat-db")
const httpResponse = require("../http-response")

module.exports = async (start, end) => {
  logger.logConfig({
    prefix: "azf-statistics - Grafana - Systems overview"
  })

  try {
    logger.info("Fetching collections/system names")
    const db = await statDb()
    const collections = await db.listCollections().toArray()
    logger.info("Successfully fetched collections/system names - Length: {CollectionLength}", collections.length)

    const result = []
    let documentCount = 0
    const filter = {
      createdTimestamp: {
        $gte: start,
        $lte: end
      }
    }

    for (const collectionObject of collections) {
      const collection = db.collection(collectionObject.name)
      const documentCountInCollection = await collection.countDocuments(filter)
      documentCount += documentCountInCollection
      logger.info("Successfully fetched {DocumentCountInCollection} documents from collection {CollectionObjectName}", documentCountInCollection, collectionObject.name)
      result.push({
        system: collectionObject.name,
        count: documentCountInCollection
      })
    }

    logger.info("Successfully fetched a total of {DocumentCount} documents in time range {Start} <-> {End}", documentCount, start, end)
    return httpResponse(200, result)
  } catch (error) {
    logger.errorException(error, "Error fetching collections/system names")
    return httpResponse(500, error)
  }
}
