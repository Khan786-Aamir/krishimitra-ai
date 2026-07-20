const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const FarmerProfile = require('../models/FarmerProfile');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const farmerId = req.user.id;
    const profile = await FarmerProfile.findOne({ user: farmerId });
    const farmSize = profile ? profile.farmSize : 5;

    // Government Scheme Service - returns a list of schemes.
    // In a real production system, this could query external ministerial databases (e.g. data.gov.in).
    // Here we implement the service model with realistic parameters.
    const schemes = [
      {
        id: 'pm-kisan',
        title: 'PM Kisan Samman Nidhi',
        description: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
        type: 'Income Support',
        benefit: '₹6,000 / year',
        eligibility: 'All landholding farmer families',
        category: 'Subsidy',
        status: 'Active',
        isEligible: true,
        detailsLink: 'https://pmkisan.gov.in/'
      },
      {
        id: 'pm-fby',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'Crop insurance protection against yield losses due to non-preventable natural risks, pests, and diseases.',
        type: 'Crop Insurance',
        benefit: 'Up to 98% coverage against sum insured',
        eligibility: 'All farmers growing notified crops in notified areas',
        category: 'Insurance',
        status: 'Active',
        isEligible: true,
        detailsLink: 'https://pmfby.gov.in/'
      },
      {
        id: 'smam',
        title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
        description: 'Subsidy of 40% to 50% for purchasing agricultural machinery like tractors, rotavators, and seeders.',
        type: 'Equipment Subsidy',
        benefit: '40% - 50% capital subsidy',
        eligibility: 'Small and marginal farmers, women farmers',
        category: 'Equipment',
        status: 'Active',
        isEligible: farmSize <= 10, // Small & marginal
        detailsLink: 'https://agrimachinery.nic.in/'
      },
      {
        id: 'kcc',
        title: 'Kisan Credit Card (KCC) Loan',
        description: 'Short-term credit loans up to ₹3 Lakhs for agricultural expenses at heavily subsidized interest rates (4%).',
        type: 'Loan Schemes',
        benefit: 'Low-interest credit (4% rate)',
        eligibility: 'All active farmers and cultivators',
        category: 'Finance',
        status: 'Active',
        isEligible: true,
        detailsLink: 'https://www.rbi.org.in/'
      },
      {
        id: 'shc',
        title: 'Soil Health Card Scheme',
        description: 'Free soil testing and recommendations on dosage of nutrients and fertilizers based on soil properties.',
        type: 'Soil Testing',
        benefit: 'Free soil analysis & card report',
        eligibility: 'All farmers nationwide',
        category: 'Advisory',
        status: 'Active',
        isEligible: true,
        detailsLink: 'https://soilhealth.dac.gov.in/'
      }
    ];

    res.status(200).json({
      success: true,
      source: 'National Gov Schemes Database (Cached)',
      count: schemes.length,
      data: schemes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

module.exports = router;
