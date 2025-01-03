import React from 'react'

function PaneMenu({ paneMenu, addNode, closePaneMenu }) {
    if (!paneMenu.visible) return


    return (
        <div
            style={{
                top: paneMenu.y,
                left: paneMenu.x,
            }}
            className='absolute z-10 border bg-white min-w-64 rounded-lg'
        >
            <div className='flex items-center justify-between border-b'>
                <p className='m-2 font-bold'>+ New Node</p>
                <button className='mx-2 text-xl'
                    onClick={closePaneMenu}
                >  <span className="material-symbols-outlined mt-2 hover:font-bold">
                        close
                    </span></button>
            </div>
            <div className='flex flex-col'>
                {[
                    {
                        name: "Asset Selector",
                        purposes: "Makes it clear that users are selecting an asset or coin.",
                        node: "CoinNode",
                        type: 'coin_data'
                    },
                    {
                        name: "Technical Indicator",
                        purposes: "Clarifies that the node deals with technical analysis indicators like RSI, MACD, etc.",
                        node: "IndicatorNode",
                        type: 'indicator'
                    },
                    {
                        name: "Constant Value",
                        purposes: "Indicates a fixed value or user-defined numeric input.",
                        node: "ValueNode"
                    },
                    {
                        name: "Math Operation",
                        purposes: "Specifies that this node performs mathematical calculations.",
                        node: "MathNode",
                        type: 'math',

                    },
                    {
                        name: "Math Utils",
                        purposes: "Specifies that this node performs mathematical special calculations.",
                        node: "MathUtils",
                        type: 'math_utils_np'
                    },
                    {
                        name: "Condition",
                        purposes: "Simple and clear to describe a conditional logic node, e.g., >, <, =, etc.",
                        node: "ConditionNode",
                        type: 'check'
                    },
                    {
                        name: "High-Low Detector",
                        purposes: "Explicitly states that this node detects high-high or low-low patterns.",
                        node: "HHLLNode",
                        type: 'hhll',
                        plot: "lines"
                    },
                    {
                        name: "Trade Executor",
                        purposes: "Indicates that this node is responsible for executing trades.",
                        node: "TradeNode",
                        type: 'trade'
                    },
                    {
                        name: "Logic Gate",
                        purposes: "Describes the node's role in applying logical operations like AND, OR, NOT, etc.",
                        node: "LogicalNode",
                        type: 'logic'
                    },
                    // { name: "Coin", node: addNode('IndicatorNode', { type: 'coin_data' }) },
                ].map((nd, idx) => <button
                    // onClick={nd.add}
                    onClick={() => addNode(nd.node, nd)}
                    key={idx}
                    className="py-2 px-2 text-left relative group hover:bg-blue-50 border-black"
                >
                    <h3>{nd.name}</h3>
                    {/* Tooltip */}
                    <div
                        className="absolute bottom-full left-0 bottom-1 transform translate-y-4 w-max px-2 py-1 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    >
                        {nd.purposes}
                    </div>
                </button>)}
            </div>
        </div>
    )
}

export default PaneMenu