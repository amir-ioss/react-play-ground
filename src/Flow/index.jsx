import React, { useMemo, useState } from 'react';
import ReactFlow, { addEdge, Handle, Background, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import {ConditionNode, CustomNode} from './nodes'
import {queriesMaker}  from './queriesMaker';

const initialNodes = [
    {
        id: '1',
        type: 'customNode',
        data: { label: 'SMA', value: 'talib.SMA(close, 5)' },
        position: { x: 50, y: 50 },
    },
    {
        id: '2',
        type: 'customNode',
        data: { label: 'EMA', value: 'talib.EMA(close, 5)' },
        position: { x: 300, y: 50 },
    },
];

const initialEdges = [
    // { id: 'e1-2', source: '1', target: '2' },
    // { id: 'e2-3', source: '2', target: '3' },
];


function FlowExample() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const updateNodeValue = (nodeId, newValue) => {
        setNodes((nds) =>
            nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, value: newValue } } : node))
        );
    };

    const nodeTypes = useMemo(() => ({
        customNode: (props) => <CustomNode {...props} updateNode={updateNodeValue} />,
        ConditionNode: (props) => <ConditionNode {...props} updateNode={updateNodeValue} />,
    }), []);


    const onNodesChange = (changes) =>
        setNodes((nds) => applyNodeChanges(changes, nds));

    const onEdgesChange = (changes) =>
        setEdges((eds) => applyEdgeChanges(changes, eds));


    const onConnect = (params) => {
        console.log('Connecting:', params); // Logs handle ids like input-1, output-2
        setEdges((eds) => addEdge(params, eds));
    };


    // Add a new node dynamically
    const addNode = () => {
        const newNode = {
            id: `${nodes.length + 1}`, // Unique ID for the new node
            // type: 'default',
            type: 'ConditionNode',
            data: { label: `Node ${nodes.length + 1}` },
            position: {
                x: Math.random() * 500, // Random x position
                y: Math.random() * 500, // Random y position
            },
        };
        setNodes((nds) => [...nds, newNode]);
    };


    // Function to get the previous nodes and their values for a specific node
    const getPreviousNodes = (nodeId) => {
        const predecessors = edges
            .filter((edge) => edge.target === nodeId) // Find edges where this node is the target
            .map((edge) => edge.source); // Get source node IDs

        // Get the values of the predecessor nodes
        const previousNodeValues = predecessors.map((sourceId) => {
            const node = nodes.find((n) => n.id === sourceId);
            return { id: sourceId, label: node?.data.label, value: node?.data.value };
        });

        return previousNodeValues;
    };




    // Function to process the flow and generate ordered output
    const getExecutionOrder = () => {
        const graph = new Map();
        const indegree = new Map();

        // Initialize graph and indegree maps
        nodes.forEach((node) => {
            graph.set(node.id, []);
            indegree.set(node.id, 0);
        });

        // Populate graph and calculate indegrees
        edges.forEach(({ source, target }) => {
            graph.get(source).push(target);
            indegree.set(target, (indegree.get(target) || 0) + 1);
        });

        // Topological Sort (Kahn's Algorithm)
        const queue = [];
        const executionOrder = [];

        // Start with nodes that have no dependencies
        nodes.forEach((node) => {
            if (indegree.get(node.id) === 0) {
                queue.push(node.id);
            }
        });

        while (queue.length) {
            const current = queue.shift();
            executionOrder.push(current);

            graph.get(current).forEach((neighbor) => {
                indegree.set(neighbor, indegree.get(neighbor) - 1);
                if (indegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            });
        }

        // Generate ordered output with node labels
        const orderedOutput = executionOrder.map((id) => {
            const node = nodes.find((n) => n.id === id);
            const preNode = getPreviousNodes(node.id);

            //   console.log(`Executing Node: ${currentNode?.data.label}`);
            //   console.log(`Previous Node Values:`, previousNodeValues);
            return { id: node.id, label: node.data.label, value: node.data.value, preNode };
        });

        // console.log('Execution Order:', orderedOutput);
        return orderedOutput;
    };

    return <div> <button
        onClick={()=> queriesMaker()}
        className='ml-4'
    >
        TEST
    </button></div>

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                edgesSelectable={true} // Enables edge selection

            >
                <Background />
            </ReactFlow>

            <div className='absolute top-0'>

                <button
                    onClick={() => {
                        // console.log(nodes, edges);
                        let data = getExecutionOrder()
                        console.log(data);

                        // const values = nodes.map((node) => ({
                        //     id: node.id,
                        //     value: node.data.value,
                        // }));
                        // console.log('Node Values:', values);
                    }}
                >
                    Log Node Values
                </button>

                <button
                    onClick={addNode}
                    className='ml-4'
                >
                    add node +
                </button>

            </div>
        </div>
    );
}

export default FlowExample;
