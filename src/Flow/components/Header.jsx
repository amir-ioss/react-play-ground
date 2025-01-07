import React from 'react'
{/* HEADER */ }
export default function Header({ onClickProcess }) {
  return (
    <div className='h-[5vh] bg-white w-full  flex justify-between'>

      <div className='flex items-center'>
        <div className='bg-gray-300 size-7 mx-4 rounded-full' />
        <button
          className='font-semibold text-base'
        // onClick={() => onClickProcess()}
        >
          {'BTC/USDT'}
        </button>
      </div>
      <div className='flex'>

        <button
          className='bg-black p-1 m-1 mx-10 px-10 text-gray-200  rounded-lg'
          onClick={() => onClickProcess()}
        >
          TEST
        </button>
      </div>

    </div>
  )
}
