import 'dotenv/config';
import fs from 'fs';

async function test() {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const names = data.models ? data.models.map(m => m.name) : data;
    fs.writeFileSync('models.txt', JSON.stringify(names, null, 2));
}
test();
