import { Handle } from "reactflow";

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


const ConditionNode = ({ data, id, updateNode }) => {

    // Handler for input changes
    const onInputChange = (event) => {
        updateNode(id, event.target.value);
    };

    return <div style={{ padding: '10px', border: '1px solid black', borderRadius: '5px', width: '200px', backgroundColor: '#eeeeee' }}>
        <div>{data.label}</div>

        <select
            type="text"
            value={data.value || ''}
            onChange={onInputChange}
            placeholder="Enter value"
            className={'w-full bg-white'}

        >
            {[{ name: '>', value: '>' }, { name: '>=', value: '>=' }, { name: '==', value: '==' }, { name: '<', value: '<' }, { name: '<=', value: '<=' }]?.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.name}
                </option>
            ))}


        </select>

        <Handle
            type="target"
            position="left"
            id={'target-' + id} // Another unique id
            style={{ background: 'orange' }}

        />

        <Handle
            type="target"
            position="left"
            id={'target-2-' + id} // Another unique id
            style={{ background: 'orange', 'marginTop': 10 }}

        />


        <Handle
            type="source"
            position="right"
            id={'source-' + id} // Another unique id
            style={{ background: 'green' }}
        />



    </div>
}


export {ConditionNode, CustomNode}