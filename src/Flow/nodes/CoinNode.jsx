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
    { value: "1m", name: "1 Minute" },
    { value: "3m", name: "3 Minutes" },
    { value: "5m", name: "5 Minutes" },
    { value: "10m", name: "10 Minutes" },
    { value: "15m", name: "15 Minutes" },
    { value: "30m", name: "30 Minutes" },
    { value: "1h", name: "1 Hour" },
    { value: "2h", name: "2 Hours" },
    { value: "4h", name: "4 Hours" },
    { value: "6h", name: "6 Hours" },
    { value: "8h", name: "8 Hours" },
    { value: "12h", name: "12 Hours" },
    { value: "1d", name: "1 Day" },
    { value: "3d", name: "3 Days" },
    { value: "1w", name: "1 Week" },
    { value: "1M", name: "1 Month" }
]



const fields = [
    {
        name: "time",
        type: "text",
        value: 'time',
        placeholder: "Time",
    },
    {
        name: "open",
        type: "number",
        value: 'open',
        placeholder: "Open",
    },
    {
        name: "high",
        type: "number",
        value: 'high',
        placeholder: "High",
    },
    {
        name: "low",
        type: "number",
        value: 'low',
        placeholder: "Low",
    },
    {
        name: "close",
        type: "number",
        value: 'close',
        placeholder: "Close",
    },
    {
        name: "volume",
        type: "number",
        value: 'volume',
        placeholder: "Volume",
    }
]


const CoinNode = memo(({ data, id, updateNode }) => {
    // Inputs = 7
    const PeriodID = 6
    const TimeFrameID = 7
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);


    // Handler for input changes    
    const onInputChange = (event) => {
        if (data.value[TimeFrameID] !== event.target.value) {
            updateNode(id, { value: setVal(data.value, TimeFrameID, event.target.value) });
        }
    };


    useEffect(() => {
        // PeriodID
        const period = (getVal(PeriodID) || data.value[PeriodID]) ?? null;
        if (data.value[PeriodID] !== period) {
            updateNode(id, { value: setVal(data.value, PeriodID, period) });
        }
    }, [edges])


    // Initial values
    useEffect(() => {
        const params = fields.map(_ => _.value) || [];
        const rest = [...params, data.value[PeriodID], data.value[TimeFrameID]]
        updateNode(id, { value: rest });
    }, [])



    return <div className="bg-gray-200 min-w-64 border border-amber-600  border-black flex flex-col justify-center pb-4">
        <div className="bg-gradient-to-r  from-amber-600 to-amber-400 p-2 text-white px-4">
            <h3 className="text-2xl">{data.name}</h3>
            <p className="text-xs opacity-70">{data.purposes}</p>
        </div>

        <label for={TimeFrameID} className="w-full mx-4 mt-4">Time Frame</label>
        <select
            type="text"
            value={getVal(7)}
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



        {/* OUTPUT T-OHLCV */}
        {fields?.map((field, idx) => {
            return <div className="relative flex mt-2">
                <label for={idx} className="mx-4 w-full text-right">{field.placeholder}  </label>
                {/* <input key={idx}
                    type="text"
                    value={state[field.name]}
                    onChange={_ => setState(prev => ({ ...prev, [field.name]: _.target.value }))}
                    placeholder={field.type}
                    className="flex-1 p-1 border mx-2 rounded-xl"
                    id={'input-' + field.name + idx}
                /> */}

                <Handle
                    type="source"
                    position={Position.Right}
                    id={`${idx}`} // Another unique id
                    style={{ background: 'gray', width: 15, height: 15 }}
                    reconnectable="target"
                    markerEnd={{
                        type: MarkerType.Arrow,
                    }}

                />

            </div>
        })}


        {/* INPUT*/}
        <div className="relative flex mt-2 items-center">
            <label for={'0'} className="mx-4">Candle Limit</label>
            <input
                type="text"
                value={getVal(PeriodID) || data.value?.[PeriodID]}
                onChange={_ => {
                    let newData = setVal(data.value, PeriodID, _.target.value)
                    updateNode(id, newData)
                }}
                placeholder="Number"
                className="flex-1 p-1 border mx-2 rounded-xl"
                id={PeriodID}
            />
            <Handle
                type="target"
                position={Position.Left}
                id={PeriodID} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
                reconnectable="target"
                markerEnd={{
                    type: MarkerType.Arrow,
                }}
            />
        </div>


        {/* OUTPUT */}
        {/* <div className="relative  items-center">
            <Handle
                type="source"
                position={Position.Right}
                id={'0'} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
                label='default arrow'
            />
        </div> */}



    </div>
})


export default CoinNode