import { memo, useEffect, useState } from 'react';
import {
    Handle,
    MarkerType,
    Position,
    useEdges,
    useHandleConnections,
    useNodesData,
} from '@xyflow/react';
import useNodeValue from './useNodeValue';


const CoinNode = memo(({ data, id, updateNode }) => {
    const { setVal, edges, nodesData, getVal } = useNodeValue(id);
    
    useEffect(() => {
        // updateNode(id, getVal(1))
    }, [])

    return <div  className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">
        <div className="mx-4">Trade</div>
        {/* INPUT*/}
        <div className="relative flex mt-2">
            <label for={'0'} className="mx-2"> BUY</label>
            <Handle
                type="target"
                position={Position.Left}
                id={6} // Another unique id
                style={{ background: 'gray', width: 15, height: 15 }}
                reconnectable="target"
                markerEnd={{
                    type: MarkerType.Arrow,
                }}
            />
        </div>



    </div>
})


export default CoinNode