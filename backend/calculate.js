import products from '../data/products.json';
import countries from '../data/countries.json';

// Helper: map numeric score to risk color for quick executive read-outs.
function colorFromScore(score) {
  if (score <= 10) return 'Green';
  if (score <= 18) return 'Yellow';
  return 'Red';
}

// Helper: clamp between 0 and 100 to keep confidence interpretable.
function clamp100(value) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export default function handler(req, res) {
  const {
    productId,
    countryId,
    weightOperational = 1,
    weightRelational = 1,
    scenarioMultiplier = 1,
    tariffAdjustment = 0,
  } = req.query;

  const product = products.find((p) => p.id === productId);
  const country = countries.find((c) => c.id === countryId);

  if (!product || !country) {
    return res.status(400).json({ error: 'Invalid product or country' });
  }

  // Parse numeric inputs with defensive defaults for resiliency.
  const wOperational = parseFloat(weightOperational) || 1;
  const wRelational = parseFloat(weightRelational) || 1;
  const scenario = parseFloat(scenarioMultiplier) || 1;
  const tariffAdj = parseFloat(tariffAdjustment) || 0;

  // Operational friction reflects execution risk; we stress it with scenario multiplier
  // to mimic capacity crunches or regulatory friction spikes.
  const operationalFriction =
    (product.logistics_complexity +
      product.perishability_index +
      product.export_cost_index) *
    scenario;

  // Relational friction captures customs, communication, and culture alignment.
  const relationalFriction =
    country.tariff_index * (1 + tariffAdj) +
    country.communication_style_index +
    country.business_culture_index;

  const frictionIndex =
    (operationalFriction * wOperational + relationalFriction * wRelational) /
    (wOperational + wRelational);

  const color = colorFromScore(frictionIndex);
  const tip = buildTip({ product, country, operationalFriction, relationalFriction, color });
  const confidence = calculateConfidence({
    base: country.confidence,
    frictionIndex,
    operationalFriction,
    relationalFriction,
    scenario,
    tariffAdj,
  });

  res.status(200).json({
    frictionIndex: Number(frictionIndex.toFixed(2)),
    operationalFriction: Number(operationalFriction.toFixed(2)),
    relationalFriction: Number(relationalFriction.toFixed(2)),
    color,
    tip,
    confidence,
  });
}

function buildTip({ product, country, operationalFriction, relationalFriction, color }) {
  const dominates =
    operationalFriction > relationalFriction ? 'operational' : 'relational';
  const base = `${product.base_tip} ${country.base_tip}`;

  let emphasis = '';
  if (dominates === 'operational') {
    emphasis =
      'Prioritize cold-chain reliability, EU freight booking visibility, and buffer inventory near Nordic hubs.';
  } else {
    emphasis =
      'Invest early in Finnish/EU customs brokerage, align on documentation standards, and plan relationship-building touchpoints.';
  }

  let colorNote = '';
  if (color === 'Green') {
    colorNote = 'Risk is contained—move quickly but lock in compliance basics.';
  } else if (color === 'Yellow') {
    colorNote = 'Manageable with mitigation sequencing and clear SLAs.';
  } else {
    colorNote = 'High friction—enter only with staged pilots and contingency capital.';
  }

  return `${base} ${emphasis} ${colorNote}`;
}

function calculateConfidence({
  base,
  frictionIndex,
  operationalFriction,
  relationalFriction,
  scenario,
  tariffAdj,
}) {
  let confidence = base;

  // Friction dampens conviction; relational issues erode trust more than ops delays.
  const relationalShare = relationalFriction / (operationalFriction + relationalFriction);
  confidence -= frictionIndex * (0.6 + 0.6 * relationalShare);

  // Scenario multipliers indicate stress tests; heavier multipliers reduce confidence.
  if (scenario > 1) {
    confidence -= (scenario - 1) * 12;
  }

  // Tariff sensitivity compounds relational friction because it affects pricing trust.
  if (tariffAdj > 0) {
    confidence -= tariffAdj * 40 * relationalShare;
  }

  // Mild uplift if scenario is conservative (below 1) to reward slack capacity planning.
  if (scenario < 1) {
    confidence += (1 - scenario) * 6;
  }

  return clamp100(confidence);
}

