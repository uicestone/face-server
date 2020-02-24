require("dotenv").config({ path: "./prisma/.env" })
import { GraphQLServer } from "graphql-yoga"
import { permissions } from "./permissions"
import { schema } from "./schema"
import { createContext, prisma } from "./context"
import bodyParser from "body-parser"
import { txIaiService } from "./utils/txsdk"
import express from "express"
import uuid from "uuid"
import fs from "fs"

const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions]
})

server.express
  .use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })
  .use(bodyParser.json({ limit: "5mb" }))
server.express
  .post("/api/tx/SearchFaces", async (req, res) => {
    const { Image } = req.body
    try {
      const result = await txIaiService.SearchPersons({ Image })
      console.log(result)
      res.json(result)
    } catch (error) {
      throw new Error(error)
    }
  })
  .post("/api/tx/SearchPersons", async (req, res) => {
    const { Image } = req.body
    try {
      const result = await txIaiService.SearchPersons({ Image })
      console.log(result)
      res.json(result)
    } catch (error) {
      throw new Error(error)
    }
  })
  .post("/api/tx/CreatePerson", async (req, res) => {
    const { Image, Gender, PersonId = uuid.v4(), PersonName, PersonLevel, PersonAge, Building, Room, CommunityId } = req.body
    try {
      const result = await txIaiService.CreatePerson({ Image, Gender, PersonId, PersonName })
      const [uint] = await prisma.unit.findMany({ where: { building: Building, room: Room, community: { id: CommunityId } } })
      const resident = await prisma.resident.upsert({
        where: {
          id: result.SimilarPersonId || PersonId
        },
        update: {},
        create: {
          id: result.SimilarPersonId || PersonId,
          level: PersonLevel,
          name: PersonName,
          age: PersonAge,
          unit: uint
            ? {
                connect: {
                  id: uint.id
                }
              }
            : {
                create: {
                  building: Building,
                  room: Room,
                  community: {
                    connect: {
                      id: CommunityId
                    }
                  }
                }
              },
          community: {
            connect: {
              id: CommunityId
            }
          }
        }
      })
      if (!result.SimilarPersonId) {
        const img = Image.split(",")[1]
        await fs.promises.writeFile(process.cwd() + `/static/${PersonId}.png`, img, { encoding: "base64" })
      }

      res.json({ person: result, resident })
    } catch (error) {
      throw new Error(error)
    }
  })
  .use("/static", express.static("static"))

server.start({ tracing: false, endpoint: "/graphql", playground: "/graphql" }, () => console.log(`🚀 Server ready at: http://localhost:4000/graphql\n`))
