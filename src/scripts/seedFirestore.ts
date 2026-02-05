/**
 * Seed Firestore Database with Initial Car Data
 * 
 * This script populates the Firestore database with the initial car data
 * from carsData.ts. Run this once to set up your database.
 * 
 * Usage:
 * 1. Make sure Firebase is configured in firebase.config.ts
 * 2. Run: npm run seed-db (add this script to package.json)
 * 3. Or import and call seedDatabase() from your app
 */

import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { carsData } from '../data/carsData';

const COLLECTIONS = {
    CARS: 'cars',
};

/**
 * Seed the cars collection
 */
async function seedCars() {
    console.log('🚗 Seeding cars collection...');

    try {
        for (const car of carsData) {
            // Use the car ID as the document ID for consistency
            const carRef = doc(db, COLLECTIONS.CARS, car.id.toString());
            await setDoc(carRef, car);
            console.log(`✅ Added car: ${car.name}`);
        }

        console.log(`✨ Successfully seeded ${carsData.length} cars!`);
    } catch (error) {
        console.error('❌ Error seeding cars:', error);
        throw error;
    }
}

/**
 * Main seed function
 */
export async function seedDatabase() {
    console.log('🌱 Starting database seed...\n');

    try {
        await seedCars();
        console.log('\n🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('\n💥 Database seeding failed:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
