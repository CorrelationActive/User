
const https = require("https");

exports.handler = async function (event, context) {
  const { portfolioId } = event.queryStringParameters;

  if (!portfolioId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing portfolioId" }),
    };
  }

  const cleanId = portfolioId.replace(/[^0-9]/g, "");
  const url = `https://www.binance.com/bapi/futures/v1/friendly/future/copy-trade/lead-data/positions?portfolioId=${cleanId}`;

  const options = {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
    },
  };

  return new Promise((resolve) => {
    https.get(url, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
        });
      });
    }).on("error", (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      });
    });
  });
};
