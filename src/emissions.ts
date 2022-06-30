import { Auth } from 'googleapis'
import * as drive from './drive'
import * as calendar from './calendar'
import moment from 'moment'

// Storage : 2,0 gEqCO2 / an / Go
// Transfer : 1,4 gEqCO2 / Go
// Meet : 0,403 gEqCO2 / min (https://greenspector.com/fr/quelle-application-mobile-de-visioconference-pour-reduire-votre-impact-edition-2021/)

const getEmissions = async (auth: Auth.OAuth2Client) => {
    const [
        driveTotalSize,
        driveBandwidth,
        calendarDuration
    ] = await Promise.all([
        drive.getTotalSize(auth),
        drive.getBandwidth(auth),
        calendar.getVideoDuration(auth)
    ])

    const history: any = {}

    Object.entries(driveBandwidth).forEach(([date, item]) => {
        history[date] = (history[date] || 0) + (item as number) / (1000 * 1000 * 1000) * 1.4
    })

    Object.entries(calendarDuration).forEach(([date, item]) => {
        history[date] = (history[date] || 0) + (item as number) / (60) * 0.403
    })

    const today = moment().format('YYYY-MM-DD')

    const details = {
        drive: {
            name: "Google Drive",
            value: driveTotalSize / (1000 * 1000 * 1000) * 2.0 / 365
                + (driveBandwidth[today] || 0) / (1000 * 1000 * 1000) * 1.4
        },
        meet: {
            name: "Google Meet",
            value: (calendarDuration[today] || 0) / (60) * 0.403
        }
    }

    const instant = (
        details.drive.value
        + details.meet.value
    )

    return {
        instant,
        history,
        details,
        score: 0
    }
}

const getHistory = async (auth: Auth.OAuth2Client) => {
    const activity = await calendar.getVideoDuration(auth)
}

export {
    getEmissions
}
