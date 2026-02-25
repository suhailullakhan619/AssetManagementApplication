import { formatDate } from "./DateFormater.js"
export function dateMStoddmmyyyy(ms){
let res=new Date(ms).toISOString()
let result=formatDate(res)
return result;
}
dateMStoddmmyyyy(1771477881040)