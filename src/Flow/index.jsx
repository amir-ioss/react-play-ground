import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ReactFlow, addEdge, Handle, useEdgesState, useNodesState, Background, applyNodeChanges, applyEdgeChanges, reconnectEdge } from '@xyflow/react';
// import Plot from './chart'
import Plot from '../Chart/TradingChart'
import '@xyflow/react/dist/style.css';
import { ValueNode, MathNode, ConditionNode, IndicatorNode, HHLLNode, CoinNode, TradeNode, LogicalNode , MathUtils} from './nodes'
import { queriesMaker } from './utils/queriesMaker';
import { twMerge } from 'tailwind-merge';
import mock_data from './chart/data.json'
// import { getCandlestickData } from '../Chart/data/dataProcessor';
// const candleStickData = getCandlestickData();
import PaneMenu from './components/PaneMenu'
import Modal from './components/Modal';
import { calculatePercentageChange } from '../Chart/utils/helpers';


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
    const [menu, setMenu] = useNodesState({ visible: false, x: 0, y: 0, data: null });
    const [paneMenu, setPaneMenu] = useNodesState({ visible: false, x: 0, y: 0 });
    const [state, setState] = useNodesState({ chart: true, resultsOn: true });

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
        MathUtils: (props) => <MathUtils {...props} updateNode={updateNodeValue} />,
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
            data: { label: `${data.name} ${nodes.length + 1}`, value: [], ...data },
            position: {
                x: Math.random() * 500, // Random x position
                y: Math.random() * 500, // Random y position
            },
        };
        setNodes((nds) => [...nds, newNode]);
        closePaneMenu()
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
        setState({ ...state, resultsOn: true })
        // console.log("outputs", result.outputs);

    };


    // Open context menu
    const onNodeContextMenu = (event, node) => {
        event.preventDefault(); // Prevent default browser context menu
        setMenu({ visible: true, x: event.clientX, y: event.clientY, data: node });
    };

    // Close context menu
    const closeNodeMenu = () => setMenu({ visible: false, x: 0, y: 0, data: null });

    // Example action: Delete node
    const deleteNode = () => {
        setNodes((nds) => nds.filter((n) => n.id !== menu.data.id));
        closeNodeMenu();
    };

    // Open context menu on background
    const onPaneContextMenu = (event) => {
        event.preventDefault(); // Prevent default browser context menu
        setPaneMenu({ visible: true, x: event.clientX, y: event.clientY });
    };

    // Close the context menu
    const closePaneMenu = () => setPaneMenu({ visible: false, x: 0, y: 0 });


    return (
        <div className='flex h-screen w-screen'>


            <div className={`w-screen`}>
                {menu.visible && (
                    <div
                        style={{
                            top: menu.y,
                            left: menu.x,
                        }}
                        className='absolute z-10 border bg-white p-2 min-w-44 rounded-lg'
                    >

                        <div className='flex items-center justify-between border-b'>
                            <p className='font-bold'>Node: {menu.data.data.label}</p>
                            <button className='mx-2 text-xl'
                                onClick={closeNodeMenu}
                            >x</button>
                        </div>
                        <button onClick={deleteNode} className='text-red-400'>Delete Node</button>

                    </div>
                )}
                <div className={twMerge("overflow-hidden ", (results && state.chart) ? 'h-1/2' : 'h-full')}>
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
                        onNodeContextMenu={onNodeContextMenu}
                        onPaneContextMenu={onPaneContextMenu}
                    >
                        <Background />
                    </ReactFlow>


                    <PaneMenu paneMenu={paneMenu} addNode={addNode} closePaneMenu={closePaneMenu} />


                    {/* HEADER */}
                    <div className='absolute top-0 right-0 z-50'>

                        <button
                            className='m-2  bg-black p-2 px-10 text-gray-200 rounded-lg'
                            onClick={() => setState({ ...state, resultsOn: !state.resultsOn })}
                        >
                            {state.resultsOn ? "Result On" : "Result Off"}
                        </button>

                        <button
                            className='m-2  bg-black p-2 px-10 text-gray-200 rounded-lg'
                            onClick={() => setState({ ...state, chart: !state.chart })}
                        >
                            {state.chart ? "Chart On" : "Chart Off"}
                        </button>



                        <button
                            className='m-2  bg-black p-2 px-10 text-gray-200  rounded-lg'
                            onClick={() => {
                                setResults()
                                // console.log({ nodes, edges });
                                let kahn_nodes = getExecutionOrder()
                                console.log("nodes : ", kahn_nodes);
                                let query = queriesMaker(kahn_nodes)
                                console.log("query : ", query);
                                if (state.chart) handleSubmit(query, kahn_nodes)

                            }}
                        >
                            TEST
                        </button>
                    </div>

                </div>


                {results && state.chart && <div className={`h-1/2 w-screen`}>
                    <Plot data={results} state={state.resultsOn} />
                </div>}
            </div>

            {/* RESULTS RIGHT MODAL */}
            {results?.result && state.resultsOn && <div className='absolute right-0 bg-white w-[20vw] h-screen overflow-y-scroll'>
                <div className='fixed bottom-0 bg-gradient-to-t from-white via-white p-4 w-full'>
                    <h3>Results</h3>
                    <p className='text-xl'>Balance : {(results.result?.final_balance).toFixed(2)}</p>
                    <p>Total trades : {results.result.trades.length}</p>
                </div>

                <div>
                    {results.result.trades.map((trade, count) => {
                        const isLoss = trade.pnl < 0
                        return <div className='border-b text-sm p-4 flex justify-between items-center' key={count}>
                            <div>
                                <p className={`${trade.type == 'long' ? 'bg-green-600' : 'bg-red-600'} w-fit px-3 py-1 text-white uppercase`}>{trade.type}</p>
                                <p>Entry : {trade.entry_price}</p>
                                <p>Exit : {trade.exit_price}</p>
                            </div>
                            <div className=''>
                                <div>
                                    <p className='border w-fit'>PNL : {trade.pnl.toFixed(2)}</p>
                                    <p>Fee : {trade.fee.toFixed(2)}</p>
                                </div>
                            </div>
                            <p className={`text-2xl ${isLoss ? 'text-red-500' : 'text-green-500'}`}>{calculatePercentageChange(trade.entry_price, trade.exit_price)}%</p>
                        </div>
                    })}
                </div>

                {/* CLOSE PANEL */}
                <button className='fixed top-20 right-[20vw] p-1 pb-0 bg-black text-white'
                    onClick={() => setState({ ...state, resultsOn: false })}
                >
                    <span className="material-symbols-outlined  hover:font-bold">
                        close
                    </span>
                </button>

            </div>}


            {/* <Modal isOpen={state?.resultsOn}
                    onClose={() => setState({ ...state, resultsOn: false })}
                    title="Trades"
                    className=" bg-white xl:w-1/2 cursor-pointer py-0 rounded-lg p-4 md:p-0"
                >
                </Modal> */}

        </div>

    );
}

export default FlowExample;
