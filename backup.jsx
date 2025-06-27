import React from 'react'
import { useState, useRef, useEffect } from 'react';
const Manager = () => {
    // const [form, setform] = useState([{ url: "", username: "", password: "" }]);
    const [form, setform] = useState([]);
    const eyeref = useRef()
    const pref = useRef();
    const [url, seturl] = useState();
    const [user, setuser] = useState()
    const [passwordArray, setpasswordArray] = useState([]);
    const [pass, setpass] = useState()

    const handleChange = (e) => {
        if (e.target.value !== "") {
            setform({ ...form, [e.target.name]: e.target.value });
        }
    }
    useEffect(() => {
        let passwords = localStorage.getItem("passwords");
        if (passwords) {
            setpasswordArray(JSON.parse(passwords));
        }
    }, [])

    const AddPassword = () => {
        let updatedPasswordArray = [...passwordArray, form]
        setpasswordArray(updatedPasswordArray);
        localStorage.setItem("passwords", JSON.stringify(passwordArray));
        console.log(updatedPasswordArray);
    }
    const handleEye = (e) => {
        if (eyeref.current.src === "http://localhost:5173/assets/eye.png") {
            eyeref.current.src = "http://localhost:5173/assets/crosseye.png";
            pref.current.type = "text";
        }
        else {   // (eyeref.current.src === "http://localhost:5173/assets/crosseye.png") {
            eyeref.current.src = "http://localhost:5173/assets/eye.png";
            pref.current.type = "password";
        }
    }


    return (
        <div className="body w-[60vw] h-auto mx-[20vw] flex flex-col  gap-5 container  ">
            <div className="absolute inset-0 -z-10 h-auto w-full bg-blue-200 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div></div>
            <div className='text-3xl font-extrabold text-blue-950 text-center'>Web Password Manager</div>
            <div className="site h-10 w-full  ">
                <input type="text" name='url' value={undefined} onChange={handleChange} className='h-full w-full rounded-full p-3 border-2 ' placeholder='Enter URL' />
            </div>
            <div className="user h-10 w-full flex justify-between gap-3">
                <input type="text" name='username' value={undefined} onChange={handleChange} className='h-full w-[50%] rounded-full border-2 pl-3 pr-1 ' placeholder='Enter username' />
                <span className="container  w-[50%] border-2 flex rounded-full py-0.5 rounded-l-full pl-3 gap-3 pr-2 items-center">
                    <input type="password" ref={pref} name="password" value={undefined} onChange={handleChange} className='h-[94%] w-[94%]  rounded-sm  px-1 focus:outline-none' placeholder='Enter password' />
                    <button className='pt-1' >
                        <img src="./assets/eye.png" ref={eyeref} onClick={handleEye} className=' h-5 w-5 fill-black stroke-black  ' alt="eye" style={{ filter: 'brightness(0) invert(0)' }} />
                    </button>
                </span>
            </div>
            <div className="addpwd h-12 w-[25%] mx-auto">
                <button className=" h-full w-fit mx-auto rounded-full px-3 border-2 bg-blue-200 cursor-pointer flex text-lg font-medium items-center" onClick={AddPassword}>
                    <span className="material-icons">
                        add_box
                    </span>Add Password</button>
            </div>
            <div className="pwds text-xl font-semibold text-center">Your Passwords</div>
            {/* {console.log("Again : " + passwordArray.length)} */}
            {/* {passwordArray.length === 0 ? (<div className='text-xl font-semibold text-start'>No Passwords to Display</div>) :  } */}
            {passwordArray.length === 0 ? (<div className='text-xl font-semibold text-start '>No Passwords to Display</div>) : (<table className="table-auto bg-blue-200 p-4 overflow-y-scroll">
                <thead className='h-10'>
                    <tr className='text-center w-10  bg-blue-300 py-3 '>
                        <th className='text-center w-[50%] my-10'>Your Site</th>
                        <th className='w-[25%] text-center my-10'>Username</th>
                        <th className='w-[25%] text-center my-10'>Password</th>
                    </tr>
                </thead>
                <tbody className='text-2xl  h-[60vh] mt-3 overflow-scroll'>
                    {passwordArray.map((item, index) => {
                        return (<tr key={index} className='text-center w-15 '>
                            <a href="./components/navbar.jsx" target="__blank" className='hover:text-teal-600'><td className='h-10 text-lg w-fit'>{item.url}</td></a>
                            <td className=' text-lg  h-10  w-fit'>{item.username}</td>
                            <td className=' text-lg  h-10  w-fit '>{item.password}h-10
                                <button className='h-full w-10 ml-5 '><span className="material-icons">
                                    delete_outline
                                </span></button>
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>)}

        </div>
    )
}

export default Manager
