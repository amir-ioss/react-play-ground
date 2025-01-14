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



const PastValue = memo(({ data, id, updateNode }) => {
  const { setVal, edges, nodesData, getVal } = useNodeValue(id);





  useEffect(() => {
    const val1 = getVal(0) ?? null;
    // const val2 = getVal(1) ?? null;

    if (data.value[0] !== val1) {
      updateNode(id, { value: setVal(data.value, 0, val1) });
    }

    // if (data.value[1] !== val2) {
    //     updateNode(id, { value: setVal(data.value, 1, val2) });
    // }
  }, [edges])




  return <div className={`bg-white border border-[${Color.PAST_NODE}] border-black flex flex-col justify-center pb-4 rounded-sm max-w-52`}>
    <div className={`bg-gradient-to-r from-[${Color.PAST_NODE}] to-pink-400 p-2 text-white px-4`}>
      <h3 className="text-2xl">{data.name}</h3>
    </div>



    <div className="relative flex flex-col mt-6 relative ">
      <label className="text-gray-500 -top-4 text-xs mx-4 absolute">{getVal(0) ?? "Data"}</label>
      {/* INPUT*/}

      <div className="mx-4 flex-1 ">
        <input
          type="text"
          value={data.value['1']}
          onChange={_ => updateNode(id, setVal(data.value, 1, _.target.value))}
          placeholder={"index"}
          className={`w-full bg-gray-100 p-2 rounded-md outline-none focus:border-gray-400`}
          id={'1'}
        />
        <Handle
          type="target"
          position={Position.Left}
          id={"0"} // Another unique id
          style={{ background: Color.list, width: 15, height: 15 }}
        />

        {/* OUTPUT */}
        <Handle
          type="source"
          position={Position.Right}
          id={'0'} // Another unique id
          style={{ background: Color.list, width: 15, height: 15 }}
        />


      </div>
    </div>



    {/* purposes */}
    <p className="text-xs opacity-70 m-4 my-2">{data.purposes}</p>
  </div>
})


export default PastValue