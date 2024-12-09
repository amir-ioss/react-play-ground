import { memo, useEffect, useState } from "react";
import { Handle, MarkerType, Position, useEdges, useNodesData } from "@xyflow/react";
import useNodeValue from "../useNodeValue";

const Types = {
    MA: [
        {
            name: "source",
            type: "text",
            // value: 'close',
            placeholder: "Source",
            target: true

        },
        {
            name: "period",
            type: "text",
            value: 5,
            placeholder: "Period",
        }
    ],
    SMA: [
        {
            name: "source",
            type: "text",
            // value: 'close',
            placeholder: "Source",
            target: true

        },
        {
            name: "period",
            type: "text",
            value: 10,
            placeholder: "Period",
        }
    ],
    EMA: [
        {
            name: "source",
            type: "text",
            // value: 'close',
            placeholder: "Source",
            target: true

        },
        {
            name: "period",
            type: "text",
            value: 15,
            placeholder: "Period",
        }
    ],
    MACD: [
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
            placeholder: "macd line",
        },
        {
            name: "signalLine",
            type: "number",
            value: 26,
            placeholder: "signal line",
        },
        {
            name: "histLine",
            type: "number",
            value: 9,
            placeholder: "hist line",

        }
    ]
}




const IndicatorNode = memo(({ data, id, updateNode }) => {
    // 0 = Indicator 
    // 1+ = Params
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);


    // const getVal = (INPUT_ID = 1) => {
    //     const edge = edges.filter(e => e.targetHandle == INPUT_ID)?.[0]
    //     const val = nodesData.filter(e => e.id == edge?.source)?.[0]

    //     if (!val?.data) return null
    //     return val.data.value[edge.sourceHandle]
    // }

    const outs = ["AMIR", "ABBASY", "TEST"]

    // Handler for input changes
    const onInputChange = (event) => {
        const params = Types[event.target.value]?.map(_ => _.value) || [];
        const rest = [event.target.value, ...params]
        updateNode(id, { value: rest, returns: outs });
    };
    
    

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


    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">
        <div className="mx-4">Indicator</div>

        <select
            type="text"
            value={data.value?.[0] ?? ''}
            onChange={e => onInputChange(e)}
            placeholder="Indicator"
            className={'bg-white border p-2 mx-2 rounded-xl'}
        >
            {Object.keys(Types)?.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                    {option}
                </option>
            ))}
        </select>

        {/* INPUT*/}
        {Types[data.value[0]]?.map((field, idx) => {
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

        <Handle
            type="source"
            position={Position.Right}
            id={'0'}
            style={{ background: 'green', width: 15, height: 15, top: 30 }}
            reconnectable="target"
        />

        <Handle
            type="source"
            position={Position.Right}
            id={'1'}
            style={{ background: 'green', width: 15, height: 15, top: 60 }}
            reconnectable="target"
        />

        <Handle
            type="source"
            position={Position.Right}
            id={'2'}
            style={{ background: 'green', width: 15, height: 15, top: 80 }}
            reconnectable="target"
        />



    </div>
})


export { IndicatorNode }