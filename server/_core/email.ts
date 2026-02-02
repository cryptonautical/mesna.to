import nodemailer from "nodemailer";
interface OrderEmailData {
  to: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
    price: string;
    name: string;
  }>;
  totalPrice: string;
}

export async function sendOrderEmail(data: OrderEmailData) {
  try {
    const itemsHtml = data.items
      .map(
        item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price} RSD</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B0000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .order-details { margin: 20px 0; }
            .order-details p { margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #8B0000; color: white; padding: 10px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; text-align: right; padding: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Mesna.to - Potvrda Narudzbine</h1>
            </div>
            <div class="content">
              <div class="order-details">
                <h2>Podaci o kupcu</h2>
                <p><strong>Ime:</strong> ${data.firstName}</p>
                <p><strong>Prezime:</strong> ${data.lastName}</p>
                <p><strong>Adresa:</strong> ${data.address}</p>
                <p><strong>Telefon:</strong> ${data.phone}</p>
                ${data.notes ? `<p><strong>Napomena:</strong> ${data.notes}</p>` : ""}
              </div>

              <h2>Naruceni proizvodi</h2>
              <table>
                <thead>
                  <tr>
                    <th>Proizvod</th>
                    <th style="text-align: center;">Kolicina</th>
                    <th style="text-align: right;">Cena</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total">
                Ukupna cena: ${data.totalPrice} RSD
              </div>

              <p style="margin-top: 20px; color: #666;">
                <strong>Napomena:</strong> Placanje se vrsi pouzećem (gotovinom pri dostavi).
              </p>
            </div>
            <div class="footer">
              <p>Hvala što ste odabrali Mesna.to!</p>
              <p>&copy; 2026 Mesna.to - Prodavnica Suvog Mesa</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Log the email content for development
    console.log(`Order email prepared for ${data.to}`);
    console.log("Email content prepared successfully");
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service name, e.g., 'Gmail', 'Outlook', or a custom SMTP host
      auth: {
      user: "aleksandar.coha@gmail.com", // Your email address
      pass: process.env.GMAIL_PASS // Your email account password or app-specific password
   }
  });
    const mailOptions = {
  from: '"Mesna.to" <aleksandar.coha@gmail.com>', // Sender address (your email)
  to: "aleksandar.coha@gmail.com", // Recipient address (your email)
  subject: "Nova narudžbina - Mesna.to", // Subject line
  // text: "Hello world? This is a test email sent to myself using Node.js.", // plain text body
  html: htmlContent // HTML body
};
    await transporter.sendMail(mailOptions);
    console.log("Order email sent successfully");


    
    // In production, this would be sent via email service
    // For now, we just log it
  } catch (error) {
    console.error("Failed to prepare order email:", error);
    throw error;
  }
}
