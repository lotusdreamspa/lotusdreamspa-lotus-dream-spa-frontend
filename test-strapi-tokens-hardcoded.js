
const https = require('https');

async function testToken(name, token, apiUrl) {
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
    // Hardcoding for test because reading .env is failing in this env
    const apiUrl = "https://strapi-railway-app-production-d15e.up.railway.app/";
    const token1 = "c4a2a1c5d723cf0cbcc744f042286e49c16507633a5ebac1f788d1de5b377daa89f6f5cf87d4c08a965aea86c84ea071e69f60e1b6a8b1ee1de7caea764968b2639656102ad0c559e4522e6091c525a27d487f89eb5984330e8260782c6f9d293e889f9beb9d0a168c5d212db41e9f1f58a105448067881e5e132e7d02c12948";
    const token2 = "7ff4a1976c37d7cbc647203bcd07b364e3af282ebe5592b05893e780608a6ba4e31c7e946dd39892639aeec1cdef59e6d043dd2f85af2edecde267236a71de341a5378a6a6615a29af11033c5fd40f0dbe2b088f1108cc46c218e8d9fbdd88158b71de3b7727c471a549aceb0ce13045064d46931272d7c10285a406a3ef5c62";
    const token3 = "3ae034d043a0a3365ed3c29d14e345104ed6e1b3b05170ff5c5237c1bd4e1c1486271f53e920176d9ca924d93496bb444ddab364fe0158b8f674075998d9db6652f11b71f6deff0379741f0ee7aa39838b6a579ee45d5b5d74995c9a5683fb9c413847b9bbc960e81fdf818d7b3fd3db2e5b9f2ae24e0c2395a93cdb02e27534";
    
    console.log("API URL:", apiUrl);
    
    await testToken("NEXT_PUBLIC_STRAPI_API_TOKEN", token1, apiUrl);
    await testToken("NEXT_PUBLIC_STRAPI_CLOUD_TOKEN", token2, apiUrl);
    await testToken("NEXT_PUBLIC_STRAPI_CLOUD_TOKEN", token3, apiUrl);
}

main();
