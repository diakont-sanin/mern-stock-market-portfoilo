# Description
Web application for tracking your portfolio on stock market

Currently available MOEX and SPB exchange

# Setup
`npm install && cd client && npm install`

# Run Locally
Before starting, you must add the "config" folder in your root directory with the file "default.json" containing

```json
{
    "port":5000,
    "jwtSecret":"yourJwtSecret",
    "mongoUri":"yourMongoUri"
}
```
From root directory: `npm run dev`
