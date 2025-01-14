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
    { value: ">", name: "crossover" },
    { value: "<", name: "crossdown" },
    { value: ">", name: "Greater Than" },
    { value: "<", name: "Less Than" },
    { value: ">=", name: "Greater Than or Equal To" },
    { value: "<=", name: "Less Than or Equal To" },
    { value: "==", name: "Equal" },
    { value: "!=", name: "Not Equal" }]

const ConditionNode = memo(({ data, id, updateNode }) => {
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    // Handler for input changes
    const onSelect = (event) => {
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




    return <div className="bg-white border border-orange-600  border-black flex flex-col justify-center pb-4 w-64 rounded-sm">
        <div className="bg-gradient-to-r  from-orange-600 to-orange-400 p-2 text-white px-4">
            <h3 className="text-2xl">{data.name}</h3>
            {/* <p className="text-xs opacity-70">{data.purposes}</p> */}
        </div>



        <div className="relative flex flex-col relative  my-2 mx-4" >
            <select
                type="text"
                value={data.value[2] || ''}
                onChange={onSelect}
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

        {/* VAL 1 */}
        <div className="relative flex flex-col mt-6 relative " >
            <label className="text-gray-500 -top-4 text-xs mx-4 absolute">Value 1</label>
            <div className="mx-4 flex-1 ">
                <input
                    type="text"
                    value={getVal(0)}
                    onChange={_ => updateNode(id, setVal(data.value, 0, _.target.value))}
                    placeholder={"Value 1"}
                    className={`w-full bg-gray-100 p-2 rounded-md outline-none focus:border-gray-400 mt-2`}
                />
                <Handle
                    type="target"
                    position={Position.Left}
                    id={"0"} // Another unique id
                    style={{ background: Color.list, width: 15, height: 15 }}
                />

            </div>
        </div>


        {/* VAL 2 */}
        <div className="relative flex flex-col mt-6 relative " >
            <label className="text-gray-500 -top-4 text-xs mx-4 absolute">Value 2</label>
            <div className="mx-4 flex-1 ">
                <input
                    type="text"
                    value={getVal(1)}
                    onChange={_ => updateNode(id, setVal(data.value, 0, _.target.value))}
                    placeholder={"Value 2"}
                    className={`w-full bg-gray-100 p-2 rounded-md outline-none focus:border-gray-400 mt-2`}
                />
                <Handle
                    type="target"
                    position={Position.Left}
                    id={"1"} // Another unique id
                    style={{ background: Color.list, width: 15, height: 15 }}
                />

            </div>
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


export default ConditionNode