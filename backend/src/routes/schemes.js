const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const FarmerProfile = require('../models/FarmerProfile');
const Scheme = require('../models/Scheme');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const farmerId = req.user.id;
    const profile = await FarmerProfile.findOne({ user: farmerId });
    const farmSize = profile ? profile.farmSize : 5;

    // Fetch from database
    let schemes = await Scheme.find({});
    
    // If database is empty, return cached mock fallbacks
    if (schemes.length === 0) {
      schemes = [
        {
          _id: 'pm-kisan',
          title: 'PM Kisan Samman Nidhi',
          description: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
          type: 'Income Support',
          benefit: '₹6,000 / year',
          eligibility: 'All landholding farmer families',
          category: 'Subsidy',
          status: 'Active',
          detailsLink: 'https://pmkisan.gov.in/'
        },
        {
          _id: 'pm-fby',
          title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
          description: 'Crop insurance protection against yield losses due to non-preventable natural risks, pests, and diseases.',
          type: 'Crop Insurance',
          benefit: 'Up to 98% coverage against sum insured',
          eligibility: 'All farmers growing notified crops in notified areas',
          category: 'Insurance',
          status: 'Active',
          detailsLink: 'https://pmfby.gov.in/'
        },
        {
          _id: 'smam',
          title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
          description: 'Subsidy of 40% to 50% for purchasing agricultural machinery like tractors, rotavators, and seeders.',
          type: 'Equipment Subsidy',
          benefit: '40% - 50% capital subsidy',
          eligibility: 'Small and marginal farmers, women farmers',
          category: 'Equipment',
          status: 'Active',
          detailsLink: 'https://agrimachinery.nic.in/'
        },
        {
          _id: 'kcc',
          title: 'Kisan Credit Card (KCC) Loan',
          description: 'Short-term credit loans up to ₹3 Lakhs for agricultural expenses at heavily subsidized interest rates (4%).',
          type: 'Loan Schemes',
          benefit: 'Low-interest credit (4% rate)',
          eligibility: 'All active farmers and cultivators',
          category: 'Finance',
          status: 'Active',
          detailsLink: 'https://www.rbi.org.in/'
        },
        {
          _id: 'shc',
          title: 'Soil Health Card Scheme',
          description: 'Free soil testing and recommendations on dosage of nutrients and fertilizers based on soil properties.',
          type: 'Soil Testing',
          benefit: 'Free soil analysis & card report',
          eligibility: 'All farmers nationwide',
          category: 'Advisory',
          status: 'Active',
          detailsLink: 'https://soilhealth.dac.gov.in/'
        }
      ];
    }

    // Process eligibility based on farmSize
    const processedSchemes = schemes.map(scheme => {
      const schemeObj = scheme.toObject ? scheme.toObject() : scheme;
      let isEligible = true;
      const id = schemeObj._id ? schemeObj._id.toString() : (schemeObj.id ? schemeObj.id.toString() : '');
      if (id === 'smam') {
        isEligible = farmSize <= 10;
      }
      return {
        ...schemeObj,
        id: id,
        isEligible
      };
    });

    res.status(200).json({
      success: true,
      source: 'National Gov Schemes Database',
      count: processedSchemes.length,
      data: processedSchemes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

module.exports = router;
