
import { client } from './src/lib/sanity';
import { modulesQuery } from './src/lib/sanity.queries';

async function testFetch() {
  try {
    console.log('Fetching modules...');
    const modules = await client.fetch(modulesQuery);
    console.log('Success! Fetched', modules.length, 'modules.');
    process.exit(0);
  } catch (error) {
    console.error('Fetch failed:', error);
    process.exit(1);
  }
}

testFetch();
