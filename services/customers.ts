// services/customers.ts
import 'server-only';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
const STRAPI_WRITE_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN; 

// Usa un token con permessi FULL ACCESS o CREATE

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  isKhmer: boolean
}

// Helper per trovare un cliente per email
async function findCustomerByEmail(email: string) {
  console.log(email)
  console.log(STRAPI_WRITE_TOKEN, 'token per il customer')

  const res = await fetch(`${STRAPI_URL}/api/customers?filters[email][$eq]=${email}`, {
    headers: { Authorization: `Bearer ${STRAPI_WRITE_TOKEN}` },
    cache: 'no-store',
  });
  console.log(res)
  const json = await res.json();
  return json.data && json.data.length > 0 ? json.data[0] : null;
}

// Helper per creare un nuovo cliente
async function createCustomer(data: CustomerData) {
  const res = await fetch(`${STRAPI_URL}/api/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_WRITE_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });
  
  if (!res.ok) throw new Error("Failed to create customer in Strapi");
  
  const json = await res.json();
  return json.data;
}

// Funzione Principale: "Trova o Crea"
export async function findOrCreateCustomer(customerData: CustomerData) {
  try {
    // 1. Cerca se esiste
    const existing = await findCustomerByEmail(customerData.email);
    if (existing) {
      console.log(`Customer found: ${existing.id}`);
      return existing;
    }

    // 2. Se non esiste, crea
    console.log(`Creating new customer: ${customerData.email}`);
    return await createCustomer(customerData);
  } catch (error) {
    console.error("Error in findOrCreateCustomer:", error);
    throw error;
  }
}