import { Handle, Position } from "@xyflow/react";
import useNodeValue from "../useNodeValue";
import { useEffect } from "react";

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

        const val1 = getVal(0, 1) ?? null;
        const val2 = getVal(1, 1) ?? null;

        if (data.value[0] !== val1) {
            updateNode(id, { value: setVal(data.value, 0, val1) });
        }

        if (data.value[1] !== val2) {
            updateNode(id, { value: setVal(data.value, 1, val2) });
        }
    }, [edges])



    return <div style={{ padding: '10px', border: '1px solid black', borderRadius: '5px', width: '200px', backgroundColor: '#eeeeee' }}>
        <div>{data.label}</div>

        <select
            type="text"
            value={data.value || ''}
            onChange={onSelect}
            placeholder="Enter value"
            className={'w-full bg-white'}

        >
            {[{ name: '+', value: '+' }, { name: '-', value: '-' }, { name: '*', value: '*' }, { name: '/', value: '/' }, { name: '%', value: '%' }]?.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.name}
                </option>
            ))}


        </select>


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
                id={"1"} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            <p className='text-xs'>1</p>
            <p className="px-4">{getVal(1) ?? 'Value 2'}</p>
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