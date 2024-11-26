/**
 *
 * @param {string} string
 * @returns
 */
const trimQuotes = (string) => {
  if (string.at(0) === "'") string = string.substring(1)
  if (string.at(-1) === "'") string = string.substring(0, string.length - 1)
  return string
}

/**
 *
 * @param {string} part
 * @returns
 */
const parseFilterPart = (part) => {
  const query = {}
  const operators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte']
  let isInsideQuotes = false
  let property = ''
  let value = ''
  const foundOperators = []
  // Gå gjennom strengen og sjekk greier
  for (let i = 0; i < part.length; i++) {
    if (part.charAt(i) === "'") {
      if (i !== 0 && part.charAt(i - 1).includes('\\')) {
        // The quote is escaped, so we don't toggle isInsideQuotes
      } else {
        isInsideQuotes = !isInsideQuotes // Toggle isInsideQuotes if the quote is not escaped
      }
    }
    if (part.charAt(i) === ' ') { // If we are at a space, we need to check if we have a operator
      for (const operator of operators) {
        if (part.substring(i + 1, i + operator.length + 2) === `${operator} ` && !isInsideQuotes) { // We don't want to find logical operators inside quotes, e.g. story: 'i took the book and the bird'
          foundOperators.push(operator)
          property = part.substring(0, i)
          value = part.substring(i + operator.length + 2)
        }
      }
    }
  }
  // Can parse value if we need to - dont do it yet
  if (foundOperators.length !== 1) throw new Error(`You must use exactly one operator in a statement. Statement: "${part}"`)
  if (property.length === 0) throw new Error(`You must provide a property in a statement. Statement: "${part}"`)
  if (value.length === 0) throw new Error(`You must provide a value in a statement. Statement: "${part}"`)

  property = trimQuotes(property).trim()
  value = trimQuotes(value).trim()
  const operator = `$${foundOperators[0]}`

  query[property] = { [operator]: value } // WE MIGHT need to check for different values than string

  return query
}

/**
 *
 * @param {string} filter
 * @returns
 */
const parseQueryFilter = (filter) => {
  if (typeof filter !== 'string') throw new Error('Filter must be a string')
  const query = {}
  const logicalOperators = ['and', 'or', 'nor', 'not']

  // First we need to find the logical operators outside of parenthesis
  let level = 0 // If level is 0, we are outside of parenthesis, above 0 we are inside
  let isInsideQuotes = false // If we are inside quotes, we don't want to check for logical operators
  const parts = [] // Parts on top level outside of parenthesis
  let currentPart = '' // Current part we are building
  const subparts = [] // Subparts inside parenthesis
  let currentSubPart = '' // Current subpart we are building
  const foundLogicalOperators = []
  for (let i = 0; i < filter.length; i++) {
    if (filter.charAt(i) === '(') { // If we are inside parenthesis, we need to build a subpart
      level++
      if (level === 1) continue // We don't want to add the first parenthesis (level 1) to the subpart, but others we need to add, in case there are nested parenthesis
    }
    if (filter.charAt(i) === ')') {
      if (level === 1) { // If we are at the end of a subpart, we need to push the current subpart to the subparts array
        subparts.push(currentSubPart)
        currentSubPart = '' // Reset the current subpart
      }
      level--
      if (level === 0) continue // We don't want to add the last parenthesis (level 0) to the subpart, but nested parenthesis we need to add
    }
    if (level === 0) {
      if (filter.charAt(i) === "'") {
        if (i !== 0 && filter.charAt(i - 1).includes('\\')) {
          // The quote is escaped, so we don't toggle isInsideQuotes
        } else {
          isInsideQuotes = !isInsideQuotes // Toggle isInsideQuotes if the quote is not escaped
        }
      }
      if (filter.charAt(' ')) { // If we are at a space, we need to check if we have a logical operator
        for (const logicalOperator of logicalOperators) {
          if (filter.substring(i + 1, i + logicalOperator.length + 2) === `${logicalOperator} ` && !isInsideQuotes) { // We don't want to find logical operators inside quotes, e.g. story: 'i took the book and the bird'
            foundLogicalOperators.push(logicalOperator)
            if (currentPart.trim().length > 0) parts.push(currentPart) // Don't need to push empty parts
            currentPart = ''
            i += logicalOperator.length + 1
            continue // We don't want to add the logical operator to the current part, so we skip to after the logical operator
          }
        }
        currentPart += filter.charAt(i)
      }
    }
    if (level > 0) currentSubPart += filter.charAt(i) // If we are inside parenthesis, we need to add the char to the current subpart
    if (i === filter.length - 1 && currentPart.trim().length > 0) parts.push(currentPart) // If we are at the end of the filter, we need to push the current part to the parts array
  }
  if (!foundLogicalOperators.every((operator) => operator === foundLogicalOperators[0])) throw new Error(`You must use parenthesis when using multiple logical operators in a filter. Filter: "${filter}"`)
  const logicalOperator = foundLogicalOperators[0] ? `$${foundLogicalOperators[0]}` : '$and'

  query[logicalOperator] = [...(parts.map(part => parseFilterPart(part))), ...subparts.map((subpart) => parseQueryFilter(subpart))]

  return query
}

/*
const test = "'hall o o ' eq 'fdf' and (externalId eq 'halla' or type eq 'test') "

console.log(JSON.stringify(parseQueryFilter(test), null, 2))
*/

module.exports = { parseQueryFilter }