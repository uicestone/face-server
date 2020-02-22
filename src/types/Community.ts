import { objectType, extendType } from "nexus"

export const Community = objectType({
  name: "Community",
  definition(t) {
    t.model.id()
    t.model.address()
    t.model.name()
    t.model.users()
    t.model.residents()
    t.model.units()
  }
})

export const CommunityQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.community()
    t.crud.communities({
      filtering: true,
      pagination: true,
      ordering: true
    })
  }
})

export const CommunityMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.upsertOneCommunity()
    t.crud.createOneCommunity()
    t.crud.deleteOneCommunity()
    t.crud.deleteManyCommunity()
    t.crud.updateManyCommunity()
    t.crud.updateOneCommunity()
  }
})
