import { google, Auth } from 'googleapis'
import moment from 'moment'

const drive = google.drive('v3')

const getTotalSize = async (auth: Auth.OAuth2Client) => {
    const result = await drive.files.list({
        fields: '*',
        pageSize: 1000,
        auth
    })

    const files = (result as any).data.files
    return Object.values(files).reduce((sum: any, file: any) => sum + parseInt(file.size, 10), 0)
}

const getBandwidth = async (auth: Auth.OAuth2Client) => {
    let activity: any = {}

    let response: any
    for (let i = '1'; i !== undefined; i = response.data.nextPageToken) {
        response = await drive.changes.list({
            fields: '*',
            pageSize: 1000,
            pageToken: i,
            auth
        })

        response.data.changes.forEach((item: any) => {
            if (!item.file)
                return

            const date = moment(item.time).format('YYYY-MM-DD')
            activity[date] = (activity[date] || 0) + parseInt(item.file.size)
        })

    }

    return activity
}

export {
    getTotalSize,
    getBandwidth
}
