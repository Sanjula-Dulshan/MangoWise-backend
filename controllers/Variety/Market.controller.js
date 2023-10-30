import MarketAnalysis from "../../models/Variety/SaveAnalysis.model.js";

export const market = async (req, res) => {
  try {
    const newMarket = new MarketAnalysis(req.body);
    const savedMarket = await newMarket.save();
    res.status(201).json(savedMarket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMarket = async (req, res) => {
  try {
    const market = await MarketAnalysis.find({}, { __v: 0 }).sort({
      createdAt: -1,
    });
    res.status(200).json(market);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
