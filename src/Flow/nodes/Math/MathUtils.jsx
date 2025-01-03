import { memo, useEffect, useState } from "react";
import { Handle, MarkerType, Position, useEdges, useNodesData } from "@xyflow/react";
import useNodeValue from "../useNodeValue";
// import Funcs from './utils.json'
import Utils from './np_all.json'
import Modal from '../../components/Modal'

// Object.values(Funcs).map(_=> console.log(_.Outputs))

const Funcs = Utils.Array_Creation

const MathNode = memo(({ data, id, updateNode }) => {
    const [state, setState] = useState({ pickerOn: true, option: null, type: 'Overlap Studies' })
    // 0 = Indicator 
    // Inputs 
    // Parameters 
    // Outputs 
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    const onPickIndicator = (option) => {
        const func = Funcs[option]

        const Name = func?.Name
        // const inputs = func?.Inputs.map(_ => 0)
        const inputs = func?.Inputs.map(_ => null)
        // const params = func?.Parameters.map(_ => _.value)

        const rest = [option, ...inputs]

        let returns = func?.Outputs.map(_ => _.value)

        if (returns.length == 1) returns = []
        updateNode(id, { label: Name, value: rest, returns, func: func });
    };


    useEffect(() => {
        const updatedValues = [...data.value];  // Clone the array to avoid direct mutation

        // Dynamically iterate over the indices you want to update (e.g., 1, 2, etc.)
        let valuesChanged = false; // Flag to track if any change occurred

        if (data?.func) {
            for (let i = 1; i <= data?.func.Inputs.length; i++) {
                const val = getVal(i) ?? data.value[i] ?? null;
                // Only update if the value has changed
                if (updatedValues[i] !== val) {
                    updatedValues[i] = val;
                    valuesChanged = true;  // Mark that a value has changed
                }
            }
        }

        // Only call updateNode if a value was actually changed
        if (valuesChanged) {
            updateNode(id, { value: updatedValues });
        }
    }, [edges, data.value]);  // Ensure `data.value` and `edges` are dependencies


    return <div className="bg-gray-200 border border-red-600  border-black flex flex-col justify-center pb-4 w-64">
        <div className="bg-gradient-to-r  from-red-600 to-red-400 p-2 text-white px-4">
            <h3 className="text-2xl">{data.name}</h3>
            {/* <p className="text-xs opacity-70">{data.purposes}</p> */}
        </div>

        <select
            type="text"
            value={data.value?.[0] ?? ''}
            onChange={e => onPickIndicator(e.target.value)}
            placeholder="Indicator"
            className={'bg-white border p-2 m-2 rounded-xl'}
        >
            {Object.entries(Funcs)?.map((fun, optIndex) => {
                return <option key={optIndex} value={fun[0]}>
                    {fun[1]['Name']}
                </option>
            })}
        </select>

        <div className="mx-4 my-2">
            <p className="text-sm">{data?.func?.Description}</p>
            <p className="text-xs">{data?.func?.Type}</p>
        </div>


        {/* INPUTS*/}
        {data?.func && data?.func.Inputs?.map((field, idx) => {
            const ID = idx + 1 // offset
            return <div className="relative flex mt-2" key={ID}>
                <label for={ID} className="mx-2">{field.placeholder}  </label>
                <input
                    type="text"
                    value={data.value[ID] ?? field.value}
                    onChange={_ => updateNode(id, setVal(data.value, ID, _.target.value))}
                    placeholder={field.name}
                    className="w-full p-1 border mx-2"
                    id={ID}
                />

                {field?.target && <Handle
                    type="target"
                    position="left"
                    id={ID}
                    style={{ background: 'gray', width: 15, height: 15 }}
                />}

            </div>
        })}

        {/* OUTPUTS */}
        {data?.func && data.func.Outputs.map((field, idx) => {
            let ID = idx // offset
            return <div className="relative flex mt-2 justify-end" key={ID}>
                <div className="text-right mx-4">
                    <label for={ID}>{field.name}</label>
                    <p className="text-xs">{field?.OutputRule}</p>
                </div>
                <Handle
                    type="source"
                    position={Position.Right}
                    id={`${ID}`}
                    style={{ background: 'green', width: 15, height: 15, }}
                    reconnectable="target"
                />

            </div>
        })}

        {data?.func && data.func.Outputs.length == 0 && <Handle
            type="source"
            position={Position.Right}
            id={'0'}
            style={{ background: 'green', width: 15, height: 15, }}
            reconnectable="target"
        />}



        {data?.func && <div className="mx-4 text-[9px] text-gray-600" >
            <p>{data?.func?.Example.Explanation}</p>
            <p className="mt-1">Input : {data?.func?.Example.Code}</p>
            <p>Output : {data?.func?.Example.Result}</p>

        </div>
        }


        {/* purposes */}
        <p className="text-xs opacity-70 m-4 my-2 w-fit">{data.purposes}</p>


    </div>
})


export default MathNode