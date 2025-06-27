import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const LatestManagerBackup = () => {
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
            }
        }
        getPasswords()
    }, [])

    const AddPassword = async () => {
        if (!form.url || !form.username || !form.password) {
            toast.warning("Input field can't be empty");
            return;
        }
        let newPassword = form;
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
        else {
            eyeref.current.src = "http://localhost:5173/assets/eye.png";
            pref.current.type = "password";
        }
    }
    const copyText = (item) => {
        console.log("Hello " + item)
        navigator.clipboard.writeText(item).then(() => {
            toast('Copied to Clipboard!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }).catch((err) => {
            toast.warning(err)
        });
    }
    const deleteRecord = async  (ele,eleIdx) => {
        if (confirm('Are you sure you want to delete this user?')) {
            let filteredPasswordArray = passwordArray.filter((item,index) => {
                return (eleIdx !== index);
            })
            setPasswordArray(filteredPasswordArray)
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
                    toast.success("Record deleted successfully");
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
                    toast.success("Record edited successfully");
                }
            }catch(error){
                console.log(`Error in deleting record in order to edit: ${error}`)
            }
        }
        setForm({ url: ele.url, username: ele.username, password: ele.password })
        urlRef.current.value = ele.url;
        nameRef.current.value = ele.username;
        pref.current.value = ele.password;
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

            <div className="relative body lg:w-[80vw] w-[90vw] h-auto lg:mx-[10vw] mx-auto flex flex-col  gap-5   ">
                <div className='md:text-3xl text-xl md:font-extrabold font-semibold text-blue-950 text-center'>Web Password Manager</div>
                <div className="site h-10 w-full  ">
                    <input type="text" id="url" name='url' ref={urlRef} value={undefined} onChange={handleChange} className='h-full w-full rounded-full p-3 border-2 ' placeholder={window.innerWidth>768?"Enter URL":"URL"} />
                </div>
                <div className="user h-20 sm:h-10 w-full flex flex-col sm:flex-row    justify-between sm:items-center gap-3 sm:gap-1">
                    <input type="text" name='username' ref={nameRef} value={undefined} onChange={handleChange} className='h-full w-full sm:w-[50%] rounded-full border-2 pl-3 pr-1 ' placeholder={window.innerWidth>768?"Enter username":"username"} />
                    <span className="container h-full w-full sm:w-[50%] border-2 flex rounded-full py-0.5 rounded-l-full pl-3 gap-3 pr-2 items-center">
                        <input type="password" ref={pref} name="password" value={undefined} onChange={handleChange} className='h-[94%] w-[94%]  rounded-sm  px-1 focus:outline-none' placeholder={window.innerWidth>768?"Enter password":"password"} />
                        <button className='pt-1' >
                            <img src="/assets/eye.png" ref={eyeref} onClick={handleEye} className=' h-5 w-5 fill-black stroke-black  ' alt="eye" style={{ filter: 'brightness(0) invert(0)' }} />
                        </button>
                    </span>
                </div>
                <div className="addpwd h-12  mx-auto">
                    <button className=" h-full w-fit mx-auto rounded-full px-3 border-2 bg-blue-200 cursor-pointer flex text-lg font-medium items-center" onClick={AddPassword}>
                        <span className="material-icons">
                            add_box
                        </span>Add Password</button>
                </div>
                <div className="pwds text-xl font-semibold text-center">Your Passwords</div>
                {passwordArray.length === 0 ? (<div className='text-xl font-semibold text-start '>No Passwords to Display</div>) :
                    (<div className="w-full overflow-x-auto"><table className="w-full  table-auto md:w-full bg-blue-200  overflow-y-scroll">
                    <thead className='h-10 md:w-full w-screen '>
                    <tr className=' container md:w-20  bg-blue-300 py-3 '>
                        <th className='text-center w-[40%] my-10'>Your Site</th>
                        <th className='w-[20%] text-center my-10'>Username</th>
                        <th className='w-[20%] text-center my-10'>Password</th>
                        <th className='w-[20%] text-center my-10'>Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {passwordArray.map((item, index) => (
                        <tr key={index} className=" transition-colors text-center">
                            {/* URL Column with copy */}
                            <td className=" py-3 whitespace-nowrap text-md  font-semibold text-gray-900">
                                <div className="flex items-center justify-center gap-2">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-xs"
                                        onClick={() => copyText(item.url)}
                                    >
                                        {item.url}
                                    </a>
                                    <button
                                        onClick={() => copyText(item.url)}
                                        className="text-gray-700  p-1 rounded cursor-pointer"
                                        title="Copy URL"
                                    >
                                        <span className="material-icons text-base">content_copy</span>
                                    </button>
                                </div>
                            </td>

                            {/* Username Column */}
                            <td className="px-4 py-3 whitespace-nowrap text-lg text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="truncate max-w-xs">{item.username}</span>
                                    <button
                                        onClick={() => copyText(item.username)}
                                        className="text-gray-700 p-1 rounded cursor-pointer"
                                        title="Copy username"
                                    >
                                        <span className="material-icons text-base">content_copy</span>
                                    </button>
                                </div>
                            </td>

                            {/* Password Column */}
                            <td className="px-4 py-3 whitespace-nowrap text-lg text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="truncate max-w-xs">{item.password}</span>
                                    <button
                                        onClick={() => copyText(item.password)}
                                        className="text-gray-700 p-1 rounded "
                                        title="Copy password"
                                    >
                                        <span className="material-icons text-base">content_copy</span>
                                    </button>
                                </div>
                            </td>

                            {/* Actions Column */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => editRecord(item, index)}
                                        className="p-1 rounded text-black cursor-pointer"
                                        title="Edit"
                                    >
                                        <span className="material-icons text-base">edit</span>
                                    </button>
                                    <button
                                        onClick={() => deleteRecord(item, index)}
                                        className=" p-1 rounded text-black cursor-pointer"
                                        title="Delete"
                                    >
                                        <span className="material-icons text-base">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table></div>)}
            </div>
        </div>
    )
}

export default LatestManagerBackup
