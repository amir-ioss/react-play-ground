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
            source: true
        },
        {
            name: "signalLine",
            type: "number",
            value: 26,
            placeholder: "signal line",
            source: true

        },
        {
            name: "histLine",
            type: "number",
            value: 9,
            placeholder: "hist line",
            source: true

        }
    ]
}




const IndicatorNode = memo(({ data, id, updateNode }) => {
    // 0 = Indicator 
    // 1+ = Params
    const { setVal, edges, nodesData } = useNodeValue(id);


    const getVal = (INPUT_ID = 1) => {
        const edge = edges.filter(e => e.targetHandle == INPUT_ID)?.[0]
        const val = nodesData.filter(e => e.id == edge?.source)?.[0]

        if (!val?.data) return null
        return val.data.value[edge.sourceHandle]
    }


    // Handler for input changes
    const onInputChange = (event) => {
        const params = Types[event.target.value]?.map(_ => _.value) || [];
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
        console.log(data.value);

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



                {field?.source && <Handle
                    type="source"
                    position={Position.Right}
                    id={"source" + ID}
                    style={{ background: 'orange', width: 15, height: 15 }}
                    reconnectable="target"
                // markerEnd={{
                //     type: MarkerType.Arrow,
                // }}
                // label='default arrow'
                />}


            </div>
        })}

        {/* OUTPUT */}
         <Handle
            type="source"
            position={Position.Right}
            id={'indcOut'}
            style={{ background: 'green', width: 15, height: 15 }}
            reconnectable="target"
            markerEnd={{
                type: MarkerType.Arrow,
            }}
            label='default arrow'

        // className="size-12 border border-black"
        /> 



    </div>
})


export { IndicatorNode }