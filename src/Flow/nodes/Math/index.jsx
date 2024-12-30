import { Handle, Position } from "@xyflow/react";
import useNodeValue from "../useNodeValue";
import { useEffect } from "react";


const FIELDS = [{ name: 'Add', value: '+' }, { name: 'Subtract', value: '-' }, { name: 'Multiply', value: '*' },
{ name: 'Divide', value: '/' }, { name: 'Module', value: '%' }, { name: 'Exponent', value: '**' },
{ name: 'Floor divide', value: '//' }]

const ValueNode = ({ data, id, updateNode }) => {
    // Handler for input changes
    const onInputChange = (event) => {
        updateNode(id, { value: [event.target.value] });
    };

    return (
        <div className="bg-gray-200 min-w-64 border border-blue-600  border-black flex flex-col justify-center pb-2">
            <div className="bg-gradient-to-r  from-blue-600 to-blue-400 p-2 text-white px-4 mb-2">
                <h3 className="text-2xl">{data.name}</h3>
            </div>

            <div className="relative  ">
                <input
                    type="number"
                    // value={data.value[0]}
                    onChange={onInputChange}
                    placeholder="Number"
                    id={'0'}
                    className="px-2 p-1 mx-4 my-2 rounded-full w-fit"
                />
                {/* Input Handles */}
                <Handle
                    type="source"
                    position="right"
                    id={'0'} // Another unique id
                    style={{ background: 'orange', width: 15, height: 15, }}
                />
            </div>

        </div>
    );
};




const MathNode = ({ data, id, updateNode }) => {
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



    return <div className="bg-gray-200 min-w-64 border border-blue-600  border-black flex flex-col justify-center pb-4">
        <div className="bg-gradient-to-r  from-blue-600 to-blue-400 p-2 text-white px-4 mb-4">
            <h3 className="text-2xl">{data.name}</h3>
        </div>


        <select
            type="text"
            value={data.value[2] || ''}
            onChange={onSelect}
            placeholder="Enter value"
            className={'bg-white border p-2 mx-4 rounded-xl mb-4'}
        >

            {FIELDS?.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.name}
                </option>
            ))}


        </select>


        <div className="relative  ">

            <input
                // type="number"
                value={getVal(0)}
                onChange={() => null}
                placeholder="Number"
                className="px-2 p-1 mx-4 my-2 rounded-full w-fit"

            />

            <Handle
                type="target"
                position={Position.Left}
                id={"0"} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            {/* <p className='text-xs'>0</p> */}

        </div>


        <div className="relative">
            <input
                // type="number"
                value={getVal(1)}
                onChange={() => null}
                placeholder="Number"
                className="px-2 p-1 mx-4 my-2 rounded-full w-fit"
            />

            <Handle
                type="target"
                position={Position.Left}
                id={"1"} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
        </div>


        <Handle
            type="source"
            position="right"
            id={'0'} // Another unique id
            style={{ background: 'gray', width: 15, height: 15 }}
        />


        {/* purposes */}
        <p className="text-xs opacity-70 m-4 my-2 w-44">{data.purposes}</p>
    </div>
}


export { ValueNode, MathNode }

