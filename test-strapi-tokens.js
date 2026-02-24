require('dotenv').config({ path: '.env' });

async function testToken(name, token) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!apiUrl) {
    console.error("No API URL found");
    return;
  }
  
  console.log(`Testing ${name}...`);
  try {
    const response = await fetch(`${apiUrl}api/gallery-images?populate=img`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    if (!response.ok) {
        // Try to read body
        const text = await response.text();
        console.log(`Body: ${text}`);
    } else {
        console.log("Success!");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log("---");
}

async function main() {
    console.log("API URL:", process.env.NEXT_PUBLIC_STRAPI_API_URL);
    
    await testToken("NEXT_PUBLIC_STRAPI_API_TOKEN", process.env.NEXT_PUBLIC_STRAPI_API_TOKEN);
    await testToken("NEXT_PUBLIC_STRAPI_CLOUD_TOKEN", process.env.NEXT_PUBLIC_STRAPI_CLOUD_TOKEN);
    await testToken("NEXT_PUBLIC_STRAPI_CLOUD_TOKEN", process.env.NEXT_PUBLIC_STRAPI_CLOUD_TOKEN);
}

main();
