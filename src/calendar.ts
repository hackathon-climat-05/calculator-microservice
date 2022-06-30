import { google, Auth } from 'googleapis'
import moment from 'moment'

const calendar = google.calendar('v3')

const getVideoDuration = async (auth: Auth.OAuth2Client) => {
    const calendarList = await calendar.calendarList.list({
        auth
    })

    const calendars = (calendarList as any).data.items

    let activity: any = {}

    await Promise.all(calendars.map(async (cal: any) => {
        const result = await calendar.events.list({
            calendarId: cal.id,
            auth
        })

        const events = (result as any).data.items

        events.forEach((event: any) => {
            if (!event.hangoutLink)
                return

            const duration = new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()
            const date = moment(event.start.dateTime).format('YYYY-MM-DD')
            activity[date] = (activity[date] || 0) + duration / 1000
        })
    }))

    return activity
}

export {
    getVideoDuration
}
