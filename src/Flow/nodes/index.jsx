import { memo } from 'react';
import {
    Handle,
    Position,
    useEdges,
    useHandleConnections,
    useNodesData,
} from '@xyflow/react';
import { ValueNode, MathNode } from './Math'
import { IndicatorNode } from './Indicators'
import { HHLLNode } from './hhll'

const CustomNode = ({ data, id, updateNode }) => {
    // Handler for input changes
    const onInputChange = (event) => {
        updateNode(id, event.target.value);
    };

    return (
        <div style={{ padding: '10px', border: '1px solid black', borderRadius: '5px', width: '200px', backgroundColor: '#eeeeee' }}>
            <div>{data.label}</div>
            <input
                type="text"
                value={data.value || ''}
                onSelect={onInputChange}
                placeholder="Enter value"
                style={{ width: '100%' }}
                id={'input-' + id}
            />
            {/* Input Handles */}
            {/* <Handle
                type="target"
                position="top"
                id="input-1" // Unique id for this handle
                style={{ background: 'blue' }}
            /> */}
            <Handle
                type="target"
                position="left"
                id={'target-' + id} // Another unique id
                style={{ background: 'orange' }}
            />

            {/* Output Handles */}
            {/* <Handle
                type="source"
                position="bottom"
                id="output-1" // Unique id for the output handle
                style={{ background: 'red' }}
            /> */}
            <Handle
                type="source"
                position="right"
                id={'source-' + id} // Another unique id
                style={{ background: 'green' }}
            />

        </div>
    );
};



const OPTIONS = [
    {value : null,	name : "SELECT"},
    {value : "<",	name : "< Less Than"},
    {value : "<=",	name : "<= Less Than or Equal To"},
    {value : "!=",	name : "!= Not Equal"},
    {value : "==",	name : "== Equal"},
    {value : ">",	name : "> Greater Than"},
    {value : ">=",	name : ">= Greater Than or Equal To"}]

const ConditionNode = memo(({ data, id, updateNode }) => {





    // Handler for input changes
    const onInputChange = (event) => {
        updateNode(id, event.target.value);

    };

    // SOURCES 
    const edges = useEdges().filter(_ => _.target == id)
    const nodesData = useNodesData(
        edges.map((connection) => connection.source),
    );
    let inputes = {}
    nodesData.forEach(_ => {
        edges.forEach(e => {
            if (e.source == _.id) {
                Object.assign(inputes, { [e.targetHandle]: _.data.value })
            }
        })
    })



    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">
        <label className="px-4">{data.label}</label>

        <select
            type="text"
            value={data.value || ''}
            onChange={onInputChange}
            placeholder="Enter value"
            className="bg-white p-2 mx-2 rounded-xl"
        >
            {OPTIONS?.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.name}
                </option>
            ))}

        </select>

        {/* INPUT*/}

        <div className="relative  items-center m-2">
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
        </div>




        {/* OUTPUT */}
        <Handle
            type="source"
            position={Position.Right}
            id={'source-' + id} // Another unique id
            style={{ background: 'green', width: 15, height: 15 }}
        />



    </div>
})


export { ConditionNode, CustomNode, ValueNode, MathNode, IndicatorNode, HHLLNode }