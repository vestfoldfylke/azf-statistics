const assert = require("node:assert")
const { describe, test } = require("node:test")
const { createStatistic } = require("../src/lib/create-statistic")

describe("Statistics object is handled correctly", () => {
  test("When all fields are provided", () => {
    const stat = {
      system: "et system",
      engine: "v1",
      county: "Fylkemann",
      company: "sektoren",
      department: "seksjon",
      description: "Beskrivelse av jobben som er gjort for dette elementet",
      type: "test-stat",
      externalId: "Id001",
      projectId: "12"
    }

    const unmodifiedStat = JSON.parse(JSON.stringify(stat))
    const generatedStat = createStatistic(stat)

    assert.strictEqual(unmodifiedStat.system, generatedStat.system)
    assert.strictEqual(unmodifiedStat.engine, generatedStat.engine)
    assert.strictEqual(unmodifiedStat.county, generatedStat.county)
    assert.strictEqual(unmodifiedStat.company, generatedStat.company)
    assert.strictEqual(unmodifiedStat.department, generatedStat.department)
    assert.strictEqual(unmodifiedStat.description, generatedStat.description)
    assert.strictEqual(unmodifiedStat.type, generatedStat.type)
    assert.strictEqual(unmodifiedStat.externalId, generatedStat.externalId)
    assert.strictEqual(unmodifiedStat.projectId, generatedStat.projectId)
    assert.ok(generatedStat.createdTimestamp)
  })

  test("When all required fields are provided, but not optional", () => {
    const stat = {
      system: "et system",
      engine: "v1",
      company: "sektoren",
      description: "Beskrivelse av jobben som er gjort for dette elementet",
      type: "test-stat"
    }

    const unmodifiedStat = JSON.parse(JSON.stringify(stat))
    const generatedStat = createStatistic(stat)

    assert.strictEqual(unmodifiedStat.system, generatedStat.system)
    assert.strictEqual(unmodifiedStat.engine, generatedStat.engine)
    assert.strictEqual(generatedStat.county, "fylke") // default value from config
    assert.strictEqual(unmodifiedStat.company, generatedStat.company)
    assert.strictEqual(generatedStat.department, unmodifiedStat.company)
    assert.strictEqual(unmodifiedStat.description, generatedStat.description)
    assert.strictEqual(unmodifiedStat.type, generatedStat.type)
    assert.strictEqual(generatedStat.externalId, "ukjent")
    assert.strictEqual(generatedStat.projectId, "ingen prosjekttilknytning")
  })

  test("When all fields are provided with extra fields", () => {
    const stat = {
      system: "et system",
      engine: "v1",
      county: "Fylkemann",
      company: "sektoren",
      department: "seksjon",
      description: "Beskrivelse av jobben som er gjort for dette elementet",
      type: "test-stat",
      externalId: "Id001",
      projectId: "12",
      etEkstraFelt: "verdi",
      endaEtEkstraFelt: "verdi2"
    }

    const unmodifiedStat = JSON.parse(JSON.stringify(stat))
    const generatedStat = createStatistic(stat)

    assert.strictEqual(unmodifiedStat.system, generatedStat.system)
    assert.strictEqual(unmodifiedStat.engine, generatedStat.engine)
    assert.strictEqual(unmodifiedStat.county, generatedStat.county)
    assert.strictEqual(unmodifiedStat.company, generatedStat.company)
    assert.strictEqual(unmodifiedStat.department, generatedStat.department)
    assert.strictEqual(unmodifiedStat.description, generatedStat.description)
    assert.strictEqual(unmodifiedStat.type, generatedStat.type)
    assert.strictEqual(unmodifiedStat.externalId, generatedStat.externalId)
    assert.strictEqual(unmodifiedStat.projectId, generatedStat.projectId)
    assert.ok(generatedStat.createdTimestamp)
    assert.strictEqual(generatedStat.etEkstraFelt, "verdi")
    assert.strictEqual(generatedStat.endaEtEkstraFelt, "verdi2")
  })

  test("When not stat object is flat, throws error", () => {
    const stat = {
      system: "et system",
      engine: "v1",
      county: "Fylkemann",
      company: "sektoren",
      department: "huhu",
      description: "Beskrivelse av jobben som er gjort for dette elementet",
      type: "test-stat",
      externalId: "Id001",
      projectId: "12",
      etEkstraFelt: "verdi",
      endaEtEkstraFelt: [" ups"]
    }

    assert.throws(() => createStatistic(stat))
  })

  test("When not stat object has wrong type, throws error", () => {
    const stat = {
      system: "et system",
      engine: "v1",
      county: "Fylkemann",
      company: "sektoren",
      department: 12,
      description: "Beskrivelse av jobben som er gjort for dette elementet",
      type: "test-stat",
      externalId: "Id001",
      projectId: "12",
      etEkstraFelt: "verdi"
    }

    assert.throws(() => createStatistic(stat))
  })
})
