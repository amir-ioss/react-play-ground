import React from 'react'

function PaneToolBar({
    panes,
    setPanes,
    name = "flow",
    onClose,
    onExpand,
    extend = () => null

}) {
    return (
        <div className='absolute left-0 top-0 text-black flex items-center gap-x-2 pt-[5px] px-1  bg-white'>

            {extend()}

            <button
                className='hover:text-black/40 pb-0 bg-white size-6 rounded-sm '
                onClick={() => {
                    let _panes = panes.filter(_ => _ != name)
                    if (panes.includes(name)) setPanes(_panes)
                    else if (!panes.includes(name)) setPanes([..._panes, name])
                }}
            >
                <span class="material-symbols-outlined">
                    {!panes.includes(name) ? "fullscreen_exit" : "fullscreen"}
                </span>
            </button>


            {/* CLOSE PANEL */}
            <button
                className='hover:text-black/40 pb-0 bg-white size-6 rounded-sm '
                onClick={onClose}
            >
                <span className="material-symbols-outlined pb-0">
                    close
                </span>
            </button>


        </div>
    )
}

export default PaneToolBar