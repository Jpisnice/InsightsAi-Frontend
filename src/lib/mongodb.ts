import {MongoClient} from "mongodb"

export const connectToDatabase = async ()=>{
    try {
        if (process.env.MONGODB_URI === undefined) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db(process.env.MONGODB_DB_NAME || 'insightsai');

        console.log('Connected to MongoDB successfully');
        return { client, db };
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}