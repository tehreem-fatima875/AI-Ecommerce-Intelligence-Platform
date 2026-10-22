const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

const getAnalytics = async (req, res) => {
  try {
    const [orders, customers, products] = await Promise.all([
      Order.find().select("totalAmount products orderDate").lean(),
      Customer.find().select("totalSpent segment").lean(),
      Product.find().select("name stock").lean(),
    ]);

    // -----------------------------
    // Basic store metrics
    // -----------------------------

    const totalRevenue = orders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    const totalOrders = orders.length;

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalCustomers = customers.length;
    const totalProducts = products.length;

    // -----------------------------
    // Product sales
    // -----------------------------

    const productSales = {};

    orders.forEach((order) => {
      order.products.forEach((item) => {
        const productId = item.product.toString();

        if (!productSales[productId]) {
          productSales[productId] = 0;
        }

        productSales[productId] += item.quantity;
      });
    });

    // -----------------------------
    // Best-selling product
    // -----------------------------

    const bestSellingProduct = products.reduce(
      (best, product) => {
        const sales = productSales[product._id.toString()] || 0;

        if (!best || sales > best.sales) {
          return {
            product: product.name,
            sales,
          };
        }

        return best;
      },
      null
    );

    // -----------------------------
    // Product performance
    // -----------------------------

    const productPerformance = products.map((product) => ({
      product: product.name,
      sales: productSales[product._id.toString()] || 0,
      stock: product.stock,
    }));

    // -----------------------------
    // Customer segments
    // -----------------------------

    const customerSegments = {
      New: customers.filter(
        (customer) => customer.segment === "New"
      ).length,

      Returning: customers.filter(
        (customer) => customer.segment === "Returning"
      ).length,

      Loyal: customers.filter(
        (customer) => customer.segment === "Loyal"
      ).length,
    };

    const customerData = [
      {
        segment: "New Customers",
        customers: customerSegments.New,
      },
      {
        segment: "Returning Customers",
        customers: customerSegments.Returning,
      },
      {
        segment: "Loyal Customers",
        customers: customerSegments.Loyal,
      },
    ];

    // -----------------------------
    // Customer behavior intelligence
    // -----------------------------

    const totalCustomerSpending = customers.reduce(
      (total, customer) => total + (customer.totalSpent || 0),
      0
    );

    const averageCustomerSpend =
      totalCustomers > 0
        ? totalCustomerSpending / totalCustomers
        : 0;

    const highValueCustomers = customers.filter(
      (customer) =>
        (customer.totalSpent || 0) >= averageCustomerSpend &&
        (customer.totalSpent || 0) > 0
    ).length;

    const customerBehavior = {
      totalCustomers,
      newCustomers: customerSegments.New,
      returningCustomers: customerSegments.Returning,
      loyalCustomers: customerSegments.Loyal,
      averageCustomerSpend,
      highValueCustomers,
    };

    // -----------------------------
    // Revenue by month
    // -----------------------------

    const revenueByMonth = {};

    orders.forEach((order) => {
      const date = new Date(order.orderDate);

      if (Number.isNaN(date.getTime())) return;
      const month = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

      if (!revenueByMonth[month]) {
        revenueByMonth[month] = 0;
      }

      revenueByMonth[month] += order.totalAmount;
    });

    const revenueData = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({
        month: new Date(`${month}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
        revenue,
      }));

    // -----------------------------
    // Low-stock intelligence
    // -----------------------------

    const lowStockProducts = products
      .filter((product) => product.stock <= 10)
      .map((product) => ({
        product: product.name,
        stock: product.stock,
      }));

    // -----------------------------
    // AI recommendation intelligence
    // -----------------------------

    const recommendations = [];

    // Inventory recommendations
    lowStockProducts.forEach((product) => {
      recommendations.push({
        type: "Inventory",
        priority: "High",
        title: `${product.product} is running low`,
        message: `${product.product} has only ${product.stock} units remaining. Consider restocking soon.`,
        action: "Restock inventory",
      });
    });

    // Best-selling product recommendation
    if (bestSellingProduct && bestSellingProduct.sales > 0) {
      recommendations.push({
        type: "Product",
        priority: "Medium",
        title: `${bestSellingProduct.product} is your top performer`,
        message: `${bestSellingProduct.product} has generated ${bestSellingProduct.sales} unit sales. Consider increasing its visibility or promotion.`,
        action: "Increase promotion",
      });
    }

    // Unsold product recommendations
    productPerformance
      .filter((product) => product.sales === 0)
      .forEach((product) => {
        recommendations.push({
          type: "Sales",
          priority: "Medium",
          title: `${product.product} has no recorded sales`,
          message: `Review the pricing, visibility, product description, or promotion strategy for ${product.product}.`,
          action: "Review product strategy",
        });
      });

    // Customer retention recommendation
    if (
      customerBehavior.loyalCustomers > 0 &&
      customerBehavior.totalCustomers > 0
    ) {
      recommendations.push({
        type: "Customer",
        priority: "Medium",
        title: "Focus on loyal customers",
        message: `${customerBehavior.loyalCustomers} loyal customer${
          customerBehavior.loyalCustomers === 1 ? "" : "s"
        } detected. Consider retention offers or personalized promotions.`,
        action: "Create retention offer",
      });
    }

    // -----------------------------
    // Send analytics response
    // -----------------------------

    res.status(200).json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCustomers,
      totalProducts,
      bestSellingProduct,
      productPerformance,
      customerSegments,
      customerData,
      customerBehavior,
      revenueData,
      lowStockProducts,
      recommendations,
    });
  } catch (error) {
    console.error("Failed to calculate analytics:", error);
    res.status(500).json({
      message: "Failed to calculate analytics",
    });
  }
};

module.exports = {
  getAnalytics,
};
