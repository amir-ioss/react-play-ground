const macd = ["macd", "macdsignal", "macdhist"];
const isNum = (_) => !isNaN(Number(_));
const isSource = (_) => ["time", "open", "high", "low", "close", "volume", ...macd].includes(_);

const queriesMaker = (obj) => {
  var ohlcvIndex = 0;
  // Validate the input object
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Invalid input: Expected an object.");
  }

  const inputs = {}; // Use inputs for any required processing
  // console.log(obj); // Log the input object for debugging

  // Example logic for processing the input object
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      var $ = obj[key];
      let query = $.value[0];
      const preNodeLen = $.preNode.length;

      const store_id = (ID) => obj.findIndex((_) => _.id == ID);
      const source = (_) => {
        let values = _;
        for (let i = 0; i < preNodeLen; i++) {
          let _ = $.preNode[i];
          var ID = store_id(_.id);
          var isMulti = _.returns && _.returns.length > 1;
          values[i] = VALUE(values[i], ID, isMulti);
        }
        return values
      };

      /////////////  COIN  /////////////
      if ($.node == "CandlesNode") {
        const [asset, timeFrame, period] = $.value;

        let symbol = asset ?? "BTC/USDT";
        let timeframe = timeFrame ?? "5m";
        let limit = period ?? 50;
        query = `fetch_ohlcv('${symbol}', '${timeframe}', ${limit})`;

        ohlcvIndex = key;
      }

      /////////////  CHECK  /////////////
      if ($.node == "ConditionNode") {
        // ==, !=, <, <=, >
        let [val1, val2, condition] = $.value;
        let vals = [val1, val2];
        const inputs = source(vals);

        query = `${inputs[0]} ${condition} ${inputs[1]}`;
      }

      if ($.node == "LogicalNode") {
        // 10, AND, 20
        const [val1, val2, condition] = $.value;
        query = `${condition}(output['${store_id(0)}'], output['${store_id(1)}'])`;
      }

      /////////////  MATH  /////////////
      if ($.node == "MathNode") {
        const [condition, ...vals] = $.value;
        const inputs = source(vals);

        query = `${inputs[0]} ${$.func["Value"]} ${inputs[1]}`;
      }

      if ($.node == "MathUtils") {
        const [func, ...vals] = $.value;
        const inputs = source(vals);

        if ($.type == "Arithmetic_&_Logical_Ops") {
          query = `np.${$.func["Value"]}(${inputs.join(",")})`;
        } else {
          query = `np.${func}(${inputs.join(",")})`;
        }
        // RETURNS TO NAMED KEYS
        if ($.returns && $.returns.length > 0) {
          query += ` -> ${toSingleQuotes($.returns)}`;
        }
      }

      /////////////  INDICATOR  /////////////
      if ($.node == "IndicatorNode") {
        const [indicator, ...rest] = $.value;

        let vals = rest.slice(0, preNodeLen);
        let params = rest.slice(preNodeLen);
        const inputs = source(vals);

        query = `talib.${indicator}(${[...inputs, ...params].join(",")})`;

        // RETURNS TO NAMED KEYS
        if ($.returns && $.returns.length > 0) {
          query += ` -> ${toSingleQuotes($.returns)}`;
        }
      }

      /////////////  HH/LL  /////////////
      if ($.node == "HHLLNode") {
        const [fun, source, period] = $.value;
        query = `talib.${fun}(${VALUE(source, store_id(0), false)}, ${period})`;
        if (fun == "support_resistance_levels") {
          query = `support_resistance_levels(output['${ohlcvIndex}'], window=${period}) -> ['support1', 'support2', 'support3', 'resistance1', 'resistance2', 'resistance3']`;
        }

        if (fun == "support_resistance") {
          query = `support_resistance(output['${ohlcvIndex}'], window=${period}) -> ['supports', 'resists']`;
        }
        if (fun == "luxalgo_support_resistance") {
          query = `luxalgo_support_resistance(output['${ohlcvIndex}']) -> ['low_pivot', 'high_pivot', 'breaks', 'wick_breaks', 'osc']`;
        }
      }

      /////////////  TRADE  /////////////
      if ($.node == "TradeNode") {
        // const source_length = $.preNode.length;
        const source_length = 4;
        let vals = $.value.slice(0, source_length);
        let params = $.value.slice(source_length);
        const [balance, size, fee] = params;
        // const inputs = source(vals);

        // $.preNode.forEach((_, k) => {
        new Array(source_length).fill("None").map((_, k) => {
          var ID = store_id($.preNode[k]?.id);
          // vals[k] = value(vals[k], ID, false) ?? _;
          vals[k] = ID >= 0 ? `output['${ID}']` : _;
        });
        query = `paper_trading(${vals.join(", ")}, ohlcv=output['${ohlcvIndex}'], starting_balance=${balance}, position_size=${size}, fee=${fee})`;
      }

      if ($.node == "PastValue") {
        const [val, offset] = $.value;
        const inputs = source([val]);

        query = `offset_index(${inputs[0]}, ${offset})`;
      }

      if ($.node == "InvertNode") {
        let vals = $.value;
        const inputs = source([vals]);

        query = `~${inputs[0]}`;
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
const VALUE = (value, ID, multi = false) => {
  let result = value;
  if (isNum(value)) {
    result = `output['${ID}']`;
  } else {
    result = `output['${ID}']${multi ? `['${value}']` : ""}`;
  }
  return result;
};

const toSingleQuotes = (data) => JSON.stringify(data).replace(/"/g, "'"); // Replace double quotes with single quotes
