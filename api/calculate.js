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

  // -------------------------------
  // 1. METADATA MODE (for dropdowns)
  // -------------------------------
  if (!productId || !countryId) {
    return res.status(200).json({
      products,
      countries
    });
  }

  // -------------------------------
  // 2. CALCULATION MODE
  // -------------------------------
  const product = products.find(p => p.id === productId);
  const country = countries.find(c => c.id === countryId);

  if (!product || !country) {
    return res.status(400).json({ error: "Invalid product or country" });
  }

  // Operational friction reflects logistics + cost complexity
  const operationalFriction =
    (product.logistics_complexity +
      product.perishability_index +
      product.export_cost_index) /
    3 *
    weightOperational *
    scenarioMultiplier;

  // Relational friction reflects tariff + cultural alignment
  const relationalFriction =
    (country.tariff_index +
      country.communication_style_index +
      country.business_culture_index) /
    3 *
    weightRelational *
    (1 + Number(tariffAdjustment));

  const frictionIndex =
    (operationalFriction + relationalFriction) / 2;

  // Confidence tightens as friction rises
  const confidence = Math.max(
    0,
    Math.round(
      country.confidence -
        frictionIndex * 5
    )
  );

  let color = "Green";
  if (frictionIndex >= 7) color = "Red";
  else if (frictionIndex >= 4) color = "Yellow";

  const tip =
    frictionIndex < 4
      ? "Proceed with standard export planning."
      : frictionIndex < 7
      ? product.base_tip
      : `${product.base_tip} ${country.base_tip}`;

  return res.status(200).json({
    operationalFriction,
    relationalFriction,
    frictionIndex,
    confidence,
    color,
    tip
  });
}
