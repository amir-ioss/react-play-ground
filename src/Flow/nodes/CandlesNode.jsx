import { memo, useEffect, useState } from "react";
import { Handle, MarkerType, Position, useEdges, useNodesData } from "@xyflow/react";
import useNodeValue from "./useNodeValue";
import { Color } from '../utils/colors'


const TIME_FRAMES = [
    { "value": null, "name": "SELECT" },
    { "value": "1m", "name": "1 Minute" },
    { "value": "3m", "name": "3 Minutes" },
    { "value": "5m", "name": "5 Minutes" },
    { "value": "10m", "name": "10 Minutes" },
    { "value": "15m", "name": "15 Minutes" },
    { "value": "30m", "name": "30 Minutes" },
    { "value": "1h", "name": "1 Hour" },
    { "value": "2h", "name": "2 Hours" },
    { "value": "4h", "name": "4 Hours" },
    { "value": "6h", "name": "6 Hours" },
    { "value": "8h", "name": "8 Hours" },
    { "value": "12h", "name": "12 Hours" },
    { "value": "1d", "name": "1 Day" },
    { "value": "3d", "name": "3 Days" },
    { "value": "1w", "name": "1 Week" },
    { "value": "1M", "name": "1 Month" }
]


const NODE = {
    "Name": "MACD",
    "Description": "Moving Average Convergence/Divergence",
    "Type": "Momentum Indicators",
    // "Inputs": [
    //     {
    //         "name": "real",
    //         "type": "number",
    //         "target": true
    //     }
    // ],
    // "Parameters": [
    //     {
    //         "name": "fastperiod",
    //         "type": "number",
    //         "value": 12
    //     },
    // ],
    "Outputs": [
        {
            "name": "time",
            "type": "number",
            "value": 'time',
            "source": true,

        },
        {
            "name": "open",
            "type": "number",
            "value": 'open',
            "source": true,

        },
        {
            "name": "high",
            "type": "number",
            "value": 'high',
            "source": true,

        },
        {
            "name": "low",
            "type": "number",
            "value": 'low',
            "source": true,

        },
        {
            "name": "close",
            "type": "number",
            "value": 'close',
            "source": true,

        },
        {
            "name": "volume",
            "type": "number",
            "value": 'volume',
            "source": true,

        }

    ]
}


const CandlesNode = memo(({ data, id, updateNode }) => {
    // const [state, setState] = useState({})
    // 0 = Indicator 
    // Inputs 
    // Parameters 
    // Outputs 

    const Func = NODE
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    // On Connect
    useEffect(() => {
        const updatedValues = [...data.value];  // Clone the array to avoid direct mutation

        // Dynamically iterate over the indices you want to update (e.g., 1, 2, etc.)
        let valuesChanged = false; // Flag to track if any change occurred

        if (data?.func) {
            for (let i = 1; i <= Func.Inputs.length; i++) {
                const val = getVal(i) ?? data.value[i] ?? null;
                // Only update if the value has changed
                if (updatedValues[i] !== val) {
                    updatedValues[i] = val;
                    valuesChanged = true;  // Mark that a value has changed
                }
            }
        }

        // Only call updateNode if a value was actually changed
        if (valuesChanged) {
            updateNode(id, { "value": updatedValues });
        }
    }, [edges, data.value]);  // Ensure `data.value` and `edges` are dependencies


    return <div className={`bg-white border border-[${Color.CANDLE_NODE}] border-black flex flex-col justify-center pb-4 rounded-sm`}>
        <div className={`bg-gradient-to-r from-[${Color.CANDLE_NODE}] to-emerald-400 p-2 text-white px-4`}>
            <h3 className="text-2xl">{data.name}</h3>
        </div>

        {/* <div className="mx-4 my-2">
            <p className="text-sm">{Func.Description}</p>
            <p className="text-xs">{Func?.Type}</p>
        </div> */}

        <div className="m-4 flex items-center">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" className="size-12" />
            <h3 className="font-semibold text-xl ml-4">BTC/USDT</h3>
        </div>



        <div className="relative flex flex-col mt-6 relative ">
            <label className="text-gray-500 -top-4 text-xs mx-4 absolute">{"ASSET"}  </label>
            <div className="mx-4 flex-1 ">
                <input
                    type="text"
                    value={data.value[0]}
                    onChange={_ => updateNode(id, setVal(data.value, 0, _.target.value))}
                    placeholder={"BTC/USDT"}
                    className={`w-full bg-gray-100 p-2 rounded-md outline-none focus:border-gray-400 mt-2 font-semibold`}
                />
            </div>
        </div>


        <div className="relative flex flex-col mt-6 relative mx-4">
            <label className="text-gray-500 -top-4 text-xs  absolute">{"TIME FRAME"}</label>
            <select
                type="text"
                value={data.value?.[1] ?? ''}
                onChange={_ => updateNode(id, setVal(data.value, 1, _.target.value))}
                placeholder="Indicator"
                className={`w-full bg-gray-100 p-2 rounded-md outline-none focus:border-gray-400 mt-2`}
            >
                {TIME_FRAMES.map((fun, optIndex) => {
                    return <option key={optIndex} value={fun.value}>
                        {fun.name}
                    </option>
                })}
            </select>
        </div>



        {/* INPUTS*/}
        {/* {Func.Inputs?.map((field, idx) => {
            const ID = idx + 1 // offset
            return <div className="relative flex mt-2" key={ID}>
                <label for={ID} className="mx-2">{field.placeholder}  </label>
                <input
                    type="text"
                    value={data.value[ID] ?? field.value}
                    onChange={_ => updateNode(id, setVal(data.value, ID, _.target.value))}
                    placeholder={field.name}
                    className="w-full p-1 border mx-2"
                    id={ID}
                />

                {field?.target && <Handle
                    type="target"
                    position="left"
                    id={ID}
                    style={{ background: Color.list, width: 15, height: 15 }}
                />}

            </div>
        })} */}

        {/* OUTPUTS */}
        {Func.Outputs.map((field, idx) => {
            let ID = idx // offset
            return <div className="relative flex flex-col mt-2 relative " key={ID}>
                <div className="text-right mx-4">
                    <label for={ID}>{field.name}</label>
                    <p className="text-xs">{field?.OutputRule}</p>
                </div>
                <Handle
                    type="source"
                    position={Position.Right}
                    id={`${ID}`}
                    style={{ background: Color.list, width: 15, height: 15, }}
                    reconnectable="target"
                />

            </div>
        })}

        <div className="relative flex flex-col mt-6 relative mx-4">
            <label className="text-gray-500 -top-4 text-xs  absolute">Number of candles</label>
            <input
                type="text"
                value={data.value[2]}
                onChange={_ => updateNode(id, setVal(data.value, 2, _.target.value))}
                placeholder={"50"}
                className="w-full bg-gray-100 p-2 rounded-md outline-none focus:border-gray-400 mt-2"
            />
        </div>



        {Func.Outputs.length == 0 && <Handle
            type="source"
            position={Position.Right}
            id={'0'}
            style={{ background: Color.list, width: 15, height: 15, }}
            reconnectable="target"
        />}



        {/* {Func && <div className="mx-4 text-[9px] text-gray-600" >
             <p>{Func?.Example.Explanation}</p>
            <p className="mt-1">Input : {data?.func?.Example.Code}</p>
            <p>Output : {data?.func?.Example.Result}</p> 
        </div>
        } */}


        {/* purposes */}
        <p className="text-xs opacity-70 m-4 my-2 w-fit">{data.purposes}</p>


    </div>
})


export default CandlesNode