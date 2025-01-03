const macd = ["macd", "macdsignal", "macdhist"];
const isNum = (_) => !isNaN(Number(_));
const isSource = (_) => ["time", "open", "high", "low", "close", "volume", ...macd].includes(_);

const queriesMaker = (obj) => {
  var ohlcvIndex = 0;
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

      const store_id = (ID) => obj.findIndex((_) => _.id == ID);
      const input = (INDEX) => store_id($.preNode[INDEX]?.["id"]);

      /////////////  COIN  /////////////
      if ($.type == "coin_data") {
        const [t, o, h, l, c, v, period, timeFrame] = $.value;

        let symbol = "BTC/USDT";
        let timeframe = timeFrame ?? "5m";
        let limit = period ?? 500;
        query = `fetch_ohlcv('${symbol}', '${timeframe}', ${value(limit, input(0), false)})`;

        ohlcvIndex = key;
      }

      /////////////  MATH  /////////////
      /////////////  CHECK  /////////////
      if ($.type == "check" || $.type == "math") {
        // 10 (>,+) 20
        let [val1, val2, condition] = $.value;
        let vals = [val1, val2];

        // const inputs = $.preNode.map((_, k) => {
        //   if (!["coin_data", "indicator"].includes(_?.type)) {
        //     if (isSource(vals[k])) {
        //       vals[k] = vals[k] + "_";
        //     }
        //   }
        //   return store_id(_.id);
        // });

        const inputs = $.preNode.map((_, k) => store_id(_.id));
        query = buildCheckQuery(vals[0], vals[1], condition, inputs);
      }

      if ($.type == "math") {
        const [condition, ...vals] = $.value;

        $.preNode.map((_, k) => {
          var ID = store_id(_.id);
          vals[k] = value(vals[k], ID, false);
          return ID;
        });

        query = `${vals[0]} ${$.func["Value"]} ${vals[1]}`;
      }

      if ($.type == "math_utils_np") {
        const [func, ...vals] = $.value;
        // const source_length = $.preNode.length;
        // let vals = rest.slice(0, source_length);
        // let params = rest.slice(source_length);
        $.preNode.map((_, k) => {
          var ID = store_id(_.id);
          vals[k] = value(vals[k], ID, false);
          return ID;
        });

        // query = `talib.${indicator}(${[...vals, ...params].join(",")})`;
        query = `np.${func}(${vals.join(",")})`;

        // RETURNS TO NAMED KEYS
        if ($.returns && $.returns.length > 0) {
          query += ` -> ${toSingleQuotes($.returns)}`;
        }
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
        const [indicator, ...rest] = $.value;

        const source_length = $.preNode.length;
        let vals = rest.slice(0, source_length);
        let params = rest.slice(source_length);

        const inputs = $.preNode.map((_, k) => {
          var ID = store_id(_.id);
          // if (!["coin_data", "indicator"].includes(_?.type)) {
          //   if (isSource(vals[k])) {
          //     vals[k] = value(vals[k] + "_", ID, false);
          //   }
          // } else {
          vals[k] = value(vals[k], ID, false);
          // }
          return ID;
        });

        query = `talib.${indicator}(${[...vals, ...params].join(",")})`;

        // RETURNS TO NAMED KEYS
        if ($.returns && $.returns.length > 0) {
          query += ` -> ${toSingleQuotes($.returns)}`;
        }
      }

      /////////////  HH/LL  /////////////
      if ($.type == "hhll") {
        const [fun, source, period] = $.value;
        query = `talib.${fun}(${value(source, input(0), false)}, ${period})`;
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
      if ($.type == "trade") {
        // const source_length = $.preNode.length;
        const source_length = 4;
        let vals = $.value.slice(0, source_length);
        let params = $.value.slice(source_length);
        const [balance, size, fee] = params;

        // $.preNode.map((_, k) => {
        new Array(source_length).fill("None").map((_, k) => {
          var ID = store_id($.preNode[k]?.id);
          // vals[k] = value(vals[k], ID, false) ?? _;
          vals[k] = ID >= 0 ? `output['${ID}']` : _;
        });
        query = `paper_trading(${vals.join(", ")}, ohlcv=output['${ohlcvIndex}'], starting_balance=${balance}, position_size=${size}, fee=${fee})`;
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
  let result = value;
  if (indices < 0) return result;
  if (isSource(value)) {
    result = `output['${indices}']['${value}']${multi ? "[i]" : ""}`;
  } else if (isNum(value)) {
    // return `${value}`;
    result = `output['${indices}']`;
  } else {
    result = `output['${indices}']${multi ? "[i]" : ""}`;
  }

  if (multi) return `non_num(${result})`;
  return result;
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
      `np.array([${val1Expr} ${condition} ${val2Expr} for i in range(${rangeExpr})` +
      (isNum(0) || isNum(1) ? `])` : `if (${val1Expr} is not None and ${val2Expr} is not None)])`);
  }
  return query;
}

const toSingleQuotes = (data) => JSON.stringify(data).replace(/"/g, "'"); // Replace double quotes with single quotes
