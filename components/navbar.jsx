import React from 'react'
import { TfiMenuAlt } from "react-icons/tfi";

const navbar = () => {
    return (
        // <nav className='h-[8vh] w-[100vw] bg-violet-400 flex flex-row justify-between items-center px-50 text-2xl font-bold text-black'>
        <nav className='relative z-0 h-[8vh]  w-[100vw] bg-blue-300 flex flex-row justify-between items-center px-5  md:px-30 text-2xl font-bold '>
            <span className="text-sm md:text-2xl">
                <span className='text-blue-950'>&lt;</span>Pass
                {/* <span className='text-[#DDFF84]'>Op/&gt;</span></span>  */}
                <span className='text-blue-900 '>Op/&gt;</span></span>
            <ul className='h-full w-[30%]  justify-around items-center font-semibold md:flex md:gap-1 gap-2 text-sm md:text-lg hidden' >
                <li className="item1"> <a href="/package.json">Home</a></li>
                <li> <a href="/package.json">About</a></li>
                {/* <li> <a href="/package.json">Contact Us</a></li> */}
                <li> <a href="/package.json">Explore</a></li>
            </ul>
            <TfiMenuAlt className="visible md:hidden h-[20px] w-4 md:h-[80%] md:w-7 cursor-pointer" title="Menu"/>
        </nav>
    )
}

export default navbar
