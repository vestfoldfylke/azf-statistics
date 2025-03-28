const handleAllSystemsOverview = require('../lib/grafana/handle-all-systems-overview')
const handleAllSystemsStatistics = require('../lib/grafana/handle-all-systems-statistics')
const handleSystem = require('../lib/grafana/handle-system')
const httpResponse = require('../lib/http-response')
const validation = require('../lib/grafana/validate-grafana-request')

const allSystem = 'all'

module.exports = async function (context, req) {
  const { system } = req.params

  const { result, message, start, end } = validation(req.query, context)
  if (!result) {
    return httpResponse(400, message)
  }

  if (!system) {
    return await handleAllSystemsOverview(context, start, end)
  }

  if (system === allSystem) {
    return await handleAllSystemsStatistics(context, start, end)
  }

  return await handleSystem(context, system.trim(), start, end)
}
