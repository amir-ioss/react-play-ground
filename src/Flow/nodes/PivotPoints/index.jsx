import { memo, useEffect, useState } from "react";
import { Handle, MarkerType, Position, useEdges, useNodesData } from "@xyflow/react";
import useNodeValue from "../useNodeValue";
import Functions from './functions.json'

// Object.values(Functions).map(_=> console.log(_.Outputs))

const PivotPoints = memo(({ data, id, updateNode }) => {
    const [state, setState] = useState({ pickerOn: true, option: null, type: 'Overlap Studies' })
    // 0 = Indicator 
    // Inputs 
    // Parameters 
    // Outputs 
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);

    const onPickIndicator = (option) => {
        const func = Functions[option]
        const Name = func?.Name
        const inputs = func?.Inputs.map(_ => _.value)
        const params = func?.Parameters.map(_ => _.value)

        const rest = [option, ...inputs, ...params]

        let returns = func?.Outputs.map(_ => _.value)
        // console.log("----------------", returns.length);

        if (returns.length == 1) returns = []
        updateNode(id, { label: Name, value: rest, returns, func: func });

        setState({ ...state, pickerOn: false })
    };


    useEffect(() => {
        const updatedValues = [...data.value];  // Clone the array to avoid direct mutation

        // Dynamically iterate over the indices you want to update (e.g., 1, 2, etc.)
        let valuesChanged = false; // Flag to track if any change occurred

        if (data?.func) {
            for (let i = 1; i <= data?.func.Inputs.length; i++) {
                const val = getVal(i) ?? null;
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


    return <div className="bg-gray-200 border border-indigo-600  border-black flex flex-col justify-center pb-4">
        <div className="bg-gradient-to-r  from-indigo-600 to-indigo-400 p-2 text-white px-4">
            <h3 className="text-2xl">{data.name}</h3>
            {/* <p className="text-xs opacity-70">{data.purposes}</p> */}
        </div>



        {/* Picker Button */}
        <button onClick={() => setState({ ...state, pickerOn: true })}
            className="bg-white mx-4 p-2 mt-4 font-semibold text-lg text-left"
        >{data?.func?.Name ?? "Pick Indicator"}</button>

        {/* <select
            type="text"
            value={data.value?.[0] ?? ''}
            onChange={e => onChangeIndicator(e)}
            placeholder="Indicator"
            className={'bg-white border p-2 m-2 rounded-xl'}
        >
            {Object.keys(Functions)?.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                    {option}
                </option>
            ))}
        </select> */}

        <div className="mx-4 my-2">
            <p className="text-xl">{data?.func?.Description}</p>
            <p className="text-xs">{data?.func?.Type}</p>
        </div>

        {/* INPUTS*/}
        {data?.func && [...data?.func.Inputs, ...data?.func.Parameters]?.map((field, idx) => {
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



        <Modal isOpen={state?.pickerOn}
            onClose={() => setState({ ...state, pickerOn: false })}
            title="Functions"
            className=" bg-white xl:w-1/2 cursor-pointer py-0 rounded-lg p-4 md:p-0"
        >
            <div>
                <input className="w-full border p-4 outline-none" placeholder="Search" onChange={(e) => {
                    setState((prev) => ({ ...prev, search: e.target.value }))
                }} />
            </div>
            <div className="flex h-96 ">
                <div className="w-fit  border-r">
                    {[{ "name": "Math Operators" }, { "name": "Math Transform" }, { "name": "Pattern Recognition" }, { "name": "Momentum Functions" }, { "name": "Overlap Studies" }, { "name": "Statistic Functions" }, { "name": "Volatility Functions" }, { "name": "Volume Functions" }, { "name": "Price Transform" }]?.map((ind_type, idx) => {
                        return <div key={idx} className="py-2 px-10 hover:bg-slate-50"
                            onClick={() => setState({ ...state, type: ind_type.name })}
                        >
                            <p className={state.type == ind_type.name ? `text-blue-600` : ''}>{ind_type.name}</p>
                        </div>
                    }
                    )}
                </div>
                <div className="bg-white flex-1 h-full overflow-y-scroll">
                    {Object.entries(Functions)?.map((item, optIndex) => {
                        var ind = Functions[item[0]]
                        var content = [ind.Name, ind.Description, ind.Type].join().toLocaleLowerCase() + [ind.Name, ind.Description, ind.Type].join()
                        if (ind.Type !== state.type && !state?.search) return
                        if (state?.search && !content.includes(state?.search)) return
                        return <div key={optIndex} className="border-b p-2 px-10 hover:bg-slate-50"
                            onClick={() => onPickIndicator(item[0])}
                        >
                            <p className="font-semibold">{ind.Name} <span className="text-xs font-thin text-slate-400">{ind.Type}</span></p>
                            <p>{ind.Description}</p>

                        </div>
                    }
                    )}
                </div>
            </div>
        </Modal>

        {/* purposes */}
        <p className="text-xs opacity-70 m-4 my-2 max-w-64">{data.purposes}</p>


    </div>
})


export { PivotPoints }