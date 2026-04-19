module.exports = [
  {
    name: "smart-referat-publisering",
    container: "smart-referat",
    query: {
      system: "smart",
      type: "Møtereferat-publisering",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.regarding": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        const regarding = stat.tasks.find((t) => t.regarding)?.regarding ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "smart-referat-arkivering",
    container: "smart-referat",
    query: {
      system: "smart",
      type: "Møtereferat-arkivering",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.regarding": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        const regarding = stat.tasks.find((t) => t.regarding)?.regarding ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "acos-skjema-arkivering",
    container: "acos-skjema",
    query: {
      system: "AcosTo360",
      type: "Arkivering",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.method": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        const regarding = stat.tasks.find((t) => t.method)?.method ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "acos-skjema-til-sharepoint",
    container: "acos-skjema",
    query: {
      system: "AcosToTeams",
      type: "Arkivering",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.method": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        const regarding = stat.tasks.find((t) => t.method)?.method ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "IDM-onboarding",
    container: "idm",
    query: {
      system: "IDM",
      type: "IDMOnBoarding",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.method": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        const regarding = stat.tasks.find((t) => t.method)?.method ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "IDM-offboarding",
    container: "idm",
    query: {
      system: "IDM",
      type: "IDMOffBoarding",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.method": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        const regarding = stat.tasks.find((t) => t.method)?.method ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "arkivering-av-pc-kontrakter",
    container: "digitroll",
    query: {
      system: "digitroll",
      type: "Arkivering",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.method": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        const regarding = stat.tasks.find((t) => t.method)?.method ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "arkivering-av-vigo-elevdokumentasjon",
    container: "vigo-elevdokumentasjon",
    query: {
      system: "vigo-isi",
      type: "Arkivering",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.method": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        let method = stat.tasks.find((t) => t.method && t.method.toLowerCase() !== "syncelevmappe" && t.method !== "dispatch" && t.method !== "signOff" && t.method !== "archive")?.method
        if (!method) method = stat.tasks.find((t) => t.method)?.method
        const regarding = method ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "vis-til-arkiv",
    container: "vis-til-arkiv",
    query: {
      system: "vis-til-arkiv",
      type: "Arkivering",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.method": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        let method = stat.tasks.find((t) => t.method && t.method !== "syncElevmappe")?.method
        if (!method) method = stat.tasks.find((t) => t.method)?.method
        const regarding = method ?? null
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          regarding,
          ideMetode: `${stat.projectId} ${regarding}`
        }
      })
    }
  },
  {
    name: "masseutsendelse",
    container: "masseutsendelse",
    query: {
      system: "masseutsendelse",
      type: "masseutsendelse",
      status: "completed"
    },
    projection: {
      _id: 0,
      system: 1,
      type: 1,
      projectId: 1,
      "tasks.method": 1
    },
    mapper: (stats) => {
      return stats.map((stat) => {
        const privatepersons = stat.tasks.filter((t) => t.method === "SyncPrivatePerson").length
        const enterprises = stat.tasks.filter((t) => t.method === "SyncEnterprise").length
        return {
          system: stat.system,
          type: stat.type,
          projectId: stat.projectId,
          privatepersons,
          enterprises,
          ideMetode: `${stat.projectId} masseutsendelse`
        }
      })
    }
  }
]
