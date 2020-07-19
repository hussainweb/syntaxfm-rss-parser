const fs = require('fs');
const rssParser = require('rss-parser');
const stats = require("stats-lite");

(async () => {
    const parser = new rssParser();
    const feed = await parser.parseURL('https://feed.syntax.fm/rss');

    // Or you can download the file manually with wget, like so:
    // wget -O rss.rss https://feed.syntax.fm/rss
    // comment the line above with parseURL
    // and uncomment the following two lines
    // const xmlString = fs.readFileSync('./rss.rss');
    // const feed = await parser.parseString(xmlString);
 
    const durations = feed.items.map(item => {
        const duration = item.itunes.duration || '00:00';
        return duration.split(':').reduce((acc, time) => (60 * acc) + +time);
    });

    const formatDuration = duration => {
        let seconds = Math.floor(duration % 60);
        duration /= 60;
        let minutes = Math.floor(duration % 60);
        duration /= 60;
        let hours = Math.floor(duration % 24);
        duration /= 24
        let days = Math.floor(duration);
        return `${days} days ${hours}:${minutes}:${seconds}`;
    };

    console.log("sum: %s", formatDuration(stats.sum(durations)));
    console.log("mean: %s", formatDuration(stats.mean(durations)));
    console.log("median: %s", formatDuration(stats.median(durations)));
    console.log("variance: %s", formatDuration(stats.variance(durations)));
    console.log("standard deviation: %s", formatDuration(stats.stdev(durations)));
    console.log("sample standard deviation: %s", formatDuration(stats.sampleStdev(durations)));
    console.log("85th percentile: %s", formatDuration(stats.percentile(durations, 0.85)));
    console.log("histogram:", stats.histogram(durations, 10));
})();
