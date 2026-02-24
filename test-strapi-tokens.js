require('dotenv').config({ path: 'c:/Users/rober/Desktop/LOTUS DREAM PRD/NEXTJS/.env' });

async function testToken(name, token) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!apiUrl) {
    console.error("No API URL found");
    return;
  }

  console.log(`Testing ${name}...`);
  try {
    const response = await fetch(`${apiUrl}/api/gallery-images?populate=img`, {
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
  console.log("API URL:", process.env.NEXT_PUBLIC_STRAPI_URL);

  await testToken("NEXT_PUBLIC_STRAPI_TOKEN", process.env.NEXT_PUBLIC_STRAPI_TOKEN);
}

main();
