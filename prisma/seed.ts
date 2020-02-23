import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
import { create } from "domain"

const prisma = new PrismaClient()

async function main() {
  await prisma.community.create({
    data: {
      name: "测试小区",
      phone: "23333333",
      address: "地球村233弄76号",
      users: {
        create: [
          {
            login: "guard",
            password: await hash("1234", 10),
            name: "测试门岗",
            role: "guard"
          }
        ]
      },
      manager: {
        create: {
          login: "manager",
          password: await hash("1234", 10),
          name: "测试书记",
          role: "manager"
        }
      }
    }
  })
}

main().finally(async () => {
  await prisma.disconnect()
})
