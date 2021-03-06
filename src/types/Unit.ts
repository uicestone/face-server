import { objectType, extendType } from "nexus"

export const Unit = objectType({
  name: "Unit",
  definition(t) {
    t.model.id()
    t.model.building()
    t.model.room()
    t.model.level()
    t.model.residents()
    t.model.community()
  }
})

export const UnitQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.unit()
    t.crud.units({
      filtering: true,
      pagination: true,
      ordering: true
    })
  }
})

export const UnitMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.upsertOneUnit()
    t.crud.createOneUnit()
    t.crud.deleteOneUnit()
    t.crud.deleteManyUnit()
    t.crud.updateManyUnit()
    t.crud.updateOneUnit()
  }
})
