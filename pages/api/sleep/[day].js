// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from "path";
import fs from "fs"

const sleepJsonPath = path.resolve("data/sleep.json");
console.log(sleepJsonPath)
let sleepData = fs.existsSync(sleepJsonPath)
  ? JSON.parse(fs.readFileSync(sleepJsonPath))
  : [];

export default function handler(req, res) {
  const { day: dateKey } = req.query;
  const year = parseInt(dateKey.substring(2, 4));
  const month = parseInt(dateKey.substring(4, 6));
  const day = parseInt(dateKey.substring(6, 8));
  res
    .status(200)
    .json({ year, month, day, wakeWindow: calcWakeTime(month, day, year) });
}

function calcWakeTime(month, day, year) {
  const dateFilter = `${month}/${day}/${year}`;

  // filter date from data
  let datesNaps = sleepData.filter((x) => x.date === dateFilter);
  datesNaps = datesNaps.map(({ date, time, end, duration }) => ({
    date,
    time: new Date(time),
    end: new Date(end),
    duration,
  }));

  // filter out everything after 7am
  const now = new Date();
  const morning = new Date(year + 2000, month - 1, day, 7);
  const evening = new Date(year + 2000, month - 1, day, 19, 0, 0);

  let dayStart = datesNaps.find(
    (x, index, arr) =>
      (x.end < morning &&
        index < arr.length - 1 &&
        arr[index + 1]?.time > morning) ||
      (x.time < morning && x.end > morning)
  )?.end;

  if (!dayStart) dayStart = morning;

  let dayEnd = datesNaps.find((x) => x.end > evening)?.time;
  if (!dayEnd) dayEnd = now < evening ? now : evening;

  const diffMs = dayEnd.getTime() - dayStart.getTime();
  const diffMin = diffMs / 60000;

  // sum total sleep after dayStart
  const totalHours =
    datesNaps
      .filter((x) => x.time >= dayStart && x.end <= dayEnd)
      .reduce((sum, { duration }) => {
        return sum - duration;
      }, diffMin) / 60;

  return { totalHours, dayStart, dayEnd, naps: datesNaps };
}
