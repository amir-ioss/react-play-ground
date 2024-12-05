import { memo, useEffect } from 'react';
import {
    Handle,
    Position,
    useEdges,
    useHandleConnections,
    useNodesData,
} from '@xyflow/react';
import useNodeValue from './useNodeValue'


const OPTIONS = [
    { value: null, name: "SELECT" },
    { value: ">", name: "crossover" },
    { value: "<", name: "crossdown" },
    { value: ">", name: "> Greater Than" },
    { value: "<", name: "< Less Than" },
    { value: ">=", name: ">= Greater Than or Equal To" },
    { value: "<=", name: "<= Less Than or Equal To" },
    { value: "==", name: "== Equal" },
    { value: "!=", name: "!= Not Equal" }]

const ConditionNode = memo(({ data, id, updateNode }) => {
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    // Handler for input changes
    const onInputChange = (event) => {
        updateNode(id, setVal(data.value, 2, event.target.value));
    };

    useEffect(() => {
        const val1 = getVal(0) ?? null;
        const val2 = getVal(1) ?? null;

        if (data.value[0] !== val1) {
            updateNode(id, setVal(data.value, 0, val1));
        }

        if (data.value[1] !== val2) {
            updateNode(id, setVal(data.value, 1, val2));
        }
    }, [edges])


    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">
        <label className="px-4">{data.label}</label>

        <select
            type="text"
            value={data.value[2] || ''}
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
                id={"0"} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            <p className='text-xs'>0</p>
            <p className="px-4">{getVal(0) ?? 'Value 1'}</p>
        </div>


        <div className="relative  items-center m-2">
            <Handle
                type="target"
                position={Position.Left}
                // id={'target-2-' + id} // Another unique id
                id={'1'} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            <p className='text-xs'>1</p>
            <p className="px-4">{getVal(1) ?? 'Value 2'}</p>
        </div>




        {/* OUTPUT */}
        <Handle
            type="source"
            position={Position.Right}
            id={'0'} // Another unique id
            style={{ background: 'violet', width: 15, height: 15 }}
        />



    </div>
})


export default ConditionNode