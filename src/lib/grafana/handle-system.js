const { logger } = require("@vestfoldfylke/loglady")
const statDb = require("../stat-db")
const httpResponse = require("../http-response")
const groupDocuments = require("./group-documents")

module.exports = async (system, start, end) => {
  logger.logConfig({
    prefix: `azf-statistics - Grafana - ${system}`
  })

  try {
    logger.info("Fetching collections/system names")
    const db = await statDb()
    const collection = db.collection(system)

    if (!collection) {
      logger.error("System {System} not found", system)
      return httpResponse(404, { message: `System ${system} not found` })
    }

    const filter = {
      createdTimestamp: {
        $gte: start,
        $lte: end
      }
    }

    const documents = await collection.find(filter).toArray()
    logger.info("Successfully fetched {DocumentLength} documents from collection {System} in time range {Start} <-> {End}", documents.length, system, start, end)

    const result = documents.map((document) => {
      return {
        timestamp: document.createdTimestamp,
        [document.type]: 1
      }
    })

    const groupedResult = groupDocuments(result)
    return httpResponse(200, groupedResult)
  } catch (error) {
    logger.errorException(error, "Error fetching collections/system names")
    return httpResponse(500, error)
  }
}
