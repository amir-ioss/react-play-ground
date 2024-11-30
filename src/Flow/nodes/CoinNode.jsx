import { memo, useEffect, useState } from 'react';
import {
    Handle,
    MarkerType,
    Position,
    useEdges,
    useHandleConnections,
    useNodesData,
} from '@xyflow/react';


const OPTIONS = [
    { value: null, name: "SELECT" },
    { value: "MAX", name: "highest high" },
    { value: "MIN", name: "lowest low" }]



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

    // SOURCES 
    const edges = useEdges().filter(_ => _.target == id)
    const nodesData = useNodesData(
        edges.map((connection) => connection.source),
    );


    useEffect(() => {
        updateNode(id, fields.map(_ => (_.value)))
    }, [])



    const getVal = (INPUT_ID = 1) => {
        const edge = edges.filter(e => e.targetHandle == INPUT_ID)?.[0]
        const val = nodesData.filter(e => e.id == edge?.source)?.[0]
        if (!val?.data) return
        return val.data.value[edge.sourceHandle]
    }

    function setVal(array, index, value) {
        if (index < 0) {
            throw new Error("Negative index not allowed");
        }
        array[index] = value; // Automatically fills gaps with `undefined` if needed
        return array;
    }



    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">

        <div className="mx-4">Coin Data</div>
        <select
            type="text"
            // value={state?.indicator}
            // onChange={e => {
            //     setState({ 'fun': e.target.value, ...state })
            // }}
            placeholder="Indicator"
            className={'bg-white border p-2 mx-2 rounded-xl'}

        >
            {OPTIONS.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>




        {fields?.map((field, idx) => {
            return <div className="relative flex mt-2">
                <label for={'input-' + idx} className="mx-4 w-full text-right">{field.placeholder}  </label>
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
        <label className="px-4">{data.label}</label>

        <div className="relative flex mt-2">
            <label for={'period-' + id} className="mx-2">Period</label>
            <input
                type="text"
                value={getVal(6) || data.value?.[6]}
                onChange={_ => updateNode(id, setVal(data.value, 6, _.target.value))}
                placeholder="Number"
                className="flex-1 p-1 border mx-2 rounded-xl"
                id={6}
            />
            <Handle
                type="target"
                position={Position.Left}
                id={6} // Another unique id
                style={{ background: 'gray', width: 15, height: 15 }}
                reconnectable="target"
                markerEnd={{
                    type: MarkerType.Arrow,
                }}
            />
        </div>


        {/* OUTPUT */}
        <div className="relative  items-center">
            <Handle
                type="source"
                position={Position.Right}
                id={'hh_ll_' + id} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
                label='default arrow'
            />
        </div>



    </div>
})


export default CoinNode