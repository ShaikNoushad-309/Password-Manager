import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    // const [form, setform] = useState([{ url: "", username: "", password: "" }]);
    const initialState = { url: "", username: "", password: "" }
    const [form, setForm] = useState(initialState);  // form is used to store current user details in an object form
    // References to target and manipulate the html elements
    const eyeref = useRef()
    const pref = useRef();
    const nameRef = useRef()
    const urlRef = useRef();

    const [passwordArray, setPasswordArray] = useState([]);
    // passwordArray consists of array of forms ie details of all users as an array

    const handleChange = (e) => {
        // if (e.target.value !== "") {
        if (e.target.value) {       // works better than above
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    }

    //  Recently worked on below useEffect
    useEffect(() => {
        const getPasswords = async () => {
            let response = await fetch("http://localhost:3000/", { method: "GET", headers: { 'Content-Type': "application/json" } });
            console.log(response);
            if (response.ok) {
                let data = response.text();
                data.then((resolvedData) => {
                    console.log("Data from mongoDB: ")
                    console.log(typeof (resolvedData))
                    console.log(JSON.parse(resolvedData))
                    setPasswordArray(JSON.parse(resolvedData))
                    console.log(passwordArray)
                }).catch((err) => {
                    console.log(err);
                })
                // console.log("From backend DB :",data);
            }
        }
        getPasswords()
    }, [])

    const AddPassword = async () => {
        // if(!urlRef.current.value || !nameRef.current.value || !pref.current.value){
        if (!form.url || !form.username || !form.password) {
            toast.warning("Input field can't be empty");
            return;
        }
        let newPassword = form;
        // let response = await fetch("http://localhost:3000/", { method: "POST", headers: { 'Content-Type': "application/json" }, body: JSON.stringify(newPassword) });

        let response = await fetch("http://localhost:3000/", { method: "POST", headers: { 'Content-Type': "application/json" }, body: JSON.stringify(newPassword) });
        if (response.ok) {
            let data = response.text();
            data.then((resolvedData) => {
                let checkToInsert = JSON.parse(resolvedData)
                console.log("checkToInsert val :",checkToInsert)
                if(checkToInsert) {
                    let updatedPasswordArray = [...passwordArray, newPassword]
                    setPasswordArray(updatedPasswordArray);
                    toast.success("Entered Record successfully")
                }
                else{
                    toast.warning("Record already exists");
                }
            }).catch((err) => {
                console.log(err);
            })
        }
        setForm(initialState); // setting form to initialState after saving current user details from the form object
        urlRef.current.value = ""; // then setting input fields to initialState
        nameRef.current.value = "";// after saving current user details from the form object
        pref.current.value = "";
    }

    const handleEye = () => {
        if (eyeref.current.src === "http://localhost:5173/assets/eye.png") {
            if (pref.current.value !== "") {
                eyeref.current.src = "http://localhost:5173/assets/crosseye.png";
                pref.current.type = "text";
            }
        }
        else {   // (eyeref.current.src === "http://localhost:5173/assets/crosseye.png") {
            eyeref.current.src = "http://localhost:5173/assets/eye.png";
            pref.current.type = "password";
        }
    }
    const copyText = (item) => {
        console.log("Hello " + item)
        navigator.clipboard.writeText(item).then(() => {
            // toast('Copied to Clipboard!', {
            //     position: "top-right",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: false,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            //     transition: Bounce,
            // });
        }).catch((err) => {
            // console.warn(err);
            toast.warning(err)
        });
    }
    const deleteRecord = async  (ele,eleIdx) => {
        // console.log("Deleting password array",ele)
        if (confirm('Are you sure you want to delete this user?')) {
            let filteredPasswordArray = passwordArray.filter((item,index) => {
                // return (item.url === ele.url && item.username === ele.username && item.password === ele.password);
                return (eleIdx !== index);
            })
            setPasswordArray(filteredPasswordArray)
            // localStorage.setItem("passwords", JSON.stringify(filteredPasswordArray))
            let currRecord = passwordArray.find((item,index) => {
                return (eleIdx === index);
            })
            if (currRecord) {
                let response = await fetch(`http://localhost:3000/`, {
                    method: "DELETE",
                    headers: {'Content-Type': "application/json"},
                    body: JSON.stringify(currRecord)
                });

                // if (response.ok && response.status === 200) { // no need as response.ok itself checks whether the response was successful (status in the range 200-299) or not.
                if (response.ok) {
                    console.log("Record deleted successfully with response: ", await response)
                }
                else if(response.status===404){
                    console.log("Record not found")
                }
                else {
                    console.log("Error in deleting record")
                }
            }
        }
        else {
            console.log('Permission denied to delete');
        }
    }
    const editRecord =async (ele,eleIdx) => {
        console.log("Editing password array");
        let filteredPasswordArray = passwordArray.filter((item,index) => {
            // return (item.url === ele.url && item.username === ele.username && item.password === ele.password);
            return (eleIdx !== index);
        })
        setPasswordArray(filteredPasswordArray)
        let currRecord = passwordArray.find((item,index) => (eleIdx === index));
        console.log("Current editing record : ",currRecord)
        if(currRecord){
            try{
                let response = await fetch(`http://localhost:3000/`, {method:"DELETE",headers: {'Content-Type': "application/json"},body: JSON.stringify(currRecord)});
                if(response.ok){
                    console.log("Record deleted successfully with response: ", await response)
                }
            }catch(error){
                console.log(`Error in deleting record in order to edit: ${error}`)
            }
        }

        // localStorage.setItem("passwords", JSON.stringify(filteredPasswordArray))

        //  Complete this
        setForm({ url: ele.url, username: ele.username, password: ele.password })
        urlRef.current.value = ele.url;
        nameRef.current.value = ele.username;
        pref.current.value = ele.password;
        // setForm(passwordArray.find((item)=>item.id === ele.id));
    }

    return (
        <div className="wrapper w-[100vw] h-[100vh] overflow-auto bg-blue-200">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            {/* <div className="absolute inset-0 -z-10 h-auto w-full bg-blue-200 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div></div> */}
            <div className="relative body lg:w-[80vw] w-[70vw] h-auto lg:mx-[10vw] mx-auto flex flex-col  gap-5 container  ">
                <div className='text-3xl font-extrabold text-blue-950 text-center'>Web Password Manager</div>
                <div className="site h-10 w-full  ">
                    <input type="text" id="url" name='url' ref={urlRef} value={undefined} onChange={handleChange} className='h-full w-full rounded-full p-3 border-2 ' placeholder='Enter URL' />
                </div>
                <div className="user h-10 w-full flex justify-between gap-3">
                    <input type="text" name='username' ref={nameRef} value={undefined} onChange={handleChange} className='h-full w-[50%] rounded-full border-2 pl-3 pr-1 ' placeholder='Enter username' />
                    <span className="container  w-[50%] border-2 flex rounded-full py-0.5 rounded-l-full pl-3 gap-3 pr-2 items-center">
                        <input type="password" ref={pref} name="password" value={undefined} onChange={handleChange} className='h-[94%] w-[94%]  rounded-sm  px-1 focus:outline-none' placeholder='Enter password' />
                        <button className='pt-1' >
                            <img src="/assets/eye.png" ref={eyeref} onClick={handleEye} className=' h-5 w-5 fill-black stroke-black  ' alt="eye" style={{ filter: 'brightness(0) invert(0)' }} />
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
                    <tr className='text-center w-20  bg-blue-300 py-3 '>
                        <th className='text-center w-[40%] my-10'>Your Site</th>
                        <th className='w-[20%] text-center my-10'>Username</th>
                        <th className='w-[20%] text-center my-10'>Password</th>
                        <th className='w-[20%] text-center my-10'>Actions</th>
                    </tr>
                    </thead>
                    <tbody className='text-2xl   min-h-[50vh] h-[50vh] mt-3 overflow-scroll'>
                    {passwordArray.map((item, index) => {
                        return (<tr key={index} className='text-center  w-15 '>
                            {/*<a href="./components/navbar.jsx" target="__blank" className='hover:text-teal-600'><td className='h-10 text-lg w-fit'>{item.url}</td></a>*/}
                            <td className=' text-lg  h-[20%] max-h-auto w-[50%]'><a
                                target="_blank" href={item.url} className='hover:text-teal-600 ' onClick={() => (copyText(item.url))}>{item.url} </a>
                                <span className="material-icons cursor-pointer" onClick={() => { copyText(item.url) }}>
                                        content_copy
                                    </span></td>
                            <td className=' text-lg    w-[25%]'>{item.username}
                                <span className="material-icons h-4 w-4 cursor-pointer" onClick={() => (copyText(item.username))}>content_copy</span></td>
                            <td className=' text-lg    w-[25%] '>{item.password}
                                <span className="material-icons h-4 w-4 cursor-pointer" onClick={() => (copyText(item.password))}>content_copy</span></td>
                            <td className=' text-lg   w-[25%] '>
                                <div className="w-full h-full flex gap-3 pr-3">
                                    <span className="material-icons h-4 w-4 cursor-pointer" onClick={() => (editRecord(item,index))}>edit</span>
                                    <span className="material-icons h-7 w-7 cursor-pointer" onClick={() => { deleteRecord(item,index) }}>delete</span>
                                </div>
                            </td>
                        </tr>)
                    })}
                    </tbody>
                </table>)}

            </div>
        </div>
    )
}

export default Manager
