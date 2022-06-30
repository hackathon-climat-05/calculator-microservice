import { google, Auth } from 'googleapis'
import moment from 'moment'

const drive = google.drive('v3')

const getTotalSize = async (auth: Auth.OAuth2Client) => {
    let totalSize = 0

    let pageToken = undefined
    do {
        const response: any = await drive.files.list({
            fields: 'nextPageToken,files(size)',
            pageSize: 1000,
            pageToken,
            auth
        })

        response.data.files?.forEach((file: any) => {
            totalSize += parseInt(file.size, 10)
        })

        pageToken = response.data.nextPageToken
    } while (pageToken !== undefined)
}

const getBandwidth = async (auth: Auth.OAuth2Client) => {
    let activity: any = {}

    let tokenResponse = await drive.changes.getStartPageToken({
        fields: 'startPageToken',
        auth
    })

    const startPageToken = parseInt(tokenResponse.data.startPageToken!, 10)

    let pageToken: string | undefined = '1'
    do {
        const response: any = await drive.changes.list({
            fields: 'nextPageToken,changes(file(size))',
            pageSize: 1000,
            pageToken,
            auth
        })

        console.log(`${parseInt(pageToken, 10) / startPageToken * 100}%`)

        response.data.changes?.forEach((item: any) => {
            if (!item.file)
                return

            const date = moment(item.time).format('YYYY-MM-DD')
            activity[date] = (activity[date] || 0) + parseInt(item.file.size)
        })

        pageToken = response.data.nextPageToken
    } while (pageToken !== undefined)

    return activity
}

export {
    getTotalSize,
    getBandwidth
}
