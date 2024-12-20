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
        <div style={{ padding: '10px', border: '1px solid black', borderRadius: '5px', width: '200px', backgroundColor: '#eeeeee' }}>
            <div>{data.label}</div>
            <input
                type="number"
                // value={data.value[0]}
                onChange={onInputChange}
                placeholder="Number"
                style={{ width: '100%' }}
                id={'0'}
            />
            {/* Input Handles */}
            <Handle
                type="source"
                position="right"
                id={'0'} // Another unique id
                style={{ background: 'gray', width: 15, height: 15, 'marginTop': 10 }}

            />
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



    return <div className="bg-gray-200 min-w-48 border rounded-xl py-2 border-black flex flex-col justify-center">
        <div className="mx-2">{data.label}</div>

        <select
            type="text"
            value={data.value[2] || ''}
            onChange={onSelect}
            placeholder="Enter value"
            className={'bg-white border p-2 mx-2 rounded-xl'}
        >

            {FIELDS?.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.name}
                </option>
            ))}


        </select>


        <div className="relative  items-center">

            <input
                // type="number"
                value={getVal(0)}
                onChange={() => null}
                placeholder="Number"
                className="w-48 p-1 border m-2 rounded-xl"
            />

            <Handle
                type="target"
                position={Position.Left}
                id={"0"} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            {/* <p className='text-xs'>0</p> */}

        </div>


        <div className="relative  items-center">
            <input
                // type="number"
                value={getVal(1)}
                onChange={() => null}
                placeholder="Number"
                className="w-48 p-1 border m-2 rounded-xl"
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
            style={{ background: 'red', width: 15, height: 15 }}
        />



    </div>
}


export { ValueNode, MathNode }

