import mongoose from "mongoose"
 const url = process.env.MONGO_URL as string

const connectDB = () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(url)

    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function() {
        console.log('Database connected')
    })
}

export default connectDB
