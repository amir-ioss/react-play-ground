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


const OPTIONS = [
    { value: null, name: "SELECT" },
    { value: "MAX", name: "highest high" },
    { value: "MIN", name: "lowest low" }]


const fields = [
    {
        name: "source",
        type: "text",
        // value: 'close',
        placeholder: "Source",
        target: true
    },
    {
        name: "macdLine",
        type: "number",
        value: 12,
        placeholder: "Period",
    },
]


const HHLLNode = memo(({ data, id, updateNode }) => {
    // 0 = HH/LL 
    // 1+ = Params
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    // Handler for input changes
    const onInputChange = (event) => {
        const params = fields.map(_ => _.value) || [];
        const rest = [event.target.value, ...params]
        updateNode(id, rest);
    };

    useEffect(() => {
        const val1 = getVal(1) ?? null;
        const val2 = getVal(2) ?? null;


        if (data.value[1] !== val1) {
            updateNode(id, setVal(data.value, 1, val1));
        }

        // if (data.value[2] !== val2) {
        //     updateNode(id, setVal(data.value, 2, val2));
        // }

    }, [edges])


    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">

        <div className="mx-4">high/low</div>
        <select
            type="text"
            value={data.value?.[0] ?? ''}
            onChange={onInputChange}
            placeholder="Indicator"
            className={'bg-white border p-2 mx-2 rounded-xl'}

        >
            {OPTIONS.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>



        {/* INPUT*/}
        <label className="px-4">{data.label}</label>

        {fields?.map((field, idx) => {
            const ID = idx + 1 // offset
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

                {field?.target && <Handle
                    type="target"
                    position="left"
                    id={ID}
                    style={{ background: 'gray', width: 15, height: 15 }}
                />}

            </div>
        })}

        {/* OUTPUT */}
        <div className="relative  items-center">
            <Handle
                type="source"
                position={Position.Right}
                id={'0'} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
                label='default arrow'
            />
        </div>



    </div>
})


export { HHLLNode }