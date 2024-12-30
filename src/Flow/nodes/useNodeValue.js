import { useEdges, useNodesData } from "@xyflow/react";

const useNodeValue = (id) => {
  const edges = useEdges().filter((edge) => edge.target == id);
  const nodesData = useNodesData(edges.map((connection) => connection.source));
  

  const getVal = (INPUT_ID = 1, log = false) => {
    const edge = edges.find((e) => e.targetHandle == INPUT_ID);
    const val = nodesData.find((e) => e.id == edge?.source);

    if (!val?.data) return;

    if (val.data?.returns && val.data?.returns.length > 0) return val.data.returns[edge.sourceHandle];
    return val.data.value[edge.sourceHandle];
  };

  const setVal = (array, index, value) => {
    if (index < 0) {
      throw new Error("Negative index not allowed");
    }
    array[index] = value; // Automatically fills gaps with `undefined` if needed
    return array;
  };

  return { getVal, setVal, edges, nodesData };
};

export default useNodeValue;
