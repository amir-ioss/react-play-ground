import { memo, useEffect, useState } from 'react';
import {
    Handle,
    MarkerType,
    Position,
    useEdges,
    useHandleConnections,
    useNodesData,
} from '@xyflow/react';
import useNodeValue from './useNodeValue';
import { Color } from '../utils/colors';

const Parameters = [
    {
        name: "starting_balance",
        type: "number",
        value: 10,
        placeholder: "Starting Balance",
        target: true
    },
    {
        name: "position_size",
        type: "number",
        value: 1,
        placeholder: "Position Size",
        target: true

    },
    {
        name: "fee",
        type: "number",
        value: 0.001, // 0.1 %
        placeholder: "Fee",
        target: true

    }
]


const Inputs = [{
    "name": "Entry Long",
    "type": "number",
    "target": true,
    "InputFormat": "[True False]"
}, {
    "name": "Exit Long",
    "type": "number",
    "target": true,
    "InputFormat": "[True False]"

}, {
    "name": "Entry Short",
    "type": "number",
    "target": true,
    "InputFormat": "[True False]"

}, {
    "name": "Exit Short",
    "type": "number",
    "target": true,
    "InputFormat": "[True False]"
}]

const Outputs = []

const TradeNode = memo(({ data, id, updateNode }) => {
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    useEffect(() => {
        if (data.value.length > 0) {

            const updatedValues = [...data.value];  // Clone the array to avoid direct mutation

            // Dynamically iterate over the indices you want to update (e.g., 1, 2, etc.)
            let valuesChanged = false; // Flag to track if any change occurred

            for (let i = 0; i <= Inputs.length - 1; i++) {
                const val = getVal(i) ?? null;
                // Only update if the value has changed
                if (updatedValues[i] !== val) {
                    updatedValues[i] = val;
                    valuesChanged = true;  // Mark that a value has changed
                }
            }

            // Only call updateNode if a value was actually changed
            if (valuesChanged) {
                updateNode(id, { value: updatedValues });
            }
        }

    }, [edges, data.value]);  // Ensure `data.value` and `edges` are dependencies



    // Initial values
    useEffect(() => {
        const params = Parameters.map(_ => _.value) || [];
        const rest = [null, null, null, null, ...params]
        updateNode(id, { value: rest });
    }, [])



    return <div className={`bg-white border border-emerald-600 flex flex-col justify-center pb-4 rounded-sm`}>
        <div className={`bg-gradient-to-r from-[${Color.TRADE_NODE}] to-emerald-400 p-2 text-white px-4`}>
            <h3 className="text-2xl">{data.name}</h3>
        </div>

        <h3 className='font-bold  p-4 pb-2 border-b'>LONG</h3>
        <div className="relative flex mt-2">
            <label for={'0'} className="ml-4">{"Entry"}  </label>
            <Handle
                type="target"
                position="left"
                id={'0'}
                style={{ background: '#14b8a6', width: 15, height: 15 }}
            />

        </div>

        <div className="relative flex mt-2">
            <label for={'1'} className="ml-4">{"Exit"}  </label>
            <Handle
                type="target"
                position="left"
                id={'1'}
                style={{ background: 'red', width: 15, height: 15 }}
            />
        </div>


        <h3 className='font-bold p-4 pb-2 border-b'>SHORT</h3>

        <div>

            <div className="relative flex mt-2">
                <label for={'2'} className="mx-4">{"Entry"}  </label>
                <Handle
                    type="target"
                    position="left"
                    id={'2'}
                    style={{ background: '#14b8a6', width: 15, height: 15 }}
                />

            </div>

            <div className="relative flex mt-2">
                <label for={'3'} className="mx-4">{"Exit"}  </label>
                <Handle
                    type="target"
                    position="left"
                    id={'3'}
                    style={{ background: 'red', width: 15, height: 15 }}
                />
            </div>
        </div>

        <h3 className='font-bold  my-4 border-b'></h3>


        {/* INPUTS*/}
        {Parameters?.map((field, idx) => {
            const ID = idx + 4 // offset
            return <div className="relative flex items-center mx-4" key={ID}>
                <label for={ID} className="flex-1">{field.placeholder}  </label>
                <input
                    type="text"
                    value={data.value[ID] ?? field.value}
                    onChange={_ => updateNode(id, setVal(data.value, ID, _.target.value))}
                    placeholder={field.type}
                    className={`flex-1  bg-gray-100 m-1 p-1 rounded-md outline-none focus:border-gray-400`}
                    id={ID}
                />

                {/* {field?.target && <Handle
                    type="target"
                    position="left"
                    id={ID}
                    style={{ background: Color.list, width: 15, height: 15, }}
                />} */}

            </div>
        })}


        {/* purposes */}
        <p className="text-xs opacity-70 m-4 my-2">{data.purposes}</p>

    </div>
})


export default TradeNode