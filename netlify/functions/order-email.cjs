const nodemailer = require('nodemailer')

const REQUIRED_FIELDS = ['name', 'phone', 'address']

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(event.headers.origin),
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ message: 'Method not allowed' }),
    }
  }

  const { customer, cart, totals } = parseBody(event.body)
  const missing = REQUIRED_FIELDS.filter((field) => !customer[field])
  if (missing.length) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ message: `Nedostaju polja: ${missing.join(', ')}` }),
    }
  }
  if (!Array.isArray(cart) || cart.length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ message: 'Korpa je prazna' }),
    }
  }

  try {
    await sendMail({ customer, cart, totals })
    return {
      statusCode: 200,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ message: 'Email poslat' }),
    }
  } catch (error) {
    console.error('Email slanje neuspešno', error)
    return {
      statusCode: 500,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ message: 'Slanje nije uspelo' }),
    }
  }
}

function corsHeaders(origin = '') {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function parseBody(body) {
  try {
    return JSON.parse(body || '{}')
  } catch (error) {
    console.error('Nevalidan JSON', error)
    return {}
  }
}

async function sendMail({ customer, cart, totals }) {
  const pass = process.env.GMAIL_PASS
  if (!pass) {
    throw new Error('GMAIL_PASS nije definisan')
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aleksandar.coha@gmail.com',
      pass,
    },
  })

  const subject = `Nova narudžbina · ${customer.name} (${customer.phone})`
  const items = cart
    .map((item) => `${item.name} — ${formatWeight(item.grams)} — ${item.price}`)
    .join('\n')
  const text = [
    `Ime: ${customer.name}`,
    `Telefon: ${customer.phone}`,
    `Adresa: ${customer.address}`,
    customer.note ? `Napomena: ${customer.note}` : null,
    '',
    'Stavke:',
    items,
    '',
    `Ukupna tezina: ${formatWeight(totals?.grams || 0)}`,
    `Ukupna cena: ${totals?.price ?? ''}`,
  ]
    .filter(Boolean)
    .join('\n')

  await transporter.sendMail({
    from: 'Mesna.to <aleksandar.coha@gmail.com>',
    to: 'aleksandar.coha@gmail.com',
    subject,
    text,
  })
}

function formatWeight(grams) {
  if (grams >= 1000) {
    const kg = grams / 1000
    return `${Number.isInteger(kg) ? kg : kg.toFixed(2)} kg`
  }
  return `${grams} g`
}
