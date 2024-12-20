import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ReactFlow, addEdge, Handle, useEdgesState, useNodesState, Background, applyNodeChanges, applyEdgeChanges, reconnectEdge } from '@xyflow/react';
import Plot from './chart'
import '@xyflow/react/dist/style.css';
import { ValueNode, MathNode, ConditionNode, IndicatorNode, HHLLNode, CoinNode, TradeNode, LogicalNode } from './nodes'
import { queriesMaker } from './queriesMaker';
import { twMerge } from 'tailwind-merge';
import mock_data from './chart/data.json'

const initialNodes = [
    // {
    //     id: '1',
    //     type: 'HHLLNode',
    //     data: { label: 'Value', value: 'SMA', outputType: 'number', type: "hhll" },
    //     position: { x: 50, y: 50 },
    // },
];

const initialEdges = [
    // { id: 'e1-2', source: '1', target: '2', reconnectable: 'target', animated: false, targetHandle: "talib.EMA(close,15)" },
    // { id: 'e2-3', source: '2', target: '3' },
];


function FlowExample() {

    const edgeReconnectSuccessful = useRef(true);
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);
    const [results, setResults] = useEdgesState();


    const updateNodeValue = (nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node))
        );
    };


    // Function to get the previous nodes and their values for a specific node
    const getPreviousNodes = (nodeId) => {
        const predecessors = edges
            .filter((edge) => edge.target === nodeId) // Find edges where this node is the target
            .map((edge) => edge.source).sort((a, b) => {
                if (a.targetHandle > b.targetHandle) return 1;
                if (a.targetHandle < b.targetHandle) return -1;
                return 0;
            });

        // Get the values of the predecessor nodes
        const previousNodeValues = predecessors.map((sourceId) => {
            const node = nodes.find((n) => n.id === sourceId);
            return { id: sourceId, ...node?.data };
        });

        return previousNodeValues;
    };



    const nodeTypes = useMemo(() => ({
        ValueNode: (props) => <ValueNode {...props} updateNode={updateNodeValue} />,
        IndicatorNode: (props) => <IndicatorNode {...props} updateNode={updateNodeValue} />,
        MathNode: (props) => <MathNode {...props} updateNode={updateNodeValue} />,
        ConditionNode: (props) => <ConditionNode {...props} updateNode={updateNodeValue} />,
        HHLLNode: (props) => <HHLLNode {...props} updateNode={updateNodeValue} />,
        CoinNode: (props) => <CoinNode {...props} updateNode={updateNodeValue} />,
        TradeNode: (props) => <TradeNode {...props} updateNode={updateNodeValue} />,
        LogicalNode: (props) => <LogicalNode {...props} updateNode={updateNodeValue} />,
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

            //   console.log(`Executing Node: ${currentNode?.data.label}`);
            //   console.log(`Previous Node Values:`, previousNodeValues);
            return { id: node.id, ...node.data, preNode };
        });

        // console.log('Execution Order:', orderedOutput);
        return orderedOutput;
    };



    const handleSubmit = async (query, kahn_nodes) => {
        const postData = {
            data: query
        };

        // Send the POST request
        const response = await fetch('http://127.0.0.1:8000/process/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        const result = await response.json();
        // console.log({ result }); // Handle the response
        setResults({ kahn_nodes, ...result })
        // console.log(result.outputs);
        
    };



    return (
        <div className='h-screen w-screen'>

            <div className={twMerge("w-screen overflow-hidden", results ? 'h-1/2 ' : 'h-full')}>
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
                        { name: "Coin", "add": () => addNode('CoinNode', { type: 'coin_data' }) },
                        { name: "Indicator", "add": () => addNode('IndicatorNode', { type: 'indicator' }) },
                        { name: "Value", "add": () => addNode('ValueNode') },
                        { name: "Math", "add": () => addNode('MathNode', { type: 'math' }) },
                        { name: "Cond", "add": () => addNode('ConditionNode', { type: 'check' }) },
                        { name: "HHLL", "add": () => addNode('HHLLNode', { type: 'hhll' }) },
                        { name: "TradeNode", "add": () => addNode('TradeNode', { type: 'trade' }) },
                        { name: "LogicalNode", "add": () => addNode('LogicalNode', { type: 'logic' }) },



                        // { name: "Coin", "add": addNode('IndicatorNode', { type: 'coin_data' }) },
                    ].map((btn, idx) => <button onClick={btn.add} key={idx}
                        className='ml-2 border rounded-lg border-black px-2' >
                        {btn.name}
                    </button>)}


                    <button
                        className='ml-2 border border-black px-10 bg-gray-200'
                        onClick={() => {
                            setResults()
                            // console.log({ nodes, edges });
                            let kahn_nodes = getExecutionOrder()
                            console.log("nodes : ", kahn_nodes);
                            let query = queriesMaker(kahn_nodes)
                            console.log("query : ", query);
                            // handleSubmit(query, kahn_nodes)
                        }}
                    >
                        TEST
                    </button>
                </div>
            </div>


            {results && <div className='h-1/2 w-screen'>
                <Plot data={results} />
            </div>}
        </div>

    );
}

export default FlowExample;
