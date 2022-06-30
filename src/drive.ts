import { google, Auth } from 'googleapis'
import moment from 'moment'
const drive = google.drive('v3');

const oauth2Client = new Auth.OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
)

oauth2Client.setCredentials({
    access_token: '',
    refresh_token: '',
    token_type: 'Bearer'
});

const getDriveTotalSize = async () => {
    const request = {
        fields: '*',
        auth: oauth2Client
    };

    const result = await drive.files.list(request);
    const files = (result as any).data.files;
    return Object.keys(files).reduce((sum, key) => sum + parseInt(files[key].size), 0)
}

const getFilesActivity = async () => {
    let activity: any = {};
    let response: any;
    for (let index = 1; index !== undefined; index = response.data.nextPageToken) {
        const request = {
            fields: '*',
            pageToken: index.toString(),
            auth: oauth2Client
        };
        response = await drive.changes.list(request);

        for (let j = 0; j < response.data.changes.length; j++) {
            if (!response.data.changes[j].file?.size) {
                continue
            }
            const date = moment(response.data.changes[j].time).format('YYYY-MM-DD')
            activity[date] = (activity[date] || 0) + parseInt(response.data.changes[j].file?.size || 0)
        }

    }

    return activity;
}

export {getDriveTotalSize, getFilesActivity}