import tx from "tencentcloud-sdk-nodejs"
import config from "../config"

const IaiClient = tx.iai.v20180301.Client
const models = tx.iai.v20180301.Models

const Credential = tx.common.Credential
const ClientProfile = tx.common.ClientProfile
const HttpProfile = tx.common.HttpProfile

const faceGroupId = process.env.TX_FACE_GROUP_ID || "community-face"

let cred = new Credential(config.txSecretID, config.txSecretKey)
let httpProfile = new HttpProfile()
httpProfile.endpoint = "iai.tencentcloudapi.com"
let clientProfile = new ClientProfile()
clientProfile.httpProfile = httpProfile
let client = new IaiClient(cred, "ap-shanghai", clientProfile)

export class TxIaiService {
  async SearchPersons({ Image, GroupIds = [faceGroupId], ...args }: { Image: string; GroupIds?: Array<string>; [key: string]: any }): Promise<any> {
    const req = new models.SearchPersonsRequest()
    req.from_json_string(JSON.stringify({ Image: Image.split(",")[1], GroupIds, FaceMatchThreshold: 60, NeedPersonInfo: 1, ...args }))
    return new Promise((res, rej) => {
      client.SearchPersons(req, (err, response) => {
        if (err) return rej(err)
        res(response)
      })
    })
  }
  async SearchFaces({ Image, GroupIds = [faceGroupId], ...args }: { Image: string; GroupIds?: Array<string>; [key: string]: any }) {
    const req = new models.SearchFacesRequest()
    req.from_json_string(JSON.stringify({ Image: Image.split(",")[1], GroupIds, FaceMatchThreshold: 60, NeedPersonInfo: 1, ...args }))

    return new Promise((res, rej) => {
      client.SearchFaces(req, (err, response) => {
        if (err) return rej(err)
        res(response)
      })
    })
  }

  async CreatePerson({
    Image,
    PersonName,
    GroupId = faceGroupId,
    PersonId,
    Gender = 0,
    ...args
  }: {
    Image: string
    PersonName: string
    PersonId: number
    Gender?: number
    [key: string]: any
  }): Promise<any> {
    const req = new models.CreatePersonRequest()
    req.from_json_string(JSON.stringify({ Image: Image.split(",")[1], UniquePersonControl: 1, NeedPersonInfo: 1, PersonName, GroupId, PersonId, Gender, ...args }))
    return new Promise((res, rej) => {
      client.CreatePerson(req, (err, response) => {
        if (err) return rej(err)
        res(response)
      })
    })
  }
}

export const txIaiService = new TxIaiService()
