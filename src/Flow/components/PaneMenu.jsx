import React, { useState } from 'react';
import { nodesList } from './nodes'
import { colors } from '../utils/colors'

const nodes = nodesList()

function formatString(input) {
    return input
        .replace(/[_.,]/g, ' ') // Replace _,. with spaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
}


function PaneMenu({ paneMenu, addNode, closePaneMenu }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSubmenu, setExpandedSubmenu] = useState(null);
    const [expandedSubSubmenu, setExpandedSubSubmenu] = useState(null);

    if (!paneMenu.visible) return null;


    const filteredNodes = nodes.filter(nd =>
        nd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (nd.submenu && nd.submenu.some(sub =>
            sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (sub.submenu && sub.submenu.some(subSub => subSub.name.toLowerCase().includes(searchQuery.toLowerCase())))
        ))
    );

    return (
        <div
            style={{ top: paneMenu.y, left: paneMenu.x }}
            className='absolute z-10 border bg-white w-56 rounded-lg'
        >
            <div className='flex items-center justify-between border-b'>
                <input
                    type="text"
                    placeholder="Search nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="m-2 px-2 p-1 rounded-full w-full outline-none bg-gray-100"
                />
                <button
                    className='mx-2 text-xl'
                    onClick={closePaneMenu}
                >
                    <span className="material-symbols-outlined mt-2 hover:font-bold">
                        close
                    </span>
                </button>
            </div>
            <div className='flex flex-col'>
                {/* LEYER 1 */}
                {filteredNodes.map((nd, idx) => (
                    <div key={idx} className="relative group text-sm">
                        <button
                            onClick={() => addNode(nd.node, nd)}
                            className={`py-1 pl-4 flex items-center justify-between w-full text-left hover:bg-blue-50 border-black border-l ${expandedSubmenu === idx ? 'bg-blue-50' : ''}`}
                            style={{ borderColor: colors[idx] }}
                            onMouseOver={() => setExpandedSubmenu(idx)}
                        >

                            <h3 className='capitalize'>{formatString(nd.name)}</h3>
                            {nd?.submenu && <span class="material-symbols-outlined -scale-x-100 text-lg opacity-40">
                                arrow_left
                            </span>}
                        </button>
                        {/* Submenu */}

                        {nd.submenu && (
                            <div>
                                {/* <button
                                    className="text-xs ml-4 mt-1 hover:underline"
                                    onClick={() => setExpandedSubmenu(expandedSubmenu === idx ? null : idx)}
                                    onMouseOver={() => setExpandedSubSubmenu(idx)}

                                >
                                    {expandedSubmenu === idx ? 'Hide Submenu' : 'Show Submenu'}
                                </button> */}
                                {expandedSubmenu === idx && (
                                    <div className="absolute border left-full w-full top-0 border-l bg-white rounded-r-lg">

                                        {/* LEYER 2 */}
                                        {nd.submenu.map((sub, subIdx) => {
                                            return <div key={subIdx} className="relative group">
                                                <button
                                                    onClick={() => {
                                                        if (sub.submenu) return
                                                        addNode(sub.node, sub.data)
                                                    }}
                                                    className={`py-0 pl-4 flex items-center justify-between w-full text-left hover:bg-blue-50 ${expandedSubSubmenu === subIdx ? 'bg-blue-50' : ''}`}
                                                    onMouseOver={() => setExpandedSubSubmenu(subIdx)}
                                                >
                                                    <h3 className='capitalize'>{formatString(sub.name)}</h3>
                                                    <span class={`material-symbols-outlined -scale-x-100 text-lg opacity-40 ${sub?.submenu ? 'visible' : 'invisible'}`}>
                                                        arrow_left
                                                    </span>
                                                </button>


                                                {/* LEYER 3 */}
                                                {sub.submenu && (
                                                    <div>
                                                        {expandedSubSubmenu === subIdx && (
                                                            <div className="absolute border left-full min-w-44 top-0 border-l bg-white rounded-r-lg">
                                                                {sub.submenu.map((subSub, subSubIdx) => (
                                                                    <button
                                                                        key={subSubIdx}
                                                                        onClick={() => addNode(subSub.node, subSub.data)}
                                                                        // onClick={() => console.log(subSub)}
                                                                        className="py-1 pl-4 text-left w-full hover:bg-blue-50 capitalize"
                                                                    >
                                                                        {formatString(subSub.name)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PaneMenu;
