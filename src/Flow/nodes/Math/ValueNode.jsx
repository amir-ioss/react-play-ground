import React from 'react'
import { Handle, Position } from "@xyflow/react";



export default function ValueNode({ data, id, updateNode }) {
  // Handler for input changes
  const onInputChange = (event) => {
    updateNode(id, { value: [event.target.value] });
  };

  return (
    <div className="bg-white min-w-64 border border-blue-600  border-black flex flex-col justify-center pb-2 rounded-sm">
      <div className="bg-gradient-to-r  from-blue-600 to-blue-400 p-2 text-white px-4 mb-2">
        <h3 className="text-2xl">{data.name}</h3>
      </div>


      <div className="relative flex flex-col mt-6 relative">
        <label className="text-gray-500 -top-4 text-xs mx-4 absolute">Value</label>
        <div className="mx-4 flex-1 ">
          <input
            type="number"
            // value={data.value[0]}
            onChange={onInputChange}
            placeholder="Number"
            id={'0'}
            className={`w-full bg-gray-100 p-2 rounded-md outline-none focus:border-gray-400`}
          />
          {/* Input Handles */}
          <Handle
            type="source"
            position="right"
            id={'0'} // Another unique id
            style={{ background: 'orange', width: 15, height: 15, }}
          />
        </div>
      </div>

    </div>
  );
};

