import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("orders.create", () => {
  it("should create an order with valid data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.create({
      firstName: "Marko",
      lastName: "Marković",
      address: "Kneza Miloša 123, Beograd",
      phone: "+381612345678",
      notes: "Molim da bude dostavljeno do 18:00",
      items: [
        {
          productId: 1,
          quantity: 2,
          price: "850",
          name: "Sremska Kobasica",
        },
        {
          productId: 2,
          quantity: 1,
          price: "1200",
          name: "Suvi Vrat",
        },
      ],
      totalPrice: "2900",
    });

    expect(result.success).toBe(true);
    expect(result.orderId).toBeDefined();
    expect(typeof result.orderId).toBe("number");
  });

  it("should fail with missing firstName", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.orders.create({
        firstName: "",
        lastName: "Marković",
        address: "Kneza Miloša 123, Beograd",
        phone: "+381612345678",
        items: [],
        totalPrice: "0",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should fail with missing address", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.orders.create({
        firstName: "Marko",
        lastName: "Marković",
        address: "",
        phone: "+381612345678",
        items: [],
        totalPrice: "0",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should fail with missing phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.orders.create({
        firstName: "Marko",
        lastName: "Marković",
        address: "Kneza Miloša 123, Beograd",
        phone: "",
        items: [],
        totalPrice: "0",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should accept optional notes", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.create({
      firstName: "Marko",
      lastName: "Marković",
      address: "Kneza Miloša 123, Beograd",
      phone: "+381612345678",
      notes: "Opciona napomena",
      items: [
        {
          productId: 1,
          quantity: 1,
          price: "850",
          name: "Sremska Kobasica",
        },
      ],
      totalPrice: "850",
    });

    expect(result.success).toBe(true);
  });
});

describe("products.list", () => {
  it("should return list of products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Check first product structure
    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty("id");
    expect(firstProduct).toHaveProperty("name");
    expect(firstProduct).toHaveProperty("description");
    expect(firstProduct).toHaveProperty("price");
    expect(firstProduct).toHaveProperty("image");
  });
});
