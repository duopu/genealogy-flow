/*
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
*/

import express from 'express'
import cors from 'cors'
import fs from 'fs'
import bodyParser from 'body-parser'
// import path from 'path'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const app = express()

app.use(cors())

const PORT = 3050

// 中间件
app.use(bodyParser.json())

// 保存代码到文件
app.post('/api/save_json', async (req, res) => {
  const { apiName, apiData } = req.body
  let saveData = apiData.saveData

  if (isMergeApi(apiName)) {
    const originData = await getOriginData(apiName)
    saveData = { ...originData, ...saveData }
  }
  fs.writeFile(`../data/${apiName}.json`, JSON.stringify(saveData, null, 2), (err) => {
    if (err) {
      console.error('Error saving code:', err)
      return res.json({ code: 500, message: 'Error saving code' + JSON.stringify(err) })
    }
    res.json({ message: `${apiName} 参数保存成功`, code: 200 })
  })
})

// 从文件加载代码
app.post('/api/query_json', (req, res) => {
  const { apiName, apiData } = req.body
  const _path = path.join(__dirname, `../data/${apiName}.json`)

  fs.readFile(_path, 'utf8', (err, data) => {
    if (err) {
      console.error('Error loading code:', err)
      return res.json({ code: 500, message: 'Error loading code' + JSON.stringify(err) })
    }
    res.json({ data: JSON.parse(data), code: 200, message: `${apiName} 查询成功` })
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

export const mergeApi = ['save_variable']

export const isMergeApi = (apiName) => {
  return mergeApi.some((item) => item.startsWith(apiName))
}

export const getOriginData = (apiName) => {
  return new Promise((resolve) => {
    fs.readFile(`../data/${apiName}.json`, 'utf8', (err, data) => {
      if (err) {
        console.error('Error loading code:', err)
        resolve({})
      }
      if (data) {
        const oldData = JSON.parse(data)
        resolve(oldData)
      }
    })
  })
}
