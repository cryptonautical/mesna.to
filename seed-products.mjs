import "dotenv/config";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL. Please add it to .env or set it in the environment before running this script.");
  process.exit(1);
}

const seedProducts = [
  {
    name: "Umljanski Kulen",
    description: "Tradicionalna srpska kobasica od svinjskog mesa u prirodnom crevu sa začinima. Savršena za grickanje ili uz hleb.",
    price: "1200",
    image: "https://scontent.fbeg2-1.fna.fbcdn.net/v/t39.30808-6/476208948_1171185798052840_6862128902649978107_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=4aEI5eGzJ3sQ7kNvwE4Bii1&_nc_oc=AdkZmY8BVZMMs9328caJqjS8R5P9k-erqcLA13GHcREAI5xS_9hScQhgMjriZK4PVE0&_nc_zt=23&_nc_ht=scontent.fbeg2-1.fna&_nc_gid=EBZgQUSnxl8u8atp1Sgmrw&oh=00_Afso_qcKOhBHXPLivBw5s62jWW9SQmlExZsPB7qv1Ucmcw&oe=69855EA8",
  },
  {
    name: "Suvi Vrat",
    description: "Nežno suvo meso od vrata sa bogatim ukusom. Idealno za predjelo ili kao meze uz rakiju.",
    price: "1300",
    image: "https://birajdomace.rs/wp-content/uploads/2021/06/birajmodomace-bdp-mesara-SUCI-VRAT.jpg",
  },
  {
    name: "Pečenica",
    description: "Klasična srpska pečenica od odabranog mesa. Bogat ukus i meka tekstura.",
    price: "950",
    image: "https://srpskamoravka.rs/wp-content/uploads/2024/05/pecenica2.jpg",
  },
  {
    name: "Dimljena Butkica",
    description: "Dimljeno meso od zadnje noge sa karakterističnim ukusom. Pravi gurmanluk za poznavaoca.",
    price: "1100",
    image: "https://cemarket.rs/wp-content/uploads/2025/11/Dimljena-svinjska-butkica-cca-15kg.jpg",
  },
  {
    name: "Suseni But",
    description: "Suvo meso od zadnje noge sa karakterističnim ukusom. Pravi delicija za poznavaoca.",
    price: "1100",
    image: "https://www.agromedia.rs/wp-content/uploads/2020/09/suvomeso_1-1.jpg",
  },
  {
    name: "Kolenica",
    description: "Fina kolenica sa bogatim okusom i nežnom teksturom. Savršena za posebne prilike.",
    price: "1050",
    image: "https://industrijamesagozba.com/wp-content/uploads/2024/07/Dimljena-butkica-i-kolenica.jpg",
  },
  {
    name: "Mast",
    description: "Tradicionalna mast od svinjskog sala sa začinima. Koristi se za kuvanje i kao predjelo.",
    price: "250",
    image: "https://xdn.eklinika.rs/2020/11/06/svinjska-mast-shutterstock_566564704.jpg",
  },
];

async function seed() {
  let connection;
  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(process.env.DATABASE_URL);

    console.log("Clearing existing products...");
    await connection.execute("DELETE FROM products");

    console.log("Inserting products...");
    for (const product of seedProducts) {
      await connection.execute(
        "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)",
        [product.name, product.description, product.price, product.image]
      );
    }

    console.log("✓ Products seeded successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seed();
