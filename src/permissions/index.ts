import { rule, shield, allow } from "graphql-shield"
import { getUser } from "../utils"
import { Context } from "../context"

const rules = {
  isAuthenticatedUser: rule()((parent, args, ctx: Context) => {
    const { userId } = getUser(ctx)
    return Boolean(userId)
  }),
  isCommunityManager: rule()(async (parent, { where: { id } }, ctx: Context) => {
    const { userId } = getUser(ctx)
    const community = await ctx.prisma.user.findOne({ where: { id: userId } }).community()
    return id == community?.id
  }),
  isPostOwner: rule()(async (parent, { id }, ctx: Context) => {
    const { userId } = getUser(ctx)
    const author = await ctx.prisma.post
      .findOne({
        where: {
          id
        }
      })
      .author()
    return userId === author?.id
  })
}

//https://github.com/maticzav/graphql-shield
export const permissions = shield({
  Query: {
    community: allow,
    communities: allow,
    resident: allow,
    residents: allow,
    passRecord: allow,
    passRecords: allow,
    unit: allow,
    units: allow,
    user: allow,
    users: allow
  },
  Mutation: {
    upsertOneCommunity: allow,
    createOneCommunity: allow,
    deleteOneCommunity: allow,
    deleteManyCommunity: allow,
    updateManyCommunity: allow,
    updateOneCommunity: allow,
    upsertOneResident: allow,
    createOneResident: allow,
    deleteOneResident: allow,
    deleteManyResident: allow,
    updateManyResident: allow,
    updateOneResident: allow,
    upsertOnePassRecord: allow,
    createOnePassRecord: allow,
    deleteOnePassRecord: allow,
    deleteManyPassRecord: allow,
    updateManyPassRecord: allow,
    updateOnePassRecord: allow,
    upsertOneUnit: allow,
    createOneUnit: allow,
    deleteOneUnit: allow,
    deleteManyUnit: allow,
    updateManyUnit: allow,
    updateOneUnit: allow,
    upsertOneUser: allow,
    createOneUser: allow,
    deleteOneUser: allow,
    deleteManyUser: allow,
    updateManyUser: allow,
    updateOneUser: allow
  }
})
