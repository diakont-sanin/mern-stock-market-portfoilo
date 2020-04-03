const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')


const app = express()
app.use(express.json({extended:true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/holdings', require('./routes/holdings.routes'))
app.use('/api/watchlist', require('./routes/watchlist.routes'))
app.use('/api/total', require('./routes/total.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  }
  
  const PORT = process.env.PORT || config.get('port')
  
async function start(){
    try {
        mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useCreateIndex:true
        })
        app.listen(PORT,()=>console.log(`App has been started on port ${PORT}`))
    } catch (error) {
        console.log('Server error', error.message)
        process.exit(1)
    }
}
start()


