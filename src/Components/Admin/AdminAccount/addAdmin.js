import { React } from 'react'
import { NavLink } from 'react-router-dom';
import { ViewListIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
const initialValue = {
    name: '',
    username: '',
    email: '',
    phone: '',
    candidateGroup: '',
    address: '',
    role: '',
    imageUrl: '',

}

const AddUser = () => {

    const [user, setUser] = useState(initialValue);

    const { name, username, email, phone, candidateGroup, address, role, imageUrl } = user;
    let navigate = useNavigate();

    const onValueChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    const onFileChange = (event) => {
        setUser({
            ...user,
            profile: event.target.files[0],
        });
    };
    const addUserDetails = async (e) => {
        e.preventDefault();
        try {
            let config = {}
            config.header = { 'Content-Type': 'multipart/form-data' }
            const response = await axios.post('http://localhost:5000/api/v1/createAdmin', user, config);
            console.log(response.data); // log the response for debugging purposes
            // clear the form after submitting the data
            setUser({
                name: '',
                username: '',
                email: '',
                phone: '',
                candidateGroup: '',
                address: '',
                role: '',
                imageUrl: ''
            });
        } catch (error) {
            console.log(error);
        }
        navigate('/setting/Account');
    };

    return (
        <div>
            
                    {/* pagecontent */}
                    <div className="container mx-auto  px-40 pt-12">
                        <div className="flex relative justify-between items-center">
                            <NavLink to="/add" className="m-2 font-bold items-center">Add User</NavLink>
                            <NavLink to="/setting/Account"><button className='flex items-center bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-md'>
                                <ViewListIcon className="h-5 w-5" />
                                <h1 className='font-bold ml-2 py-1'>LIST</h1>
                            </button>
                            </NavLink>
                        </div>
                        <form className='border border-blue-300 shadow-lg px-10 pt-4 rounded-xl'>
                            <div className='flex'>
                                <div className='mb-4 w-1/2 mr-4'>
                                    <label htmlFor='name' className='block mb-1 font-medium'>Name</label>
                                    <input
                                        type='text'
                                        id='name'
                                        name='name'
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                        value={name}
                                        onChange={onValueChange}
                                    />
                                </div>
                                <div className='mb-4 w-1/2'>
                                    <label htmlFor='username' className='block mb-1 font-medium'>Username</label>
                                    <input
                                        type='text'
                                        id='username'
                                        name='username'
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                        value={username}
                                        onChange={onValueChange}
                                    />
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='mb-4 w-1/2 mr-4'>
                                    <label htmlFor='email' className='block mb-1 font-medium'>Email</label>
                                    <input
                                        type='text'
                                        id='email'
                                        name='email'
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                        value={email}
                                        onChange={onValueChange}
                                    />
                                </div>
                                <div className='mb-4 w-1/2'>
                                    <label htmlFor='phone' className='block mb-1 font-medium'>Phone</label>
                                    <input
                                        type='text'
                                        id='phone'
                                        name='phone'
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                        value={phone}
                                        onChange={onValueChange}
                                    />
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='mb-4 w-1/2 mr-4'>
                                    <label htmlFor='address' className='block mb-1 font-medium'>Address</label>
                                    <input
                                        type='text'
                                        id='address'
                                        name='address'
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                        value={address}
                                        onChange={onValueChange}
                                    />
                                </div>
                                <div className="mb-4 w-1/2 mr-4">
                                    <label htmlFor="role" className="block mb-1 font-medium"> Role </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={onValueChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                    >
                                        <option value="">--Select Role--</option>
                                        <option value="Admin">Admin</option>
                                        <option value="User">User</option>
                                    </select>
                                </div>
                            </div>
                            {role === "Admin" ? (
                                <div className='flex'>
                                    <div className="mb-4 w-1/2 mr-4">
                                        <label htmlFor="image" className="font-medium block mb-2">Choose a photo:</label>
                                        <input
                                            type="file"
                                            id="imageUrl"
                                            name="imageUrl"
                                            className="mb-4"
                                            onChange={onFileChange}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className='flex'>
                                    <div className="mb-4 w-1/2 mr-4">
                                        <label htmlFor="candidateGroup" className="block mb-1 font-medium"> Candidate Group </label>
                                        <select
                                            id="candidateGroup"
                                            name="candidateGroup"
                                            value={candidateGroup}
                                            onChange={onValueChange}
                                            className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                        >
                                            <option value="">Select Candidate Group</option>
                                            <option value="G-1">G-1</option>
                                            <option value="G-2">G-2</option>
                                            <option value="G-3">G-3</option>
                                            <option value="G-4">G-4</option>
                                        </select>
                                    </div>
                                    <div className="mb-4 w-1/2 mr-4">
                                        <label htmlFor="image" className="font-medium block mb-2">Choose a photo:</label>
                                        <input
                                            type="file"
                                            id="imageUrl"
                                            name="imageUrl"
                                            className="mb-4"
                                            onChange={onFileChange}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className='mb-4'>
                                <button type='button' className='w-full font-bold px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-700' onClick={addUserDetails}>
                                    Add Admin
                                </button>


                            </div>
                        </form>
                    </div>
                </div>
          
    )
}

export default AddUser