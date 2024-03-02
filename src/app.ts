import express, { Request, Response } from "express";
import { Order } from "./types";
import { salesData } from "./sales";

const app = express();

const data: Order[] = salesData;

app.get("/api/data", (req: Request, res: Response) => {
  res.json(data);
});

app.get("/api/state/:state", (req: Request, res: Response) => {
  const state = req.params.state;
  // Filter orders for the given state
  const ordersForState = data.filter((order) => order.State === state);

  // Calculate total sales, quantity sold, total discount%, and profit for the state
  let totalSales = 0;
  let totalQuantitySold = 0;
  let totalDiscount = 0;
  let totalProfit = 0;

  ordersForState.forEach((order) => {
    totalSales += order.Sales;
    totalQuantitySold += order.Quantity;
    totalDiscount += order.Discount;
    totalProfit += order.Profit;
  });

  const stateData = data.filter((order) => order["State"] === state);
  if (stateData.length === 0) {
    return res.status(404).json({ error: "State not found" });
  }
  const orderDates = stateData.map((order) => order["Order Date"]);
  const transformedDates = orderDates.map((date) => ({
    code: date,
    name: date,
  }));
  res.json({
    transformedDates,
    totalSales,
    totalQuantitySold,
    totalDiscount,
    totalProfit,
  });
});

app.get("/api/states", (req: Request, res: Response) => {
  const states: { code: string; name: string }[] = [];

  data.forEach((order) => {
    const stateName = order["State"];
    if (!states.some((state) => state.code === stateName)) {
      states.push({ code: stateName, name: stateName });
    }
  });
  res.json(states);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
