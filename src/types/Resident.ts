import { objectType, extendType } from "nexus"

export const Resident = objectType({
  name: "Resident",
  definition(t) {
    t.model.id()
    t.model.age()
    t.model.level()
    t.model.name()
    t.model.community()
    t.model.unit()
  }
})

export const ResidentQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.resident()
    t.crud.residents({
      filtering: true,
      pagination: true,
      ordering: true
    })
  }
})

export const ResidentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.upsertOneResident()
    t.crud.createOneResident()
    t.crud.deleteOneResident()
    t.crud.deleteManyResident()
    t.crud.updateManyResident()
    t.crud.updateOneResident()
  }
})
