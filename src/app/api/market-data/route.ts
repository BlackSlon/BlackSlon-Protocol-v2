import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET() {
  try {
    // Wywołanie Twojego silnika w Pythonie
    const { stdout } = await execPromise('python3 path/to/market_engine.py');
    const data = JSON.parse(stdout);
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}