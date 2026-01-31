import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { nanoid } from "nanoid";

interface OrderItemInput {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

// POST /api/orders - Create order (with or without payment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId, items, notes, withPayment } = body as {
      tableId: string;
      items: OrderItemInput[];
      notes?: string;
      withPayment?: boolean;
    };

    // Validate input
    if (!tableId) {
      return NextResponse.json(
        { error: "Table non specifiee" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Aucun article dans la commande" },
        { status: 400 }
      );
    }

    // Validate quantities
    for (const item of items) {
      if (!item.menuItemId || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: "Quantite invalide" },
          { status: 400 }
        );
      }
    }

    // Get table with restaurant
    const table = await prisma.restaurantTable.findUnique({
      where: { id: tableId },
      include: {
        restaurant: true,
      },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table non trouvee" },
        { status: 404 }
      );
    }

    const { restaurant } = table;

    // Check if payment is required
    const requiresPayment = withPayment === true && restaurant.orderingMode === "PAYMENT_REQUIRED";

    // If payment is required, verify Stripe is set up
    if (requiresPayment) {
      if (!restaurant.stripeOnboarded || !restaurant.stripeAccountId) {
        return NextResponse.json(
          { error: "Le restaurant ne peut pas accepter les paiements" },
          { status: 400 }
        );
      }
    }

    // Get menu items and calculate total (server-side validation)
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        isAvailable: true,
        category: {
          restaurantId: table.restaurantId,
          isActive: true,
        },
      },
    });

    // Verify all items exist and are available
    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { error: "Un ou plusieurs articles ne sont plus disponibles" },
        { status: 400 }
      );
    }

    // Calculate total
    let totalInCents = 0;
    const orderItems: {
      menuItemId: string;
      quantity: number;
      unitPrice: number;
      notes?: string;
    }[] = [];

    for (const item of items) {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId);
      if (!menuItem) continue;

      const subtotal = menuItem.priceInCents * item.quantity;
      totalInCents += subtotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.priceInCents,
        notes: item.notes,
      });
    }

    // Minimum order amount for Stripe payments
    if (requiresPayment && totalInCents < 50) {
      return NextResponse.json(
        { error: "Le montant minimum de commande est de 0,50€" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${nanoid(6).toUpperCase()}`;

    // Determine initial status based on ordering mode
    // PAYMENT_REQUIRED: PENDING (waiting for payment)
    // CALL_WAITER / PAY_LATER: PREPARING (order is immediately sent to kitchen)
    const initialStatus = requiresPayment ? "PENDING" : "PREPARING";

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        tableId,
        restaurantId: table.restaurantId,
        totalInCents,
        notes: notes?.trim() || null,
        status: initialStatus,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Create Stripe PaymentIntent only if payment is required
    let clientSecret: string | undefined;

    if (requiresPayment && restaurant.stripeAccountId) {
      const stripe = getStripe();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalInCents,
        currency: restaurant.currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        transfer_data: {
          destination: restaurant.stripeAccountId,
        },
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          restaurantId: table.restaurantId,
          tableNumber: table.tableNumber,
        },
      });

      // Update order with PaymentIntent ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
        },
      });

      clientSecret = paymentIntent.client_secret ?? undefined;
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalInCents,
      clientSecret,
      items: order.items.map((item) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      })),
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la commande" },
      { status: 500 }
    );
  }
}
