# Hops & Wine Export Friction Dashboard (Finland / EU)
🔗 **Live Demo:** [https://yourapp.vercel.app](https://yourapp.vercel.app)

Portfolio-ready BI & risk modeling case study demonstrating how a single analyst can quantify friction and ship a lightweight decision-support tool. This project emphasizes business judgment and analytical ownership over framework complexity.

---

## **Project Overview**
- Single-user SaaS-style MVP scoring export friction for Washington State hops and wine exporters considering Finland / EU.
- Combines operational and relational risk into a **Friction Index** with guidance, confidence score, and visualization.
- Demonstrates clear assumptions, explicit weights, and pragmatic shipping of a serverless + static frontend.

---

## **Business Problem**
Exporters face diverse, hard-to-compare risks: logistics reliability, perishability, tariffs, and cultural/communication factors. Without a structured view, decision-making often relies on anecdotes.  
This dashboard provides a repeatable risk framework and scenario testing to help leaders prioritize mitigation efforts and make informed entry decisions.

---

## **How the Friction Index Works**
The model calculates a weighted average of **Operational** and **Relational Friction**:

Formula for Market Entry Risk Index (If):
If = ((Operational_Friction * Weight_O) + (Relational_Friction * Weight_R)) / (Weight_O + Weight_R)

Where:
- Operational_Friction = (Base_Ops * Stress_Multiplier)
- Relational_Friction = (Base_Relational + (Base_Relational * Tariff_Shock))

- **Operational Friction:** Logistics, Perishability, Export Cost, adjusted by a Scenario Multiplier.
- **Relational Friction:** Tariffs (including shocks), Communication norms, Cultural distance.
- **Weights:** Analyst-defined to reflect business priorities (e.g., higher sensitivity to logistics).

---

## **Risk Thresholds**

| Index Score | Status | Business Implication |
|------------|--------|--------------------|
| 0 – 10    | 🟢 Green | Low friction; leverage regional prestige for market entry. |
| 11 – 18   | 🟡 Yellow | Moderate friction; prioritize mitigation in the dominant risk category. |
| 19+       | 🔴 Red | High friction; reconsider strategy or seek significant local partnerships. |

---

## **Core Features**
- **Scenario Analysis:** Stress-test operational load (capacity limits, perishability) and simulate trade policy shocks (tariff hikes/reductions).  
- **Confidence Scoring:** Dynamic metric decays as relational friction dominates, reflecting real-world trust dynamics.  
- **Visualization:** Chart.js bar chart shows Execution vs Market Risk for immediate prioritization.  
- **Actionable Reporting:** On-screen strategic guidance and a built-in **Print / PDF export** for stakeholder reporting.

---

## **Tech Stack**
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)  
- **Visuals:** Chart.js for interactive BI visualizations  
- **Backend:** Serverless function on Vercel (`/api/calculate`)  
- **Data:** JSON seeds for products and countries  
- **Deployment:** Vercel; zero build step required  

---

## **Professional Competencies Demonstrated**
- **Risk Modeling:** Scenario multipliers, tariff sensitivity, weighted index calculations.
- **Decision Support:** Translates raw data into actionable guidance.
- **Pragmatic Delivery:** Lightweight, portable, deployable MVP.
- **Communication:** Inline comments and UI copy explain why each lever exists.

---

## **Future Enhancements**
- **Multi-Market Comparison:** Side-by-side portfolio evaluation for other EU markets (Sweden, Norway, etc.).
- **Live Data Integration:** Connect to real-time API feeds for live logistics benchmarks and EU tariff schedules.
- **Persistence & Collaboration:** Add a database layer to save scenarios and generate unique URLs for sharing.
- **Advanced Sensitivity Analysis:** Introduce "Tornado Charts" to visualize which specific input has the highest impact on the Friction Index.

---

*Note: Risk scores incorporate **country-specific baseline friction** (tariffs, communication norms, regulatory hurdles) as an environmental constant.*
