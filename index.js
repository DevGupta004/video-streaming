// const express = require('express');
const app = require('express')();

const fs = require('fs');

const PORT = process.env.PORT || 8100;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/playvideo', (req, res) => {
    const range = req.headers.range
    console.log(range);

    const videoPath = "./terminal.mp4";

    const videoSize = fs.statSync(videoPath).size;

    console.log('File size: ' + videoSize);
    console.log(videoSize);

    const chunkSize = 1 * 1e6;

    const start = Number(range.replace(/\D/g,""));

    const end = Math.min(start+chunkSize, videoSize - 1);

    const contentLength = end - start + 1;

    //set header for playing video 
    const header = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4",
    }

    res.writeHead(206, header);

    const stream = fs.createReadStream(videoPath, {start, end});

    stream.pipe(res);
})

app.listen(
    PORT,
    () => console.log(`listening on port https://localhost:${PORT}`),
);