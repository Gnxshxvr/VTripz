import 'dotenv/config';
import { generateTripItinerary } from './utils/gemini.js';
import fs from 'fs';

async function test() {
    try {
        const trip = await generateTripItinerary({
            destination: "Kyoto, Japan",
            budget: 15000,
            duration: "2 Days",
            travelMode: "Bus",
            preference: "Temple",
            groupSize: 2
        });
        console.log("Success");
    } catch (err) {
        fs.writeFileSync('error_detailed.txt', err.stack || err.message || String(err));
    }
}
test();
