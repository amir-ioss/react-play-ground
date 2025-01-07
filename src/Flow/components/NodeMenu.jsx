import React from 'react';

function NodeMenu({ menu, closeNodeMenu, deleteNode }) {

    if (!menu.visible) return null;
    
    return (<div
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

    </div>);
}

export default NodeMenu;
