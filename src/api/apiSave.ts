import { $post } from '@/api/request'

export const saveVariable = (data: any) => {
  return saveData(data)
}

export const queryVariable = (data?: any) => {
  return getData(data)
}

export const saveData = (data: any) => $post('api/save_json', data)
export const getData = (data?: any) => $post('api/query_json', data)
