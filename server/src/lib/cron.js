import cron from 'cron';
import https from 'https';

const job = new cron.CronJob("*/14 * * * *", function () {
    https
    .get(process.env.APP_URL, (res) => {
        if(res.statusCode === 200) {
            console.log("Cron job executed successfully at", new Date());
        } else {
            console.error("Cron job failed with status code:", res.statusCode);
        }
    })
    .on('error', (err) => {
        console.error("Error during cron job execution:", err);
    });
})

export default job;