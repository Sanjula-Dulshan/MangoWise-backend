import SuitableQuantity from "../../models/FertilizerSuggestion/SuitableQuantityModel.js";
import request from "request-promise";

// Controller function to save data to the database
export const saveSuitableQuantity = async (req, res) => {
  try {
    const newSuitableQuantity = new SuitableQuantity(req.body);
    const savedSuitableQuantity = await newSuitableQuantity.save();
    res.status(201).json(savedSuitableQuantity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to retrieve records based on age and growthStage
export const findRecordByConditions = async (req, res) => {
  const { nvalue, pvalue, kvalue, record_id, age, growthStage } = req.body;
  const record = await SuitableQuantity.findOne({
    ageLowerLimit: { $lt: age },
    ageUpperLimit: { $gt: age },
    growthStage: growthStage,
  }).then(async function (record) {
    try {
      function getCurrentDate() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        return `${day}/${month}/${year}`;
      }

      const currentDate = getCurrentDate();

      function getCurrentTime() {
        const today = new Date();
        let hours = today.getHours();
        let minutes = today.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";

        hours %= 12;
        hours = hours || 12;

        hours = String(hours).padStart(2, "0");
        minutes = String(minutes).padStart(2, "0");

        return `${hours}:${minutes} ${ampm}`;
      }

      const currentTime = getCurrentTime();

      let data = {
        N: nvalue,
        P: pvalue,
        K: kvalue,
        NAF: record.N_lowerLimit,
        PAF: record.P_lowerLimit,
        KAF: record.K_lowerLimit,
      };

      let options = {
        method: "POST",
        uri: "https://us-central1-mangowise-395709.cloudfunctions.net/fertilizers",
        body: data,
        json: true,
      };

      await request(options)
        .then(async function (parsedBody) {
          let result;
          result = parsedBody["Predicted Fertilizer"];

          let data2 = {
            N: nvalue,
            P: pvalue,
            K: kvalue,
            NAF: record.N_lowerLimit,
            PAF: record.P_lowerLimit,
            KAF: record.K_lowerLimit,
            DN:
              record.N_lowerLimit - nvalue < 0
                ? 0
                : record.N_lowerLimit - nvalue,
            DP:
              record.P_lowerLimit - pvalue < 0
                ? 0
                : record.P_lowerLimit - pvalue,
            DK:
              record.K_lowerLimit - kvalue < 0
                ? 0
                : record.K_lowerLimit - kvalue,
            MOP: result == "MOP(0:0:60)" ? 1 : 0,
            TSP: result == "TTSP(0:46:0)" ? 1 : 0,
            UREA: result == "Urea(46:0:0)" ? 1 : 0,
            YM1: result == "YaraMila NK(1:0:1)" ? 1 : 0,
            YM2: result == "YaraMila NPKS(1:1:1)" ? 1 : 0,
          };

          let options2 = {
            method: "POST",
            uri: "https://us-central1-mangowise-395709.cloudfunctions.net/fQuantity",
            body: data2,
            json: true,
          };
          await request(options2)
            .then(async function (parsedBody) {
              let result2;
              result2 = parsedBody["Predicted Fertilizer Quantity"];

              let data3 = {
                N_level: nvalue,
                P_level: pvalue,
                K_level: kvalue,
                record_id: record_id,
                fertilizer: result,
                quantity: result2,
                age: age,
                savedDate: currentDate,
                savedTime: currentTime,
              };

              let options3 = {
                method: "POST",
                uri: "http://127.0.0.1:8070/records/add",
                body: data3,
                json: true,
              };

              const savedRecord = await request(options3);
              res.status(200).json({ record_id: savedRecord.record_id });
            })
            .catch(function (err) {
              console.log(err);
            });
        })
        .catch(function (err) {
          console.log(err);
        });

      if (!record) {
        res.status(404).json({ message: "Record not found" });
        return;
      }
      return;
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

export const monitorNutrition = async (req, res) => {
  const { nvalue, pvalue, kvalue, age, growthStage } = req.body;
  const record = await SuitableQuantity.findOne({
    ageLowerLimit: { $lt: age },
    ageUpperLimit: { $gt: age },
    growthStage: growthStage,
  }).then(async function (record) {
    try {
      let data = {
        N: nvalue,
        P: pvalue,
        K: kvalue,
        NAF: record.N_lowerLimit,
        PAF: record.P_lowerLimit,
        KAF: record.K_lowerLimit,
      };

      let options = {
        method: "POST",
        uri: "http://127.0.0.1:5000/fertilizer",
        body: data,
        json: true,
      };

      await request(options)
        .then(async function (parsedBody) {
          let result;
          result = parsedBody["Predicted Fertilizer"];

          let data2 = {
            N: nvalue,
            P: pvalue,
            K: kvalue,
            NAF: record.N_lowerLimit,
            PAF: record.P_lowerLimit,
            KAF: record.K_lowerLimit,
            DN:
              record.N_lowerLimit - nvalue < 0
                ? 0
                : record.N_lowerLimit - nvalue,
            DP:
              record.P_lowerLimit - pvalue < 0
                ? 0
                : record.P_lowerLimit - pvalue,
            DK:
              record.K_lowerLimit - kvalue < 0
                ? 0
                : record.K_lowerLimit - kvalue,
            MOP: result == "MOP(0:0:60)" ? 1 : 0,
            TSP: result == "TTSP(0:46:0)" ? 1 : 0,
            UREA: result == "Urea(46:0:0)" ? 1 : 0,
            YM1: result == "YaraMila NK(1:0:1)" ? 1 : 0,
            YM2: result == "YaraMila NPKS(1:1:1)" ? 1 : 0,
          };

          let options2 = {
            method: "POST",
            uri: "http://127.0.0.1:5000/quantity",
            body: data2,
            json: true,
          };
          await request(options2)
            .then(async function (parsedBody) {
              let result2;
              result2 = parsedBody["Predicted Fertilizer Quantity"];
              res.status(200).json({ result: result, result2: result2 });
            })
            .catch(function (err) {
              console.log(err);
            });
        })
        .catch(function (err) {
          console.log(err);
        });

      if (!record) {
        res.status(404).json({ message: "Record not found" });
        return;
      }
      return;
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
