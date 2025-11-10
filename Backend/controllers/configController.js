// @desc    Get app configuration
// @route   GET /api/v1/config
// @access  Public
exports.getConfig = async (req, res, next) => {
  try {
    const config = {
      platform_fee: parseFloat(process.env.PLATFORM_FEE) || 50,
      currency: 'INR',
      currency_symbol: '₹',
    };

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    next(error);
  }
};
