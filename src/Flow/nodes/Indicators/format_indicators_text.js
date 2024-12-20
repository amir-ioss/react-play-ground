import raw from "./talib_details.txt";

function parseTextToJSON(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const result = {
    input: [],
    parameters: [],
    outputs: [],
  };

  let section = "";

  for (const line of lines) {
    if (!line || line === '"""') {
      // Skip empty lines or lines containing only """
      continue;
    }

    if (line.startsWith("Inputs:")) {
      section = "input";
    } else if (line.startsWith("Parameters:")) {
      section = "parameters";
    } else if (line.startsWith("Outputs:")) {
      section = "outputs";
    } else {
      if (section === "input") {
        const match = line.match(/(\w+):\s*(.*)/);
        if (match) {
          const key = match[1];
          const value = match[2];
          if (value.startsWith("[")) {
            // Parse array if it starts with [
            result.input = JSON.parse(value.replace(/'/g, '"'));
          } else {
            result.input.push(key);
          }
        }
      } else if (section === "parameters") {
        const match = line.match(/(\w+):\s*(\d+)/);
        if (match) {
          result.parameters.push([match[1], parseInt(match[2], 10)]);
        }
      } else if (section === "outputs") {
        result.outputs.push(line);
      }
    }
  }

  return result;
}
function convertToDesiredFormat(parsedOutput, name, description, type) {
  return {
    Name: name,
    Description: description.trim().replace(/\s+/g, " "),
    Type: type,
    Inputs: parsedOutput.input.map((input) => ({
      name: input,
      type: "number",
      target: true,
    })),
    Parameters: parsedOutput.parameters.map(([paramName, paramValue]) => ({
      name: paramName,
      type: "number",
      value: paramValue,
    })),
    Outputs: parsedOutput.outputs.map((output) => {
      const match = output.match(/^(\w+)\s*\((.+)\)$/); // Match name and rule
      if (match) {
        return {
          name: match[1], // Extracted name
          type: "number",
          source: true,
          value: match[1], // Use the name as value
          OutputRule: match[2], // Extracted rule
        };
      }
      return {
        name: output,
        type: "number",
        source: true,
        value: output,
      };
    }),
  };
}
const format_indicators_text = async () => {
  var indicators = {};
  var text = await fetch(raw).then((r) => r.text());
  var rows = text.split('""" ');
  // "LINEARREG_SLOPE(real[, timeperiod=?])\n\n    Linear Regression Slope (Statistic Functions)\n\n    Inputs:\n        real: (any ndarray)\n    Parameters:\n        timeperiod: 14\n    Outputs:\n        real\n    \"\"\"\n"
  rows.forEach((row) => {
    var name = row.split("(").at(0);
    var desc_ = row.split("\n\n ").at(1);
    // var desc = desc_.split('(')
    var parts = desc_ ? desc_.split("(") : [""];
    var desc = parts.slice(0, parts.length - 1).join();
    var type = parts.at(-1).replace(")", "");

    // var members = row ? row.split('\n\n ')[2].split(/\r?\n/) : []
    // var _inputs = members[1]
    // var _params = members[2]

    var in_outs = parseTextToJSON(row.split("\n\n ")[2] ?? "");
    // console.log(in_outs);

    const formattedOutput = convertToDesiredFormat(in_outs, name, desc, type);
    // console.log(formattedOutput);

    Object.assign(indicators, { [formattedOutput.Name]: formattedOutput });

    // if (_params.includes('Parameters')) {
    //     console.log(_params);
    // }
  });
  console.log(indicators);
};







// format_indicators_text()
