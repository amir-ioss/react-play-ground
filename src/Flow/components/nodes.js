import np_all_json from "../nodes/Math/np_all.json";
import math_json from "../nodes/Math/math.json";

function nodesList() {
  // const numpy_utils = Object.keys(np_all)

  const numpy_utils_list = Object.entries(np_all_json).map((lv1) => {
    const level_2 = Object.entries(lv1[1]).map((lv2) => {
      return {
        name: lv2[0],
        node: "MathUtils",
        type: "math_utils_np",
        data: { value: [lv2[0]], type: lv1[0], name: "Math Utils" },
      };
    });

    const level = {
      name: lv1[0],
      node: "MathUtils",
      type: "math_utils_np",
      submenu: level_2,
    };

    return level;
  });

  const math_list = Object.entries(math_json).map((lv1) => {
    const level = {
      name: lv1[0],
      node: "MathNode",
      type: "math",
      data: { value: [lv1[0]], type: lv1[0], name: "Math" },

      //   submenu: lv1[0],
    };

    return level;
  });

  const nodes = [
    {
      name: "Asset Selector",
      purposes: "Makes it clear that users are selecting an asset or coin.",
      node: "CoinNode",
      type: "coin_data",
    },
    {
      name: "Technical Indicator",
      purposes: "Clarifies that the node deals with technical analysis indicators like RSI, MACD, etc.",
      node: "IndicatorNode",
      type: "indicator",
    },
    {
      name: "Constant Value",
      purposes: "Indicates a fixed value or user-defined numeric input.",
      node: "ValueNode",
    },
    {
      name: "Math Operation",
      purposes: "Specifies that this node performs mathematical calculations.",
      node: "MathNode",
      type: "math",
      submenu: math_list,
    },
    {
      name: "Math Utils",
      purposes: "Specifies that this node performs mathematical special calculations.",
      node: "MathUtils",
      type: "math_utils_np",
      submenu: numpy_utils_list,
    },
    {
      name: "Condition",
      purposes: "Simple and clear to describe a conditional logic node, e.g., >, <, =, etc.",
      node: "ConditionNode",
      type: "check",
    },
    {
      name: "High-Low Detector",
      purposes: "Explicitly states that this node detects high-high or low-low patterns.",
      node: "HHLLNode",
      type: "hhll",
      plot: "lines",
    },
    {
      name: "Trade Executor",
      purposes: "Indicates that this node is responsible for executing trades.",
      node: "TradeNode",
      type: "trade",
    },
    {
      name: "Logic Gate",
      purposes: "Describes the nodes role in applying logical operations like AND, OR, NOT, etc.",
      node: "LogicalNode",
      type: "logic",
    },
  ];

  return nodes;
}

export { nodesList };
