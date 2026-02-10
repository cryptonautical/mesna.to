import { startServer } from "./_core/index";

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
