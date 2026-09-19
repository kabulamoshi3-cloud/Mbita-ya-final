import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const cronSecret = process.env.CRON_SECRET;

console.log('🧪 Testing Auto-Sync Cron Endpoint\n');
console.log('='.repeat(60));
console.log(`Base URL: ${baseUrl}`);
console.log(`Cron Secret: ${cronSecret ? '✅ Set' : '❌ Not set'}`);
console.log('='.repeat(60));
console.log();

if (!cronSecret) {
  console.log('❌ ERROR: CRON_SECRET not set in .env file');
  console.log('\nTo fix:');
  console.log('1. Generate a secret: openssl rand -base64 32');
  console.log('2. Add to .env: CRON_SECRET=your_generated_secret');
  process.exit(1);
}

async function testCronEndpoint() {
  try {
    console.log('🔄 Sending request to cron endpoint...\n');
    
    const startTime = Date.now();
    
    const response = await fetch(`${baseUrl}/api/cron/auto-sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    });

    const duration = Date.now() - startTime;
    const result = await response.json();
    
    console.log(`⏱️  Request completed in ${duration}ms\n`);
    console.log('='.repeat(60));
    
    if (response.ok) {
      console.log('✅ CRON TEST PASSED\n');
      
      console.log('📊 Sync Results:');
      console.log(`   Total Duration: ${result.duration}ms`);
      console.log(`   Platforms Synced: ${result.sync?.platforms?.length || 0}`);
      console.log(`   Items Synced: ${result.sync?.totalSynced || 0}`);
      console.log(`   Sync Errors: ${result.sync?.totalErrors || 0}`);
      console.log();
      
      console.log('📥 Import Results:');
      console.log(`   New Publications: ${result.import?.imported || 0}`);
      console.log(`   Updated: ${result.import?.updated || 0}`);
      console.log(`   Skipped (Duplicates): ${result.import?.skipped || 0}`);
      console.log(`   Import Errors: ${result.import?.errors || 0}`);
      console.log();
      
      if (result.sync?.platforms) {
        console.log('🔍 Platform Details:');
        result.sync.platforms.forEach(platform => {
          const icon = platform.status === 'success' ? '✅' : '❌';
          console.log(`   ${icon} ${platform.platform}: ${platform.count || 0} items (${platform.status})`);
          if (platform.error) {
            console.log(`      Error: ${platform.error}`);
          }
        });
        console.log();
      }
      
      console.log('💬 Message:', result.message);
      
      if (result.skipped) {
        console.log('\n⚠️  Note: Auto-sync is currently disabled in profile settings');
      }
    } else {
      console.log('❌ CRON TEST FAILED\n');
      console.log(`Status Code: ${response.status}`);
      console.log(`Error: ${result.error || 'Unknown error'}`);
      
      if (response.status === 401) {
        console.log('\n💡 Fix: Check that CRON_SECRET matches between .env and request');
      } else if (response.status === 500) {
        console.log('\n💡 Fix: Check server logs for detailed error');
        console.log('   - Database connection');
        console.log('   - API endpoint accessibility');
        console.log('   - Platform scraper functionality');
      }
    }
    
    console.log('='.repeat(60));
    
    // Full response for debugging
    if (process.argv.includes('--verbose')) {
      console.log('\n📄 Full Response:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('\nℹ️  Run with --verbose flag to see full response');
    }
    
  } catch (error) {
    console.log('='.repeat(60));
    console.log('❌ REQUEST FAILED\n');
    console.log('Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Is the development server running? (npm run dev)');
    console.log('   - Is the BASE_URL correct in .env?');
    console.log('   - Check network connectivity');
    console.log('='.repeat(60));
  }
}

// Run the test
testCronEndpoint();
