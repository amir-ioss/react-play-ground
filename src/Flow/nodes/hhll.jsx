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



const HHLLNode = memo(({ data, id, updateNode }) => {
    const [state, setState] = useState({ fun: 'MAX', source: 'close', 'period': 5 })

    // SOURCES 
    const edges = useEdges().filter(_ => _.target == id)
    const nodesData = useNodesData(
        edges.map((connection) => connection.source),
    );

    useEffect(() => {
        const params = Object.values(state).slice(1).join(',')
        updateNode(id, `talib.${state.fun}(${params})`)
    }, [state])


    let inputes = {}
    nodesData.forEach(_ => {
        edges.forEach(e => {
            if (e.source == _.id) {
                Object.assign(inputes, { [e.targetHandle]: _.data.value })
            }
        })
    })

    useEffect(() => {
        const newPeriod = inputes['period-' + id];
        if (newPeriod && newPeriod !== state.period) {
            setState(prevState => ({ ...prevState, period: newPeriod }));
        }
    }, [inputes, id]);


    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">

        <div className="mx-4">high/low</div>
        <select
            type="text"
            value={state?.indicator}
            onChange={e => {
                setState({ 'fun': e.target.value, ...state })
            }}
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

        <div className="relative flex mt-2">
            <label for={'period-' + id} className="mx-2">Period</label>
            <input
                type="text"
                value={inputes?.['period-' + id] || state.value}
                onChange={_ => setState(prev => ({ ...prev, 'period': _.target.value }))}
                placeholder="Number"
                className="flex-1 p-1 border mx-2 rounded-xl"
                id={'period-' + id}
            />
            <Handle
                type="target"
                position={Position.Left}
                id={'period-' + id} // Another unique id
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


export { HHLLNode }