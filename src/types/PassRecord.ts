import { objectType, extendType } from "nexus"

export const PassRecord = objectType({
  name: "PassRecord",
  definition(t) {
    t.model.id()
    t.model.allow()
    t.model.date()
    t.model.direction()
    t.model.resident()
    t.model.community()
  }
})

export const PassRecordQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.passRecord()
    t.crud.passRecords({
      filtering: true,
      pagination: true,
      ordering: true
    })
  }
})

export const PassRecordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.upsertOnePassRecord()
    t.crud.createOnePassRecord()
    t.crud.deleteOnePassRecord()
    t.crud.deleteManyPassRecord()
    t.crud.updateManyPassRecord()
    t.crud.updateOnePassRecord()
  }
})
