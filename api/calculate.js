import products from "../data/products.json";
import countries from "../data/countries.json";

export default function handler(req, res) {
  const {
    productId,
    countryId,
    weightOperational = 1,
    weightRelational = 1,
    scenarioMultiplier = 1,
    tariffAdjustment = 0
  } = req.query;

  // 1. METADATA MODE (for dropdowns)
  if (!productId || !countryId) {
    return res.status(200).json({
      products,
      countries
    });
  }

  // 2. CALCULATION MODE
  const product = products.find(p => p.id === productId);
  const country = countries.find(c => c.id === countryId);

  if (!product || !country) {
    return res.status(400).json({ error: "Invalid product or country" });
  }

  // --- THE FIX: Force numeric conversion to prevent NaN errors ---
  const wOp = Number(weightOperational);
  const wRel = Number(weightRelational);
  const wScen = Number(scenarioMultiplier);
  const wTariff = Number(tariffAdjustment);

  // Calculation for Execution Risk (Logistics + Costs)
  const operationalFriction =
    ((product.logistics_complexity +
      product.perishability_index +
      product.export_cost_index) / 3) *
    wOp *
    wScen;

  // Calculation for Market & Partner Risk (Tariffs + Culture)
  const relationalFriction =
    ((country.tariff_index +
      country.communication_style_index +
      country.business_culture_index) / 3) *
    wRel *
    (1 + wTariff);

  const frictionIndex = (operationalFriction + relationalFriction) / 2;

  // Confidence Score Logic
  const confidence = Math.max(
    0,
    Math.round(country.confidence - frictionIndex * 5)
  );

  let color = "Green";
  if (frictionIndex >= 7.5) color = "Red";
  else if (frictionIndex >= 4.5) color = "Yellow";

  // 3. STRATEGIC DECISION GUIDANCE LOGIC
  let tip = product.base_tip;

  if (wScen >= 1.7) {
    tip = `CRITICAL STRESS: Port congestion or global instability detected. For ${product.name}, prioritize Seattle-Tacoma terminal pre-clearing to avoid detention fees.`;
  } else if (color === "Red") {
    tip = `HIGH RISK: ${product.base_tip} Additionally, the combined Market & Execution risk is too high for standard entry. Consider a joint-venture partner in ${country.name} to share the friction.`;
  } else if (color === "Yellow") {
    tip = `MITIGATION REQUIRED: ${product.base_tip}`;
  } else {
    tip = `STRATEGIC GO: Risk levels are optimal. Leverage Yakima Valley's regional prestige to negotiate favorable placement in ${country.name} markets.`;
  }

  return res.status(200).json({
    operationalFriction,
    relationalFriction,
    frictionIndex,
    confidence,
    color,
    tip
  });
}