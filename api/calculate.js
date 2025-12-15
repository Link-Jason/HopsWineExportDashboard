// Import the data sources
const products = require('../data/products.json');
const countries = require('../data/countries.json');

// Define confidence mapping
const confidenceMap = [
    { threshold: 80, color: 'Green', tip: 'Go: Low friction, strong confidence in export feasibility.' },
    { threshold: 60, color: 'Yellow', tip: 'Proceed: Moderate friction, implement mitigation strategies.' },
    { threshold: 40, color: 'Red', tip: 'Caution: High friction, re-evaluate or seek specialized assistance.' },
    { threshold: 0, color: 'Red', tip: 'Reconsider: Extreme friction, significant barriers likely exist.' },
];

module.exports = async (req, res) => {
    // Extract parameters from the request query
    const { 
        productId, 
        countryId, 
        weightOperational, 
        weightRelational, 
        scenarioMultiplier, 
        tariffAdjustment 
    } = req.query;

    // ***************************************************************
    // NEW LOGIC: Check if the frontend is just asking for metadata (The Fix!)
    // If productId or countryId is missing, return the lists of available products/countries.
    // ***************************************************************
    if (!productId || !countryId) {
        return res.json({
            // Only return the required fields (id and name) for the dropdowns
            products: products.map(p => ({ id: p.id, name: p.name })),
            countries: countries.map(c => ({ id: c.id, name: c.name })),
        });
    }

    // --- Start of Existing Calculation Logic ---

    // 1. Convert inputs to numbers
    const wOp = parseFloat(weightOperational || 1);
    const wRel = parseFloat(weightRelational || 1);
    const sMult = parseFloat(scenarioMultiplier || 1);
    const tAdj = parseFloat(tariffAdjustment || 0);

    // 2. Find the selected data points
    const product = products.find(p => p.id === productId);
    const country = countries.find(c => c.id === countryId);

    if (!product || !country) {
        return res.status(404).json({ error: 'Product or country not found.' });
    }

    // 3. Extract base friction scores
    const baseOperationalFriction = product.base_operational_friction;
    const baseRelationalFriction = country.base_relational_friction;
    const countryTariff = country.tariff;

    // 4. Calculate Friction components
    // Operational Friction: Core friction adjusted by scenario and tariff shock.
    let operationalFriction = (baseOperationalFriction * sMult) + (countryTariff * tAdj);
    operationalFriction = Math.max(0, operationalFriction); // Cannot be negative

    // Relational Friction: Friction specific to the country's difficulty.
    const relationalFriction = baseRelationalFriction;

    // 5. Calculate Weighted Friction Index
    // This combines the operational (cost/logistics) and relational (market) friction, weighted by user focus.
    const weightedSum = (operationalFriction * wOp) + (relationalFriction * wRel);
    const totalWeight = wOp + wRel;
    const frictionIndex = weightedSum / totalWeight;

    // 6. Calculate Confidence Score (Inverted Friction)
    // A score of 100 is no friction; 0 is maximum (10). Scales friction from 0-10.
    const maxFrictionScore = 10;
    const normalizedFriction = Math.min(maxFrictionScore, frictionIndex);
    let confidence = 100 - (normalizedFriction / maxFrictionScore * 100);
    confidence = Math.max(0, Math.round(confidence));

    // 7. Determine Tip and Color
    const { color, tip } = confidenceMap.find(item => confidence >= item.threshold) || confidenceMap.slice(-1)[0];

    // 8. Return final JSON result
    res.json({
        frictionIndex: frictionIndex,
        operationalFriction: operationalFriction,
        relationalFriction: relationalFriction,
        confidence: confidence,
        color: color,
        tip: tip,
    });
};