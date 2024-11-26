var obj = [
  {
    id: "1",
    label: "SMA",
    value: "talib.SMA(close, 5)",
    preNode: [],
  },
  {
    id: "2",
    label: "EMA",
    value: "talib.EMA(close, 5)",
    preNode: [],
  },
  {
    id: "3",
    label: "Node 3",
    value: "==",
    type: "check",
    preNode: [
      {
        id: "1",
        label: "SMA",
        value: "talib.SMA(close, 5)",
      },
      {
        id: "2",
        label: "EMA",
        value: "talib.EMA(close, 5)",
      },
    ],
  },
  {
    id: "4",
    label: "SMA",
    value: "talib.MACD(close, fastperiod=12, slowperiod=26, signalperiod=9)[0]",
    preNode: [],
  },
  {
    id: "5",
    label: "Node 5",
    value: ">",
    type: "check",
    preNode: [
      {
        id: "4",
        label: "SMA",
        value: "talib.MACD(close, fastperiod=12, slowperiod=26, signalperiod=9)[0]",
      },
      {
        id: "1",
        label: "SMA",
        value: "talib.SMA(close, 5)",
      },
    ],
  },
  {
    id: "5",
    label: "Node 5",
    preNode: [
      {
        id: "1",
        label: "SMA",
        value: "talib.SMA(close, 5)",
      },
      {
        id: "4",
        label: "Node 4",
      },
    ],
  },
];

//  # Inputs containing steps and conditions
//  inputs = {
//  "1": "talib.SMA(close, 5)",  # Simple Moving Average
//  "2": "talib.EMA(close, 5)",  # Exponential Moving Average
//  "3": "[x > output['1'][i] for i, x in enumerate(close)]",  # Close greater than SMA
//  "4": "[output['3'][i] > output['2'][i] for i in range(len(close)) if output['3'][i] is not None]",
//  "5": "talib.MACD(close, fastperiod=12, slowperiod=26, signalperiod=9)[0]",  # MACD line
//  "6": "[output['5'][i] > output['4'][i] for i in range(len(close)) if output['4'][i] is not None]",
//  }
//  # Initialize the output dictionary
//  output = {}

const queriesMaker = () => {
  // Validate the input object
  // if (typeof obj !== 'object' || obj === null) {
  //   throw new Error('Invalid input: Expected an object.');
  // }

  const inputs = {}; // Use inputs for any required processing
  console.log(obj); // Log the input object for debugging

  // Example logic for processing the input object
  for (const key in obj) {
    let query = obj[key].value;
    if (Object.hasOwnProperty.call(obj, key)) {
      var $ = obj[key];
     

      if ($.type == "check") {
        // query = `[${$.preNode[0]?.['id']} ${$.value} output['1'][i] for i, x in enumerate(close)]`
        query = `[output['${$.preNode[0]?.['id']}'][i] ${$.value} output['${$.preNode[1]?.['id']}'][i] for i in range(len(close)) if output['${$.preNode[0]?.['id']}'][i] is not None]`;
      }
      inputs[key] = query; // Process and store key-value pairs
    }
  }
  console.log({ inputs });

  return inputs; // Return processed inputs
};

// Export the function
export { queriesMaker };
