import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export async function GET() {
  try {
    // Dynamiczna ścieżka do skryptu Pythona
    const scriptPath = path.join(process.cwd(), 'api', 'market_engine.py');
    
    // Wywołanie skryptu Pythona
    const { stdout } = await execPromise(`python3 ${scriptPath}`);
    const data = JSON.parse(stdout);
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}