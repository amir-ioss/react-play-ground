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
const INPUTS = [
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
        value: 0.01,
        placeholder: "Fee",
        target: true

    }
]
const TradeNode = memo(({ data, id, updateNode }) => {
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    useEffect(() => {
        const val1 = getVal(1) ?? null;
        // const val2 = getVal(2) ?? null;
        if (data.value[1] !== val1) {
            updateNode(id, { value: setVal(data.value, 1, val1) });
        }

        // if (data.value[2] !== val2) {
        //     updateNode(id, setVal(data.value, 2, val2));
        // }

    }, [edges])


    // Initial values
    useEffect(() => {
        const params = INPUTS.map(_ => _.value) || [];
        const rest = ['paper_trading_node', null, ...params]
        updateNode(id, { value: rest });
    }, [])




    return <div className="bg-gray-200 min-w-64 border border-blue-600  border-black flex flex-col justify-center pb-4">
        <div className="bg-gradient-to-r  from-green-600 to-blue-400 p-2 text-white px-4 mb-4">
            <h3 className="text-2xl">{data.name}</h3>
        </div>

        <Handle
            type="target"
            position="left"
            id={'1'}
            style={{ background: '#14b8a6', width: 15, height: 15, top: 70 }}
        />

        {/* INPUTS*/}
        {INPUTS?.map((field, idx) => {
            const ID = idx + 2 // offset
            return <div className="relative flex mt-2" key={ID}>
                <label for={ID} className="mx-2">{field.placeholder}  </label>
                <input
                    type="text"
                    value={data.value[ID] ?? field.value}
                    onChange={_ => updateNode(id, setVal(data.value, ID, _.target.value))}
                    placeholder={field.type}
                    className="flex-1 p-1 border mx-2 rounded-xl"
                    id={ID}
                />

                {/* {field?.target && <Handle
                    type="target"
                    position="left"
                    id={ID}
                    style={{ background: 'gray', width: 15, height: 15, }}
                />} */}

            </div>
        })}

        
        {/* purposes */}
        <p className="text-xs opacity-70 m-4 my-2">{data.purposes}</p>

    </div>
})


export default TradeNode