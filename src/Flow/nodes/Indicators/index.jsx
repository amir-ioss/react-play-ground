import { useEffect, useState } from "react";
import { Handle, MarkerType, Position } from "@xyflow/react";

const Types = {
    MA: [
        {
            name: "source",
            type: "text",
            value: 'close',
            placeholder: "Source",
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
            value: 'close',
            placeholder: "Source",
        },
        {
            name: "period",
            type: "text",
            value: 10,
            placeholder: "Source",
        }
    ],
    EMA: [
        {
            name: "source",
            type: "text",
            value: 'close',
            placeholder: "Source",
        },
        {
            name: "period",
            type: "text",
            value: 15,
            placeholder: "Source",
        }
    ],
    MACD: [
        {
            name: "source",
            type: "text",
            value: 'close',
            placeholder: "Source",
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




const IndicatorNode = ({ data, id, updateNode }) => {
    const [state, setState] = useState({ indicator: data.value, 'source': 'close', 'period': 5 })

    useEffect(() => {
        // updateNode(id, `talib.${state.indicator}(close, fastperiod=12, slowperiod=26, signalperiod=9)[0]`);
        const params = Object.values(state).slice(1).join(',')

        updateNode(id, `talib.${state.indicator}(${params})`)
        console.log(state);

    }, [state])


    // Handler for input changes
    // const onInputChange = (event) => {
    //     updateNode(id, event.target.value);
    // };



    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">
        <div className="mx-4">Indicator</div>

        <select
            type="text"
            value={state?.indicator}
            onChange={e => {
                let fields_values = Types[e.target.value].reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});
                setState({ indicator: e.target.value, ...fields_values })
            }}
            placeholder="Indicator"
            className={'bg-white border p-2 mx-2 rounded-xl'}

        >
            {Object.keys(Types)?.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                    {option}
                </option>
            ))}
        </select>

        {Types[state.indicator]?.map((field, idx) => {
            return <div className="relative flex mt-2">
                <label for={'input-' + idx} className="mx-2">{field.placeholder}  </label>
                <input key={idx}
                    type="text"
                    value={state[field.name]}
                    onChange={_ => setState(prev => ({ ...prev, [field.name]: _.target.value }))}
                    placeholder={field.type}
                    className="flex-1 p-1 border mx-2 rounded-xl"
                    id={'input-' + field.name + idx}
                />

                {/* <Handle
                    type="source"
                    position="left"
                    id={'source-' + idx} // Another unique id
                    style={{ background: 'green', width: 15, height: 15 }}
                // className="size-12 border border-black"
                /> */}

            </div>
        })}


        <Handle
            type="source"
            position={Position.Right}
            id={'src_indicator_' + id} // Another unique id
            style={{ background: 'green', width: 15, height: 15 }}
            reconnectable="target"
            markerEnd={{
                type: MarkerType.Arrow,
            }}
            label='default arrow'

        // className="size-12 border border-black"
        />





        {/* <Handle
            type="target"
            position="left"
            id={'target-' + id} // Another unique id
            style={{ background: 'orange' }}

        />

        <Handle
            type="target"
            position="left"
            id={'target-2-' + id} // Another unique id
            style={{ background: 'orange', 'marginTop': 10 }}

        /> */}





    </div>
}


export { IndicatorNode }