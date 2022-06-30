import { google, Auth } from 'googleapis'
import moment from 'moment'

const drive = google.drive('v3')

const getInstant = async (auth: Auth.OAuth2Client) => {
    // TODO

    // 2,0 gEqCO2 / an / Go
    // 1,4 gEqCO2 / Go
}

const getHistory = async (auth: Auth.OAuth2Client) => {
    const activity = await calendar.getVideoDuration(auth)

    // 0,403 gEqCO2 / min
    // Source : https://greenspector.com/fr/quelle-application-mobile-de-visioconference-pour-reduire-votre-impact-edition-2021/
}

export {
    getInstant,
    getHistory
}
