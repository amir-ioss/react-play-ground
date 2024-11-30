import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ReactFlow, addEdge, Handle, useEdgesState, useNodesState, Background, applyNodeChanges, applyEdgeChanges, reconnectEdge } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { ValueNode, MathNode, ConditionNode, CustomNode, IndicatorNode, HHLLNode, CoinNode } from './nodes'
import { queriesMaker } from './queriesMaker';

const initialNodes = [
    // {
    //     id: '1',
    //     type: 'HHLLNode',
    //     data: { label: 'Value', value: 'SMA', outputType: 'number', type: "hhll" },
    //     position: { x: 50, y: 50 },
    // },
    // {
    //     id: '1',
    //     type: 'IndicatorNode',
    //     data: { label: 'Value', value: 'SMA', outputType: 'number' },
    //     position: { x: 50, y: 50 },
    // },
    // {
    //     id: '2',
    //     type: 'ConditionNode',
    //     data: { label: 'Operator', value: '', inputType: 'string', type: 'check' },
    //     position: { x: 350, y: 50 },
    // },
    // {
    //     id: '2',
    //     type: 'customNode',
    //     data: { label: 'EMA', value: 'talib.EMA(close, 5)' },
    //     position: { x: 300, y: 50 },
    // },
];

const initialEdges = [
    // { id: 'e1-2', source: '1', target: '2', reconnectable: 'target', animated: false, targetHandle: "talib.EMA(close,15)" },
    // { id: 'e2-3', source: '2', target: '3' },
];


function FlowExample() {

    const edgeReconnectSuccessful = useRef(true);
    // const [nodes, setNodes] = useState(initialNodes);
    // const [edges, setEdges] = useState(initialEdges);
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);


    const updateNodeValue = (nodeId, newValue) => {
        setNodes((nds) =>
            nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, value: newValue } } : node))
        );
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



    const nodeTypes = useMemo(() => ({
        ValueNode: (props) => <ValueNode {...props} updateNode={updateNodeValue} />,
        IndicatorNode: (props) => <IndicatorNode {...props} updateNode={updateNodeValue} />,
        MathNode: (props) => <MathNode {...props} updateNode={updateNodeValue} />,
        CustomNode: (props) => <CustomNode {...props} updateNode={updateNodeValue} />,
        ConditionNode: (props) => <ConditionNode {...props} updateNode={updateNodeValue} />,
        HHLLNode: (props) => <HHLLNode {...props} updateNode={updateNodeValue} />,
        CoinNode: (props) => <CoinNode {...props} updateNode={updateNodeValue} />,

    }), []);


    const onNodesChange = (changes) =>
        setNodes((nds) => applyNodeChanges(changes, nds));

    const onEdgesChange = (changes) =>
        setEdges((eds) => applyEdgeChanges(changes, eds));


    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge, newConnection) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_, edge) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeReconnectSuccessful.current = true;
    }, []);


    const isValidConnection = (sourceNode, targetNode) => {
        return true
        // Check if data types match
        console.log(sourceNode?.data?.outputType, "===", targetNode?.data?.inputType);

        return sourceNode?.data?.outputType === targetNode?.data?.inputType;
    };

    const onConnect = useCallback(
        (connection) => {
            // Get source and target nodes
            const sourceNode = nodes.find((node) => node.id === connection.source);
            const targetNode = nodes.find((node) => node.id === connection.target);

            // console.log('Connecting:', connection); // Logs handle ids like input-1, output-2
            if (isValidConnection(sourceNode, targetNode)) {
                setEdges((eds) => addEdge(connection, eds));
            } else {
                alert('Connection failed: Data types do not match.');
            }
        },
        []
    );




    // Add a new node dynamically
    const addNode = (node = 'ConditionNode', data = {}) => {
        const newNode = {
            id: `${nodes.length + 1}`, // Unique ID for the new node
            // type: 'default',
            type: node,
            data: { label: `${node} ${nodes.length + 1}`, value: [], ...data },
            position: {
                x: Math.random() * 500, // Random x position
                y: Math.random() * 500, // Random y position
            },
        };
        setNodes((nds) => [...nds, newNode]);
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
            console.log({ preNode });


            //   console.log(`Executing Node: ${currentNode?.data.label}`);
            //   console.log(`Previous Node Values:`, previousNodeValues);
            return { id: node.id, ...node.data, preNode };
        });

        // console.log('Execution Order:', orderedOutput);
        return orderedOutput;
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onReconnect={onReconnect}
                onReconnectStart={onReconnectStart}
                onReconnectEnd={onReconnectEnd}
                // fitView
                edgesSelectable={true} // Enables edge selection

            >
                <Background />
            </ReactFlow>

            <div className='absolute top-2'>
                {[
                    { name: "Indicator", "add": () => addNode('IndicatorNode') },
                    { name: "Value", "add": () => addNode('ValueNode') },
                    { name: "Math", "add": () => addNode('MathNode', { type: 'math' }) },
                    { name: "Cond", "add": () => addNode('ConditionNode', { type: 'check' }) },
                    { name: "HHLL", "add": () => addNode('HHLLNode', { type: 'hhll' }) },
                    { name: "Coin", "add": () => addNode('CoinNode', { type: 'coin_data' }) },
                    // { name: "Coin", "add": addNode('IndicatorNode', { type: 'coin_data' }) },
                ].map((btn, idx) => <button onClick={btn.add} key={idx}
                    className='ml-2 border rounded-lg border-black px-2' >
                    {btn.name}
                </button>)}


                <button
                    className='ml-2 border border-black px-10 bg-gray-200'
                    onClick={() => {
                        console.log({ nodes, edges });
                        let data = getExecutionOrder()
                        console.log("nodes : ", data);
                        let query = queriesMaker(data)
                        console.log("query : ", query);
                    }}
                >
                    TEST
                </button>
            </div>
        </div>
    );
}

export default FlowExample;
