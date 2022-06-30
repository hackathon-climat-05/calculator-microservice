import { google, Auth } from 'googleapis'
import express from 'express'
import * as drive from './drive'
import * as calendar from './calendar'
import { User, initializeDatabase } from '@hackathon-climat-05/common-lib'
import { getEmissions } from './emissions'

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
    try {
        let authHeader = req.headers.authorization
        if (authHeader && Array.isArray(authHeader))
            authHeader = authHeader[0]

        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'unauthorized'
            })
            return
        }

        const jwt = authHeader.substr('Bearer '.length)
        const user = await User.verifyJWT(jwt)

        if (!user) {
            res.status(401).json({
                error: 'unauthorized'
            })
            return
        }

        const oauth2Client = new Auth.OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URL
        )

        oauth2Client.setCredentials({
            access_token: user.google_access_token,
            refresh_token: user.google_refresh_token,
            token_type: 'Bearer'
        })

        const { instant, history, details, score } = await getEmissions(oauth2Client)

        res.status(200).json({
            instant,
            history,
            details,
            score
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({})
    }
})

app.all('/*', (req, res) => {
    res.status(404).json({})
})

initializeDatabase().then(async () => {
    app.listen(PORT, HOST, () => {
        console.log(`${new Date().toISOString()} - Running on http://${HOST}:${PORT}`)
    })
}).catch(error => {
    console.error(error)
    process.exit(1)
})
