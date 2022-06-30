import dotenv from 'dotenv'
dotenv.config()


import express from 'express'
import {getDriveTotalSize, getFilesActivity} from './drive'
// import CommonLib from '@hackathon-climat-05/common-lib'


const PORT = parseInt(process.env.PORT || '8080', 10)
const HOST = process.env.HOST || '0.0.0.0'

const app = express()

app.use(express.json())

app.get('/livez', (req, res) => {
    res.status(200).json({
        live: true
    })
})

app.get('/data', async (req, res) => {
    const driveTotalSize = await getDriveTotalSize();
    const filesActivity = await getFilesActivity();
    res.status(200).json({
        // driveTotalSize,
        filesActivity
    })
})

app.get('/*', (req, res) => {
    res.status(404).json({})
})

app.listen(PORT, HOST, () => {
    console.log(`${new Date().toISOString()} - Running on http://${HOST}:${PORT}`)
})