import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LogInForm from "./components/Auth/LoginForm";
import SignUpForm from "./components/Auth/SignUpForm";
import HomePage from "./pages/HomePage";
import Resources from "./pages/Resources";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signOut } from "./redux/slices/auth";
import { getPosts } from "./redux/slices/blog";
import { getMessages } from "./redux/slices/message";
import { getResumes } from "./redux/slices/resume";
import { updateUser } from "./redux/slices/auth";

import { useEffect } from "react";

const App = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		try {
			const user = localStorage.getItem("user");
			if (user) dispatch(updateUser(JSON.parse(user).user));
		} catch (erro) {}
	}, []);
	return (
		<>
			<Routes>
				<Route path="/login" element={<LogInForm />} />
				<Route path="/register" element={<SignUpForm />} />
				<Route path="/" element={<HomePage />} />
				<Route path="/resources" element={<Resources />} />
			</Routes>
			<Navbar />
			<Toaster position="top-center" />
			<button className="mt-16" onClick={(e) => dispatch(getPosts())}>
				click
			</button>
		</>
	);
};
export default App;
