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
    const [state, setState] = useState({ type: 'MAX', source: 'close', 'period': 5 })

    useEffect(() => {
        // updateNode(id, `talib.${state.indicator}(close, fastperiod=12, slowperiod=26, signalperiod=9)[0]`);
        const params = Object.values(state).slice(1).join(',')

        updateNode(id, `talib.${state.type}(${params})`)
        console.log(state);

        console.log(data);


    }, [state])



    // SOURCES 
    const edges = useEdges().filter(_ => _.target == id)
    const nodesData = useNodesData(
        edges.map((connection) => connection.source),
    );
    // let inputes = {}
    // nodesData.forEach(_ => {
    //     edges.forEach(e => {
    //         if (e.source == _.id) {
    //             Object.assign(inputes, { [e.targetHandle]: _.data.value })
    //         }
    //     })
    // })



    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">


        <div className="mx-4">highest</div>

        <select
            type="text"
            value={state?.indicator}
            onChange={e => {
                setState({ type: 'MAX', 'period': e.target.value })
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



        <label className="px-4">{data.label}</label>
        <div className="relative flex mt-2">
            <label for={'input-' + id} className="mx-2">Period</label>
            <input
                type="text"
                value={state.value}
                onChange={_ => setState(prev => ({ ...prev, 'period': _.target.value }))}
                placeholder="Number"
                className="flex-1 p-1 border mx-2 rounded-xl"
                id={'input-' + id}
            />

            <Handle
                type="source"
                position="left"
                id={'source-' + id} // Another unique id
                style={{ background: 'green', width: 15, height: 15 }}
            // className="size-12 border border-black"
            />

        </div>

        {/* INPUT*/}

        {/* <div className="relative  items-center m-2">
            <Handle
                type="target"
                position={Position.Left}
                id={'target-' + id} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            <p className='text-xs'>{'target-' + id}</p>
            <p className="px-4">{inputes['target-' + id] ?? 'Value 1'}</p>
        </div>


        <div className="relative  items-center m-2">
            <Handle
                type="target"
                position={Position.Left}
                id={'target-2-' + id} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            <p className='text-xs'>{'target-2-' + id}</p>
            <p className="px-4">{inputes['target-2-' + id] ?? 'Value 2'}</p>
        </div> */}




        {/* OUTPUT */}

        <Handle
            type="source"
            position={Position.Right}
            id={'hh_ll_' + id} // Another unique id
            style={{ background: 'orange', width: 15, height: 15 }}
            reconnectable="target"
            markerEnd={{
                type: MarkerType.Arrow,
            }}
            label='default arrow'

        // className="size-12 border border-black"
        />



    </div>
})


export { HHLLNode }