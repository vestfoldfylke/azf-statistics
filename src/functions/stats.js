const { app } = require("@azure/functions")
const { logger } = require("@vestfoldfylke/loglady")
const statDb = require("../lib/stat-db")
const httpResponse = require("../lib/http-response")
const { createStatistic } = require("../lib/create-statistic")
const { parseQueryFilter } = require("../lib/parse-query")

app.http("Stats", {
  methods: ["POST", "GET"],
  authLevel: "function",
  route: "Stats/{system?}",
  handler: async (request) => {
    logger.logConfig({
      prefix: "azf-statistics - Stat"
    })

    if (request.method.toUpperCase() === "POST") {
      let body
      try {
        body = await request.json()
      } catch {
        return httpResponse(400, "Please provide a request body")
      }
      if (!body) {
        return httpResponse(400, "Please provide a request body")
      }

      const statsData = body

      const { system } = request.params

      if (system) {
        logger.info("System is present in params, overriding system in statistics data (body)")
        statsData.system = system
      }

      let stat
      try {
        logger.info("Creating statistics object")
        stat = createStatistic(body)
        logger.info("Created statistics object. System: {System}", stat.system)
      } catch (error) {
        logger.errorException(error, "Error creating statistics object")
        return httpResponse(400, error)
      }

      try {
        const db = await statDb()
        const collection = db.collection(stat.system)
        logger.info("Uploading statistics object to MongoDB. System: {System}", stat.system)
        const res = await collection.insertOne(stat)
        logger.info("Successfully uploaded statistics object to MongoDB. System: {System}", stat.system)
        return httpResponse(200, res)
      } catch (error) {
        logger.errorException(error, "Error uploading statistics object to MongoDB. System: {System}", stat.system)
        return httpResponse(500, error)
      }
    }

    if (request.method.toUpperCase() === "GET") {
      const { system } = request.params
      if (!system) {
        return httpResponse(400, "Please provide a system name")
      }

      logger.info("Fetching statistics for system {System}", system)
      logger.info("First fetching collections/system names to see that the collection/system exists")

      try {
        const db = await statDb()
        const collections = await db.listCollections().toArray()
        logger.info("Successfully fetched collections/system names - Length: {CollectionLength}. Mapping to only collection names", collections.length)
        const collectionNames = collections.map((collection) => collection.name)
        logger.info("Successfully mapped collections to only collection names - Length: {CollectionNameLength}", collectionNames.length)

        if (!collectionNames.includes(system)) {
          logger.error('System "{System}" not found in collections', system)
          return httpResponse(404, `System "${system}" not found`)
        }

        logger.info('System "{System}" found in collections - fetching all documents for system', system)
        const collection = db.collection(system)

        const filter = request.query.get("filter")
        const count = request.query.get("count")
        const select = request.query.get("select")

        let queryFilter = {}
        if (filter) {
          queryFilter = parseQueryFilter(filter)
        }

        // Default projection
        let projection = {
          _id: 1,
          system: 1,
          engine: 1,
          createdTimestamp: 1,
          county: 1,
          company: 1,
          department: 1,
          description: 1,
          projectId: 1,
          externalId: 1,
          type: 1
        }

        if (select) {
          if (select.trim() === "all") {
            // Cannot use * due to azure waf (web application firewall)
            projection = {}
          } else {
            projection = select.split(",").reduce((acc, prop) => {
              acc[prop.trim()] = 1
              return acc
            }, {})
          }
        }

        const stats = count === "true" ? await collection.countDocuments(queryFilter) : await collection.find(queryFilter).project(projection).toArray()

        logger.info(
          'Successfully fetched all documents for system "{System}" - Length: {StatLength}. count: {Count}. select: {Select}',
          system,
          stats.length || stats,
          count === "true",
          select || "default"
        )

        return httpResponse(200, stats)
      } catch (error) {
        logger.errorException(error, "Error fetching stats for system")
        return httpResponse(500, error)
      }
    }
  }
})
