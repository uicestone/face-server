import { objectType, extendType, ext } from "nexus"
import { compare, hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { stringArg } from "nexus"
import { APP_SECRET } from "../utils"

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token")
    t.field("user", { type: "User" })
  }
})

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.login()
    t.model.posts({ pagination: false })
    t.model.plot()
  }
})

export const userQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.user()
    t.crud.users({
      filtering: true,
      pagination: true,
      ordering: true
    })
  }
})
export const userMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.upsertOneUser()
    t.crud.createOneUser()
    t.crud.deleteOneUser()
    t.crud.deleteManyUser()
    t.crud.updateOneUser()
    t.crud.updateManyUser()
    t.field("signup", {
      type: "AuthPayload",
      args: {
        name: stringArg(),
        login: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (_parent, args, ctx) => {
        const { name, login, password } = args
        const hashedPassword = await hash(password, 10)
        const user = await ctx.prisma.user.create({
          data: {
            name,
            login,
            role: "User",
            password: hashedPassword
          }
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user
        }
      }
    })

    t.field("login", {
      type: "AuthPayload",
      args: {
        login: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (_parent, { login, password }, context) => {
        const user = await context.prisma.user.findOne({
          where: {
            login
          }
        })
        if (!user) {
          throw new Error(`No user found for login: ${login}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error("Invalid password")
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user
        }
      }
    })
  }
})
