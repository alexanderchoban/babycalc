# BabyCalc
BabyCalc can read CSV data from dropbox exported by "Baby Tracker" and run analytics and statistics

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables &amp; Dropbox

The app requires an env variable of `DB_ACCESS_TOKEN` that contains an api access token for drop box. The app will then look for `csv.zip` in the root of its access.

## Docker

    sudo docker build . -t babycalc
    docker run -it -p 3000:3000 --env-file .env.local babycalc