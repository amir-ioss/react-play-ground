import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactFlow, addEdge, Handle, useEdgesState, useNodesState, Background, applyNodeChanges, applyEdgeChanges, reconnectEdge } from '@xyflow/react';
// import Plot from './chart'
import Plot from '../Chart/TradingChart'
import '@xyflow/react/dist/style.css';
import { ValueNode, MathNode, ConditionNode, IndicatorNode, HHLLNode, CoinNode, TradeNode, LogicalNode, MathUtils, InvertNode, PastValue } from './nodes'
import { queriesMaker } from './utils/queriesMaker';
import { Panes } from './utils/help';
import { twMerge } from 'tailwind-merge';
import mock_data from './chart/data.json'
// import { getCandlestickData } from '../Chart/data/dataProcessor';
// const candleStickData = getCandlestickData();
import PaneMenu from './components/PaneMenu'
import Modal from './components/Modal';
import Header from './components/Header'
import { calculatePercentageChange, Pane } from '../Chart/utils/helpers';
import PaneToolBar from './components/PaneToolBar';
import NodeMenu from './components/NodeMenu'

const initialNodes = [
    // {
    //     "id": "1",
    //     "type": "CoinNode",
    //     "node": "CoinNode",
    //     "data": {
    //         "label": "Asset Selector 1",
    //         "value": [
    //             "time",
    //             "open",
    //             "high",
    //             "low",
    //             "close",
    //             "volume",
    //             null,
    //             null
    //         ],
    //         "name": "Asset Selector",
    //         "purposes": "Makes it clear that users are selecting an asset or coin.",
    //         "node": "CoinNode",
    //         "type": "coin_data"
    //     },
    //     "position": {
    //         "x": -13.545925468769383,
    //         "y": 94.85859581686961
    //     },
    //     "measured": {
    //         "width": 321,
    //         "height": 397
    //     },
    //     "selected": false,
    //     "dragging": false
    // },
    // {
    //     "id": "2",
    //     "type": "IndicatorNode",
    //     "node": "IndicatorNode",
    //     "data": {
    //         "label": "RSI",
    //         "value": [
    //             "RSI",
    //             "close",
    //             14
    //         ],
    //         "name": "Technical Indicator",
    //         "purposes": "Clarifies that the node deals with technical analysis indicators like RSI, MACD, etc.",
    //         "node": "IndicatorNode",
    //         "type": "indicator",
    //         "returns": [],
    //         "indicator": {
    //             "Name": "RSI",
    //             "Description": "Relative Strength Index",
    //             "Type": "Momentum Indicators",
    //             "Inputs": [
    //                 {
    //                     "name": "real",
    //                     "type": "number",
    //                     "target": true
    //                 }
    //             ],
    //             "Parameters": [
    //                 {
    //                     "name": "timeperiod",
    //                     "type": "number",
    //                     "value": 14
    //                 }
    //             ],
    //             "Outputs": [
    //                 {
    //                     "name": "real",
    //                     "type": "number",
    //                     "source": true,
    //                     "value": "real"
    //                 }
    //             ]
    //         }
    //     },
    //     "position": {
    //         "x": 519.0741045124453,
    //         "y": 60.361786253843476
    //     },
    //     "measured": {
    //         "width": 290,
    //         "height": 350
    //     },
    //     "selected": true,
    //     "dragging": false
    // }
];

const initialEdges = [
    // {
    //     "source": "1",
    //     "sourceHandle": "4",
    //     "target": "2",
    //     "targetHandle": "1",
    //     "id": "xy-edge__14-21"
    // }
];


function FlowExample() {

    const edgeReconnectSuccessful = useRef(true);
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);
    const [results, setResults] = useEdgesState();
    const [menu, setMenu] = useNodesState({ visible: false, x: 0, y: 0, data: null });
    const [paneMenu, setPaneMenu] = useNodesState({ visible: false, x: 0, y: 0 });
    const [state, setState] = useNodesState({});
    const [panes, setPanes] = useState(['flow', 'results']);


    const updateNodeValue = (nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node))
        );
        // console.log("changes...");
        // process() use rebounce
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
        PastValue: (props) => <PastValue {...props} updateNode={updateNodeValue} />,
        InvertNode: (props) => <InvertNode {...props} updateNode={updateNodeValue} />,
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
                // process()
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
            node: node,
            data: { label: `${data?.name ?? node} ${nodes.length + 1}`, value: [], ...data },
            position: {
                x: paneMenu?.x ?? Math.random() * 500, // Random x position
                y: paneMenu?.y ?? Math.random() * 500, // Random y position
            },
        };
        // console.log({newNode});
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
            return { id: node.id, node: node.node, type: node.type, ...node.data, preNode };
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

        const data_processed = await response.json();
        // console.log({ data_processed }); // Handle the response
        setResults({ kahn_nodes, ...data_processed })
        // setState({ ...state })

        let _panes = []
        if (!panes.includes('chart')) _panes.push('chart')
        if (data_processed?.result) _panes.push('results')
        setPanes(_ => [..._, ..._panes])

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

    const process = () => {
        console.log('process');

        setResults()
        // console.log({ nodes, edges });
        let kahn_nodes = getExecutionOrder()
        // console.log("nodes : ", kahn_nodes);
        let query = queriesMaker(kahn_nodes)
        console.log("query : ", query);
        handleSubmit(query, kahn_nodes)
    }


    return (
        <div className='flex flex-col h-screen w-screen'>
            <Header onClickProcess={() => process()} />

            <div className={`w-screen h-[95vh]`}>
                {menu.visible && (
                    <NodeMenu
                        menu={menu}
                        closeNodeMenu={closeNodeMenu}
                        deleteNode={deleteNode}
                    />
                )}

                {/* FLOW */}
                <div className={twMerge("overflow-hidden relative ", (results?.outputs) ? 'h-1/2' : 'h-[95vh]', !panes.includes('flow') ? 'hidden' : 'block')} >
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

                    <PaneToolBar
                        panes={panes}
                        setPanes={setPanes}
                        name='chart'
                        onClose={() => {
                            let _panes = panes.filter(_ => _ != 'flow')
                            setPanes(_panes)
                        }}
                    />



                </div>


                {results?.outputs && <div className={twMerge(`w-screen relative`, !panes.includes('flow') ? 'h-full' : 'h-1/2')}>
                    {/* CHART */}
                    {panes.includes('chart') && (
                        <Plot data={results} panes={panes} />
                    )}
                    {/* LOG */}
                    {panes.includes('log') && (
                        <div className='text-black text-xs break-words text-wrap font-mono h-full overflow-y-scroll pt-8'>
                            {Object.entries(JSON.parse(results.outputs)).map((lg, key) => {
                                const node = results.kahn_nodes[lg[0]];
                                return (
                                    <div key={key}>
                                        <p className='bg-black text-white px-2 w-fit'>
                                            {node?.name + ' - ' + node?.label}
                                        </p>
                                        <p className='mb-2 px-2'>{JSON.stringify(lg[1])}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}


                    <PaneToolBar
                        panes={panes}
                        setPanes={setPanes}
                        name='flow'
                        onClose={() => {
                            let destroyPanes = ['chart', 'log']
                            let _panes = panes.filter(_ => !destroyPanes.includes(_))
                            setPanes(_panes)
                            setResults()
                        }}
                        onExpand={() => {
                            let _panes = panes.filter(_ => _ != 'flow')
                            if (panes.includes('flow')) setPanes(_panes)
                            else if (!panes.includes('flow')) setPanes([..._panes, 'flow'])
                        }}
                        extend={() => {
                            return <><button
                                className='hover:text-black/40 pb-0 bg-white size-6 rounded-sm'
                                onClick={() => {
                                    let _panes = panes.filter(_ => _ != 'log')
                                    setPanes([..._panes, 'chart'])
                                }}
                            >
                                <span class="material-symbols-outlined">
                                    legend_toggle
                                </span>
                            </button>

                                <button
                                    className='hover:text-black/40 pb-0 bg-white size-6 rounded-sm'
                                    onClick={() => {
                                        let _panes = panes.filter(_ => _ != 'chart')
                                        setPanes([..._panes, 'log'])
                                    }}
                                >
                                    <span class="material-symbols-outlined">
                                        terminal
                                    </span>
                                </button>
                            </>
                        }}
                    />

                </div>}
            </div>

            {/* RESULTS RIGHT MODAL */}
            {results?.result && panes.includes('results') && <div className='absolute right-0 bg-white w-[18vw] h-screen overflow-y-scroll'>
                <div className='fixed bottom-0 bg-gradient-to-t from-white via-white p-4 w-full'>
                    <h3>Results</h3>
                    <p className='text-xl'>Balance : {(results.result?.final_balance).toFixed(2)}</p>
                    <p>Total trades : {results.result.trades.length}</p>
                </div>

                <div>
                    {results.result.trades.map((trade, count) => {
                        const isLoss = trade.pnl < 0
                        return <div className='border-b text-sm p-2 flex justify-between items-center' key={count}>
                            <div>
                                <p className={`${trade.type == 'long' ? 'bg-green-400' : 'bg-red-400'} w-fit text-xs px-1 py-1 text-white uppercase`}>{trade.type}</p>
                                <p>Entry : {trade.entry_price}</p>
                                <p>Exit : {trade.exit_price}</p>
                            </div>
                            <div className=''>
                                <div>
                                    <p className='border w-fit'>PNL : {trade.pnl.toFixed(2)}</p>
                                    <p>Fee : {trade.fee.toFixed(2)}</p>
                                </div>
                            </div>
                            <p className={`text-2xl ${isLoss ? 'text-red-400' : 'text-green-400'}`}>{calculatePercentageChange(trade.entry_price, trade.exit_price)}%</p>
                        </div>
                    })}
                </div>

                {/* CLOSE PANEL */}
                <button className='fixed top-20 right-[18vw] p-1 pb-0 bg-black text-white'
                    onClick={() => {
                        let destroyPanes = ['results']
                        let _panes = panes.filter(_ => !destroyPanes.includes(_))
                        setPanes(_panes)
                    }}
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
