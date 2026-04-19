const { app } = require("@azure/functions")
const handleAllSystemsOverview = require("../lib/grafana/handle-all-systems-overview")
const handleAllSystemsStatistics = require("../lib/grafana/handle-all-systems-statistics")
const handleSystem = require("../lib/grafana/handle-system")
const httpResponse = require("../lib/http-response")
const validation = require("../lib/grafana/validate-grafana-request")

const allSystem = "all"

app.http("Grafana", {
  methods: ["GET"],
  authLevel: "function",
  route: "Grafana/{system?}",
  handler: async (request) => {
    const { system } = request.params
    const query = { start: request.query.get("start"), end: request.query.get("end") }

    const { result, message, start, end } = validation(query)
    if (!result) {
      return httpResponse(400, message)
    }

    if (!system) {
      return await handleAllSystemsOverview(start, end)
    }

    if (system === allSystem) {
      return await handleAllSystemsStatistics(start, end)
    }

    return await handleSystem(system.trim(), start, end)
  }
})
