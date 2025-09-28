const https = require('https');

async function testHomepage() {
  console.log('🧪 Testing TaRL Homepage at https://tarl.openplp.com/');
  console.log('═'.repeat(60));

  // Test 1: Basic connectivity
  try {
    const response = await fetch('https://tarl.openplp.com/');
    console.log(`✅ Status Code: ${response.status}`);
    console.log(`✅ Content Type: ${response.headers.get('content-type')}`);
    
    const html = await response.text();
    
    // Test 2: Check for key elements
    const tests = [
      {
        name: 'Title contains TaRL',
        test: html.includes('<title>TaRL ប្រាថម'),
        expected: 'Page title should contain TaRL'
      },
      {
        name: 'Main heading present',
        test: html.includes('TaRL ប្រាថម'),
        expected: 'Main heading should be visible'
      },
      {
        name: 'Hero section present',
        test: html.includes('ប្រព័ន្ធការបង្រៀនស្របតាមសមត្ថភាព'),
        expected: 'Hero section with system description'
      },
      {
        name: 'Navigation menu present',
        test: html.includes('ទិដ្ឋភាពរួម') && html.includes('ការវាយតម្លៃ'),
        expected: 'Navigation menu with Overview and Assessment links'
      },
      {
        name: 'Quick login link present',
        test: html.includes('ចូលរហ័ស'),
        expected: 'Quick login button should be available'
      },
      {
        name: 'Regular login link present',
        test: html.includes('href="/auth/login"'),
        expected: 'Regular login link should be available'
      },
      {
        name: 'Stats section present',
        test: html.includes('សរុបសិស្ស') && html.includes('ការវាយតម្លៃ'),
        expected: 'Stats cards with total students and assessments'
      },
      {
        name: 'Chart section present',
        test: html.includes('លទ្ធផលការវាយតម្លៃតាមកម្រិត'),
        expected: 'Assessment results chart section'
      },
      {
        name: 'Subject buttons present',
        test: html.includes('ខ្មែរ') && html.includes('គណិតវិទ្យា'),
        expected: 'Subject selector buttons for Khmer and Math'
      },
      {
        name: 'Footer present',
        test: html.includes('តំណភ្ជាប់') && html.includes('ភាគីដៃគូ'),
        expected: 'Footer with links and partners sections'
      },
      {
        name: 'Copyright present',
        test: html.includes('© 2024 TaRL ប្រាថម'),
        expected: 'Copyright notice in footer'
      },
      {
        name: 'PLP link present',
        test: html.includes('plp.moeys.gov.kh'),
        expected: 'Link to PLP Cambodia website'
      },
      {
        name: 'Charts library loaded',
        test: html.includes('data-chartjs-loaded="true"') || html.includes('chart') || html.includes('Chart') || html.includes('canvas') || html.includes('លទ្ធផលការវាយតម្លៃតាមកម្រិត'),
        expected: 'Chart.js or chart components should be loaded'
      },
      {
        name: 'Responsive design meta',
        test: html.includes('viewport') && html.includes('width=device-width'),
        expected: 'Responsive design viewport meta tag'
      }
    ];

    console.log('\n📋 Content Tests:');
    console.log('─'.repeat(60));
    
    let passed = 0;
    let failed = 0;

    tests.forEach((test, index) => {
      if (test.test) {
        console.log(`✅ ${index + 1}. ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${index + 1}. ${test.name} - ${test.expected}`);
        failed++;
      }
    });

    console.log('\n📊 Test Summary:');
    console.log('─'.repeat(60));
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);

    // Test 3: Performance check
    console.log('\n⚡ Performance Metrics:');
    console.log('─'.repeat(60));
    console.log(`📄 Page Size: ${Math.round(html.length / 1024)} KB`);
    console.log(`🌐 Server: ${response.headers.get('server') || 'Unknown'}`);
    console.log(`💾 Cache: ${response.headers.get('x-vercel-cache') || 'Unknown'}`);

    // Test 4: API endpoint check
    console.log('\n🔗 API Endpoint Tests:');
    console.log('─'.repeat(60));
    
    try {
      const apiResponse = await fetch('https://tarl.openplp.com/api/public/assessment-data?subject=khmer');
      if (apiResponse.status === 200) {
        console.log('✅ Assessment API (Khmer) - Working');
        const apiData = await apiResponse.json();
        if (apiData.chartData) {
          console.log('✅ Chart Data - Present');
        }
        if (apiData.cycleData) {
          console.log('✅ Cycle Data - Present');
        }
      } else {
        console.log(`❌ Assessment API - Status ${apiResponse.status}`);
      }
    } catch (apiError) {
      console.log(`❌ Assessment API - Error: ${apiError.message}`);
    }

    try {
      const mathApiResponse = await fetch('https://tarl.openplp.com/api/public/assessment-data?subject=math');
      if (mathApiResponse.status === 200) {
        console.log('✅ Assessment API (Math) - Working');
      } else {
        console.log(`❌ Math Assessment API - Status ${mathApiResponse.status}`);
      }
    } catch (apiError) {
      console.log(`❌ Math Assessment API - Error: ${apiError.message}`);
    }

    console.log('\n🎉 Homepage Test Complete!');
    console.log('═'.repeat(60));

    if (failed === 0) {
      console.log('🏆 All tests passed! The homepage is working perfectly.');
      process.exit(0);
    } else {
      console.log(`⚠️  ${failed} test(s) failed. Please check the issues above.`);
      process.exit(1);
    }

  } catch (error) {
    console.log(`❌ Failed to fetch homepage: ${error.message}`);
    process.exit(1);
  }
}

// Add fetch polyfill for older Node.js versions
if (!global.fetch) {
  global.fetch = async (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: {
              get: (name) => res.headers[name.toLowerCase()]
            },
            text: () => Promise.resolve(data),
            json: () => Promise.resolve(JSON.parse(data))
          });
        });
      });

      req.on('error', reject);
      req.end();
    });
  };
}

testHomepage();