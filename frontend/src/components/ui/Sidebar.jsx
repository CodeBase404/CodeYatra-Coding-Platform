import React from 'react'

function Sidebar({setIsOpen}) {
  return (
    <div className='h-screen w-full dark:text-white text-black bg-neutral border-r border-white/20 px-6 py-4 space-y-4'>
        <div className='flex justify-between'>
           <div>Library</div> 
           <div onClick={()=>setIsOpen(false)}>x</div> 
        </div>
        <div className='pb-4 border-b border-white/20'>
            <div className='hover:bg-gray-500 p-2 rounded-md'>Home</div>
            <div className='hover:bg-gray-500 p-2 rounded-md'>Problems</div>
            <div className='hover:bg-gray-500 p-2 rounded-md'>Study Plan</div>
            <div className='hover:bg-gray-500 p-2 rounded-md'>Discuss</div>
        </div>
        <div className='pb-4 border-b border-white/20'>
            <div className='hover:bg-gray-500 p-2 rounded-md'>Home</div>
            <div className='hover:bg-gray-500 p-2 rounded-md'>Problems</div>
            <div className='hover:bg-gray-500 p-2 rounded-md'>Study Plan</div>
            <div className='hover:bg-gray-500 p-2 rounded-md'>Discuss</div>
        </div>
    </div>
  )
}

export default Sidebar