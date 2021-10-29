const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");
const csv = require("fast-csv");
const Dropbox = require("dropbox").Dropbox;

const DATA_DIR = "./data";

let lastDownload = fs.existsSync(`${DATA_DIR}/lastDownload.json`)
  ? JSON.parse(fs.readFileSync(`${DATA_DIR}/lastDownload.json`))
  : { rev: 0 };

export default async function handler(req, res) {
  if (!fs.existsSync(DATA_DIR)) {
    console.log("Making directory");
    fs.mkdirSync(DATA_DIR);
  }

  const dbx = new Dropbox({
    accessToken: process.env.DB_ACCESS_TOKEN,
  });

  const {
    result: { entries },
  } = await dbx.filesListFolder({ path: "" });

  const { rev } = entries.find((entry) => entry.name === "csv.zip");

  if (!fs.existsSync(`${DATA_DIR}/csv.zip`) || rev !== lastDownload.rev) {
    await downloadCsv(dbx);
  } else {
    console.log("No file to download");
  }

  res.status(200).json({ status: "SUCCESS" });
}

async function downloadCsv(dbx) {
  const { result: data } = await dbx.filesDownload({ path: "/csv.zip" });

  fs.writeFileSync(`${DATA_DIR}/${data.name}`, data.fileBinary, {
    encoding: "binary",
  });
  fs.writeFileSync(
    `${DATA_DIR}/lastDownload.json`,
    JSON.stringify({ rev: data.rev })
  );
  console.log(`File: ${data.name} saved.`);

  await extract(`${DATA_DIR}/${data.name}`, {
    dir: path.resolve(DATA_DIR),
  });

  console.log("Extracted!");

  const filenames = fs.readdirSync(DATA_DIR);
  makeSleepJson(filenames.find((fileName) => fileName.includes("sleep.csv")));
}

function makeSleepJson(filepath) {
  let sleepJson = [];

  fs.createReadStream(path.resolve(DATA_DIR, filepath))
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      const date = row.Time.split(",")[0];
      const timeZoneOffset = new Date(date).getTimezoneOffset() / 60;
      sleepJson.push({
        date,
        time: new Date(`${row.Time}-${timeZoneOffset}:00`),
        end: new Date(
          new Date(`${row.Time}-${timeZoneOffset}:00`).getTime() +
            parseInt(row["Duration(minutes)"]) * 60000
        ),
        duration: parseInt(row["Duration(minutes)"]),
      });
    })
    .on("end", (rowCount) => {
      sleepJson.sort((a, b) => a.time - b.time);
      fs.writeFileSync(`${DATA_DIR}/sleep.json`, JSON.stringify(sleepJson));
      console.log("Saved sleep json");
    });
}
