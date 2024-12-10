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

        },
        {
            name: "MACD Line",
            type: "array",
            value: 'macd_line',
            source: true
        },
        {
            name: "Signal Line",
            type: "array",
            value: 'signal_line',
            source: true
        },
        {
            name: "MACD Histogram",
            type: "array",
            value: 'macd_histogram',
            source: true
        }
    ]
}




const IndicatorNode = memo(({ data, id, updateNode }) => {
    // 0 = Indicator 

    // 1+ = Params
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    const INPUTS = Types[data.value[0]]?.filter(_ => !_?.source) ?? []
    const OUTPUTS = Types[data.value[0]]?.filter(_ => _.source) ?? []


    // Handler for input changes
    const onChangeIndicator = (event) => {
        const inputs = Types[event.target.value]?.filter(_ => !_?.source)
        const params = inputs?.map(_ => _.value) || [];
        const rest = [event.target.value, ...params]

        const returns = Types[event.target.value].filter(_ => (_?.source)).map(_ => _.value)
        updateNode(id, { value: rest, returns });
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
            onChange={e => onChangeIndicator(e)}
            placeholder="Indicator"
            className={'bg-white border p-2 mx-2 rounded-xl'}
        >
            {Object.keys(Types)?.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                    {option}
                </option>
            ))}
        </select>

        {/* INPUTS*/}
        {INPUTS?.map((field, idx) => {
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

        {/* OUTPUTS */}
        {OUTPUTS.map((field, idx) => {
            let ID = idx // offset
            return <div className="relative flex mt-2 justify-end" key={ID}>
                <label for={ID} className="mx-4">{field.name}</label>
                <Handle
                    type="source"
                    position={Position.Right}
                    id={`${ID}`}
                    style={{ background: 'green', width: 15, height: 15, }}
                    reconnectable="target"
                />
            </div>
        })}

        {OUTPUTS.length == 0 && <Handle
            type="source"
            position={Position.Right}
            id={'0'}
            style={{ background: 'green', width: 15, height: 15, }}
            reconnectable="target"
        />}


    </div>
})


export { IndicatorNode }