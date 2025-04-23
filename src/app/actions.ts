import { currentUser } from '@clerk/nextjs/server'
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";

"use server"

export async function getOrCreateUser() {
    try {
        // Get current user from Clerk
        const { userId } = await auth();
        
        if (!userId) {
            throw new Error("User not authenticated");
        }
        
        // Get user details from Clerk
        const clerkUser = await currentUser();
        
        // Connect to MongoDB
        const { db } = await connectToDatabase();
        const usersCollection = db.collection("users");
        
        // Check if user exists in MongoDB
        const existingUser = await usersCollection.findOne({ userId: userId });
        
        if (existingUser) {
            return existingUser;
        }
        
        // Create new user in MongoDB
        const newUser = {
            userId: userId,
            email: clerkUser!.emailAddresses[0]?.emailAddress,
            name: `${clerkUser!.firstName} ${clerkUser!.lastName}`.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await usersCollection.insertOne(newUser);
        return newUser;
    } catch (error) {
        console.error("Error in getOrCreateUser:", error);
        throw error;
    }
}