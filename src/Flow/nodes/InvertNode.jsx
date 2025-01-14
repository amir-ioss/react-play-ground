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



const InvertNode = memo(({ data, id, updateNode }) => {
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




  return <div className={`bg-white border border-slate-300 border-[${Color.INVERT_NODE}] flex flex-col justify-center pb-4 rounded-sm max-w-52`}>
    <div className={`bg-gradient-to-r from-[${Color.INVERT_NODE}] to-slate-300 p-1 text-white px-4`}>
      <h3 className="text-2xl">{data.name}</h3>
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

      {/* OUTPUT */}
      <Handle
        type="source"
        position={Position.Right}
        id={'0'} // Another unique id
        style={{ background: Color.bool, width: 15, height: 15 }}
      />



    </div>



    {/* purposes */}
    <p className="text-xs opacity-70 mx-4">{data.purposes}</p>
  </div>
})


export default InvertNode