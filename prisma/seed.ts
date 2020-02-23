import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      login: "guard",
      name: "测试门岗",
      role: "guard",
      password: await hash("1234", 10),
      community: {
        create: {
          name: "测试小区",
          address: "地球村233弄76号"
        }
      }
    }
  })
}

main().finally(async () => {
  await prisma.disconnect()
})
