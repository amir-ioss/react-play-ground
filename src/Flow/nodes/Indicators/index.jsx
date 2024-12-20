import { memo, useEffect, useState } from "react";
import { Handle, MarkerType, Position, useEdges, useNodesData } from "@xyflow/react";
import useNodeValue from "../useNodeValue";
import Indicators from './indicators.json'


const IndicatorNode = memo(({ data, id, updateNode }) => {
    // 0 = Indicator 
    // Inputs 
    // Parameters 
    // Outputs 

    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    // Handler for input changes
    const onChangeIndicator = (event) => {
        const inputs = Indicators[event.target.value]?.Inputs.map(_ => _.value)
        const params = Indicators[event.target.value]?.Parameters.map(_ => _.value)

        const rest = [event.target.value, ...inputs, ...params]

        const returns = Indicators[event.target.value]?.Outputs.map(_ => _.value)
        updateNode(id, { value: rest, returns, indicator: Indicators[event.target.value] });
    };


    useEffect(() => {
        const updatedValues = [...data.value];  // Clone the array to avoid direct mutation

        // Dynamically iterate over the indices you want to update (e.g., 1, 2, etc.)
        let valuesChanged = false; // Flag to track if any change occurred

        if (data?.indicator) {
            for (let i = 1; i <= data?.indicator.Inputs.length; i++) {
                const val = getVal(i) ?? null;
                // Only update if the value has changed
                if (updatedValues[i] !== val) {
                    updatedValues[i] = val;
                    valuesChanged = true;  // Mark that a value has changed
                }
            }
        }

        // Only call updateNode if a value was actually changed
        if (valuesChanged) {
            updateNode(id, { value: updatedValues });
        }
    }, [edges, data.value]);  // Ensure `data.value` and `edges` are dependencies


    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">
        <div className="mx-4">{data.label}</div>

        <select
            type="text"
            value={data.value?.[0] ?? ''}
            onChange={e => onChangeIndicator(e)}
            placeholder="Indicator"
            className={'bg-white border p-2 mx-2 rounded-xl'}
        >
            {Object.keys(Indicators)?.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                    {option}
                </option>
            ))}
        </select>

        <div className="mx-4 my-2">
            <p className="text-xl">{data?.indicator?.Description}</p>
            <p className="text-xs">{data?.indicator?.Type}</p>
        </div>

        {/* INPUTS*/}
        {data?.indicator && [...data?.indicator.Inputs, ...data?.indicator.Parameters]?.map((field, idx) => {
            const ID = idx + 1 // offset
            return <div className="relative flex mt-2" key={ID}>
                <label for={ID} className="mx-2">{field.placeholder}  </label>
                <input
                    type="text"
                    value={data.value[ID] ?? field.value}
                    onChange={_ => updateNode(id, setVal(data.value, ID, _.target.value))}
                    placeholder={field.name}
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

        {/* OUTPUTS */}
        {data?.indicator && data.indicator.Outputs.map((field, idx) => {
            let ID = idx // offset
            return <div className="relative flex mt-2 justify-end" key={ID}>
                <div className="text-right mx-4">
                    <label for={ID}>{field.name}</label>
                    <p className="text-xs">{field?.OutputRule}</p>
                </div>
                <Handle
                    type="source"
                    position={Position.Right}
                    id={`${ID}`}
                    style={{ background: 'green', width: 15, height: 15, }}
                    reconnectable="target"
                />

            </div>
        })}

        {data?.indicator && data.indicator.Outputs.length == 0 && <Handle
            type="source"
            position={Position.Right}
            id={'0'}
            style={{ background: 'green', width: 15, height: 15, }}
            reconnectable="target"
        />}


    </div>
})


export { IndicatorNode }