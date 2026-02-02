import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, createOrder, getUserOrders } from "./db";
import { protectedProcedure } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { sendOrderEmail } from "./_core/email";
import { checkRateLimit } from "./_core/rateLimit";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
  }),

  orders: router({
    create: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1, "Ime je obavezno"),
          lastName: z.string().min(1, "Prezime je obavezno"),
          address: z.string().min(1, "Adresa je obavezna"),
          phone: z.string().min(1, "Telefon je obavezan"),
          notes: z.string().optional(),
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number().min(1),
              price: z.string(),
              name: z.string(),
            })
          ),
          totalPrice: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Rate limiting - proveravamo IP adresu
        const clientIp = (ctx.req.headers['x-forwarded-for'] as string)?.split(',')[0] || ctx.req.socket?.remoteAddress || 'unknown';
        
        if (!checkRateLimit(clientIp)) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Previše narudžbina. Pokušajte ponovo za sat vremena.',
          });
        }
        try {
          const orderId = await createOrder(
            {
              userId: ctx.user?.id,
              firstName: input.firstName,
              lastName: input.lastName,
              address: input.address,
              phone: input.phone,
              notes: input.notes || null,
              totalPrice: input.totalPrice,
              status: "pending",
            },
            input.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              orderId: 0, // Will be set by createOrder
            }))
          );

          // Send email to customer
          await sendOrderEmail({
            to: "aleksandar.coha@gmail.com",
            firstName: input.firstName,
            lastName: input.lastName,
            address: input.address,
            phone: input.phone,
            notes: input.notes,
            items: input.items,
            totalPrice: input.totalPrice,
          });

          // Notify owner
          await notifyOwner({
            title: "Nova narudžbina - Mesna.to",
            content: `Nova narudžbina od ${input.firstName} ${input.lastName}. Telefon: ${input.phone}. Adresa: ${input.address}. Ukupno: ${input.totalPrice} RSD.`,
          });

          return {
            success: true,
            orderId,
          };
        } catch (error) {
          console.error("Failed to create order:", error);
          throw new Error("Greška pri kreiranju narudžbine");
        }
      }),
    getByUser: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Morate biti prijavljeni da biste videli narudžbine',
        });
      }
      return await getUserOrders(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
