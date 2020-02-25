import xlsx from "xlsx"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const wb = xlsx.readFile("./data.xlsx")

const units: { building: string; room: string; level: string }[] = []

for (const name in wb.Sheets) {
  const sheetData = xlsx.utils.sheet_to_json(wb.Sheets[name]) as { [head: string]: any }
  sheetData.forEach((line: { [head: string]: any }) => {
    const address = line["居住地址"]
    const remark = line["备注"]
    const [, building, room] = address.match(/(\d+)号(\d+)/)
    if (!building || typeof building !== "string" || !room || typeof room !== "string") {
      throw `Invalid address: ${address}.`
    }
    const unit = { building, room, level: "GREEN" }
    if (remark) {
      if (remark === 2) {
        unit.level = "YELLOW"
      } else if (remark === 3) {
        unit.level = "RED"
      } else {
        throw `Invalid remark: ${remark}.`
      }
    }
    units.push(unit)
  })
}

;(async () => {
  await prisma.community.create({ data: { name: "宝钢一村", units: { create: units } } })
  console.log("Import finished.")
  process.exit()
})()
