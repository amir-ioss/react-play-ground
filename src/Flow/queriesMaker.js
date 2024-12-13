var _obj = [
  {
    id: "1",
    label: "IndicatorNode 1",
    value: ["talib.talib.EMA(close,15)(close,5)"],
    preNode: [],
  },
  {
    id: "3",
    label: "CoinNode 3",
    value: ["time", "open", "high", "low", "close", "volume"],
    type: "coin_data",
    preNode: [],
  },
  {
    id: "2",
    label: "ConditionNode 2",
    value: ">",
    type: "check",
    preNode: [
      {
        id: "1",
        label: "IndicatorNode 1",
        value: ["talib.talib.EMA(close,15)(close,5)"],
      },
      {
        id: "3",
        label: "CoinNode 3",
        value: ["time", "open", "high", "low", "close", "volume"],
      },
    ],
  },
];

const macd = ["macd_line", "signal_line", "macd_histogram"];
const isNum = (_) => !isNaN(Number(_));
const isSource = (_) => ["time", "open", "high", "low", "close", "volume", ...macd].includes(_);

const queriesMaker = (obj) => {
  var ohlcvIndex = 0
  // Validate the input object
  // if (typeof obj !== 'object' || obj === null) {
  //   throw new Error('Invalid input: Expected an object.');
  // }

  const inputs = {}; // Use inputs for any required processing
  // console.log(obj); // Log the input object for debugging

  // Example logic for processing the input object
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      var $ = obj[key];
      let query = $.value[0];

      const find_id = (ID) => obj.findIndex((_) => _.id == ID);
      const input = (INDEX) => find_id($.preNode[INDEX]?.["id"]);

      // Function to find the index of val1 and val2 in the nodes array
      function findIds(prevNode, values) {
        const inputs = [];
        // Iterate over the nodes array
        prevNode.forEach((node, index) => {
          values.forEach((val, idx) => {
            // values []
            if (node.value.includes(val)) {
              inputs[idx] = find_id(node.id);
            }

            // returns []
            if (node?.returns && node.returns.includes(val)) {
              inputs[idx] = find_id(node.id);
            }
          });
        });
        return inputs;
      }

      /////////////  COIN  /////////////
      if ($.type == "coin_data") {
        const [t, o, h, l, c, v, period, timeFrame] = $.value;

        let symbol = "BTC/USDT";
        let timeframe = timeFrame ?? "1m";
        let limit = period ?? 50;
        query = `fetch_ohlcv('${symbol}', '${timeframe}', ${value(limit, input(0), false)})`;

        ohlcvIndex = key
      }

      /////////////  MATH  /////////////
      /////////////  CHECK  /////////////
      if ($.type == "check" || $.type == "math") {
        // 10 >,+ 20
        const [val1, val2, condition] = $.value;

        const inputs = findIds($.preNode, [val1, val2]); // [0,1]
        query = buildCheckQuery(val1, val2, condition, inputs);
      }

      /////////////  CHECK  /////////////
      if ($.type == "logic") {
        // 10, AND, 20
        // np.logical_and(array1, array2)
        const [val1, val2, condition] = $.value;
        // query = `${condition}(${value(val1, input(0), false)}, ${value(val2, input(1), false)})`;
        query = `${condition}(output['${input(0)}'], output['${input(1)}'])`;
      }

      /////////////  INDICATOR  /////////////
      if ($.type == "indicator") {
        const [indicator, source, ...params] = $.value;
        query = `talib.${indicator}(${value(source, input(0), false)},${params.join(",")})`;

        // RETURNS TO NAMED KEYS
        if ($.returns && $.returns.length > 0) {
          query += ` -> ${toSingleQuotes($.returns)}`;
        }
      }

      /////////////  HH/LL  /////////////
      if ($.type == "hhll") {
        const [fun, source, period] = $.value;
        query = `talib.${fun}(${value(source, input(0), false)}, ${period})`;
      }


      /////////////  TRADE  /////////////
      if ($.type == "trade") {
        const [signals, source, balance, size, fee] = $.value;
        console.log(signals, value(signals, input(0), false));
        query = `paper_trading(${value(signals, input(0), false)}, output['${ohlcvIndex}'], starting_balance=${balance}, position_size=${size}, fee=${fee})`;
      }

      /////////////  DEFAULT  /////////////
      inputs[key] = query; // Process and store key-value pairs
    }
  }
  // console.log({ inputs });

  return inputs; // Return processed inputs
};

// Export the function
export { queriesMaker };

// Handle Value
const value = (value, indices = 0, multi = true) => {
  if (isSource(value)) {
    return `output['${indices}']['${value}']${multi ? "[i]" : ""}`;
  } else if (isNum(value)) {
    // return `${value}`;
    return `output['${indices}']`;
  } else {
    return `output['${indices}']${multi ? "[i]" : ""}`;
  }
};

function buildCheckQuery(val1, val2, condition, inputs) {
  // Determine the range length, ensuring no IndexError
  const rangeExpr = isSource(val1)
    ? `len(output['${inputs[0]}']['${val1}'])`
    : isSource(val2)
    ? `len(output['${inputs[1]}']['${val2}'])`
    : isNum(val1)
    ? `len(output['${inputs[1]}'])`
    : isNum(val2)
    ? `len(output['${inputs[0]}'])`
    : `min(len(output['${inputs[0]}']), len(output['${inputs[1]}']))`;

  // Build expressions for val1 and val2
  const val1Expr = value(val1, inputs[0]);
  const val2Expr = value(val2, inputs[1]);
  let query = "";

  // Build the query string
  if (isNum(val1) && isNum(val2)) {
    query = `${val1Expr} ${condition} ${val2Expr}`;
  } else {
    query =
      `[${val1Expr} ${condition} ${val2Expr} for i in range(${rangeExpr})` +
      (isNum(0) || isNum(1) ? `]` : `if (${val1Expr} is not None and ${val2Expr} is not None)]`);
  }
  return query;
}

const toSingleQuotes = (data) => JSON.stringify(data).replace(/"/g, "'"); // Replace double quotes with single quotes
