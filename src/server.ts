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
  .post("/tx/SearchFaces", async (req, res) => {
    const { Image } = req.body
    try {
      const result = await txIaiService.SearchPersons({ Image })
      console.log(result)
      res.json(result)
    } catch (error) {
      throw new Error(error)
    }
  })
  .post("/tx/SearchPersons", async (req, res) => {
    const { Image } = req.body
    try {
      const result = await txIaiService.SearchPersons({ Image })
      console.log(result)
      res.json(result)
    } catch (error) {
      throw new Error(error)
    }
  })
  .post("/tx/CreatePerson", async (req, res) => {
    const { Image, Gender, PersonId = uuid.v4(), PersonName, PersonLevel, PersonAge, UnidId, CommunityId } = req.body
    try {
      const result = await txIaiService.CreatePerson({ Image, Gender, PersonId, PersonName })
      // const resident = await prisma.resident.upsert({
      //   where: {
      //     id: PersonId
      //   },
      //   update: {},
      //   create: {
      //     id: PersonId,
      //     level: PersonLevel,
      //     name: PersonName,
      //     age: PersonAge,
      //     unit: {
      //       connect: UnidId
      //     },
      //     community: {
      //       connect: CommunityId
      //     }
      //   }
      // })
      if (!result.SimilarPersonId) {
        const img = Image.split(",")[1]
        await fs.promises.writeFile(process.cwd() + `/static/${PersonId}.png`, img, { encoding: "base64" })
      }

      res.json({ person: result })
    } catch (error) {
      throw new Error(error)
    }
  })
  .use("/static", express.static("static"))

server.start({ tracing: false }, () => console.log(`🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#5-using-the-graphql-api`))
