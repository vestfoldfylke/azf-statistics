const { app } = require("@azure/functions")
const { logger } = require("@vestfoldfylke/loglady")
const httpResponse = require("../lib/http-response")
const statDb = require("../lib/stat-db")

app.http("Systems", {
  methods: ["GET"],
  authLevel: "function",
  handler: async () => {
    logger.logConfig({
      prefix: "azf-statistics - Systems"
    })

    try {
      logger.info("Fetching collections/system names")
      const db = await statDb()

      const collections = await db.listCollections().toArray()
      logger.info("Successfully fetched collections/system names - Length: {CollectionLength}. Mapping to only collection names", collections.length)

      const collectionNames = collections.map((collection) => collection.name)
      logger.info("Successfully mapped collections to only collection names - Length: {CollectionNameLength}", collectionNames.length)

      return httpResponse(200, collectionNames)
    } catch (error) {
      logger.errorException(error, "Error fetching collections/system names")
      return httpResponse(500, error)
    }
  }
})
