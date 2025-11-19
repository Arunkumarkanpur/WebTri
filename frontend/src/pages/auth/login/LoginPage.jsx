import { useState } from "react";
import { Link } from "react-router-dom";

//import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
const queryClient = useQueryClient();

	const {mutate:loginMutation, isPending, isError, error} = useMutation({
		mutationFn: async ({username, password}) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["authUser"]});
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	
	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<img src="W.png" height={500} width={400} alt="" />
				{/* <XSvg className='lg:w-2/3 fill-white' /> */}
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					{/* <XSvg className='w-24 lg:hidden fill-white' /> */}
					<h1 className='text-4xl font-extrabold text-sky-400'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2 text-white'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow rounded-md bg-black p-2'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2 text-white'>
						<MdPassword />
						<input
							type='password'
							className='grow rounded-md bg-black p-2'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full hover:bg-green-600 bg-green-500 text-white p-1 font-semibold'>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full hover:bg-sky-500 text-white btn-outline w-full p-1'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;