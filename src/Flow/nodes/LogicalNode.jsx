import { memo, useEffect } from 'react';
import {
    Handle,
    Position,
    useEdges,
    useHandleConnections,
    useNodesData,
} from '@xyflow/react';
import useNodeValue from './useNodeValue'
import { Color } from '../utils/colors';


const OPTIONS = [
    { value: null, name: "SELECT" },
    { value: "np.logical_and", name: "AND" },
    { value: "np.logical_or", name: "OR" },
    { value: "np.logical_xor", name: "XOR" }]

const LogicalNode = memo(({ data, id, updateNode }) => {
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    // Handler for input changes
    const onInputChange = (event) => {
        updateNode(id, { value: setVal(data.value, 2, event.target.value) });
    };

    useEffect(() => {
        const val1 = getVal(0) ?? null;
        const val2 = getVal(1) ?? null;

        if (data.value[0] !== val1) {
            updateNode(id, { value: setVal(data.value, 0, val1) });
        }

        if (data.value[1] !== val2) {
            updateNode(id, { value: setVal(data.value, 1, val2) });
        }
    }, [edges])


    return <div className={`bg-white border border-[${Color.LOGIC}] border-black flex flex-col justify-center pb-4 rounded-sm max-w-56 rounded-sm`}>
        <div className={`bg-gradient-to-r from-[${Color.LOGIC}] to-purple-400 p-2 text-white px-4`}>
            <h3 className="text-2xl">{data.name}</h3>
        </div>


        <div className="relative flex flex-col relative  my-2 mx-4" >
            <select
                type="text"
                value={data.value[2] || ''}
                onChange={onInputChange}
                placeholder="Enter value"
                className={`bg-gray-100 p-2 rounded-md outline-none focus:border-gray-400 mt-2 font-semibold`}
            >
                {OPTIONS?.map((option, optIndex) => (
                    <option key={optIndex} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>



        {/* INPUT*/}

        <div className="relative  items-center my-2">
            <Handle
                type="target"
                position={Position.Left}
                id={"0"} // Another unique id
                style={{ background: Color.bool, width: 15, height: 15 }}
            />
            <p className="px-4">{getVal(0) ?? 'Value 1'}</p>
        </div>


        <div className="relative  items-center my-2">
            <Handle
                type="target"
                position={Position.Left}
                // id={'target-2-' + id} // Another unique id
                id={'1'} // Another unique id
                style={{ background: Color.bool, width: 15, height: 15 }}
            />
            <p className="px-4">{getVal(1) ?? 'Value 2'}</p>
        </div>




        {/* OUTPUT */}
        <Handle
            type="source"
            position={Position.Right}
            id={'0'} // Another unique id
            style={{ background: Color.bool, width: 15, height: 15 }}
        />


        {/* purposes */}
        <p className="text-xs opacity-70 m-4 my-2">{data.purposes}</p>
    </div>
})


export default LogicalNode