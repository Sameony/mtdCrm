import { useEffect, useState } from "react"
import { authApis } from "../../config/authApi"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { AiOutlineLoading } from "react-icons/ai"

const Login = () => {
    const [userDetails, setUserDetails] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const addUser = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
          "email": "mtdEmail@gmail.com",
          "password": "myPassword"
        });
    
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
    
        fetch("http://3.140.131.180:3000/addUser", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      }

    const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        if (sessionStorage.getItem("user"))
            navigate("/")
    }, [])

    const onFormSubmit = async () => {
        setLoading(true)
        try {
            let res = await authApis.postLogin(userDetails)
            if (res.data.status) {
                // console.log(res.data)
                toast.success("Logged in successfully")
                sessionStorage.setItem("user", res.data.data)
                navigate("/")
            } else {
                toast.error(res.data.err)
                // toast.error(res)
            }
            // console.log(res)

        } catch (error) {

            toast.error(error?.toString() ?? "Something went wrong")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    // console.log(userDetails)
    return (
        <>
            
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-10"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={(e) => onChangeField(e)}
                                autoComplete="email"
                                required
                                className="block w-full px-2 rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={(e) => onChangeField(e)}
                                required
                                className="block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => onFormSubmit()}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5  font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                        >
                            {loading && <AiOutlineLoading className="animate-spin h-5 w-5 mr-4" />} Sign in
                        </button>
                    </div>
                    <button onClick={()=>addUser()} className="opacity-0 ">add user</button>
                </div>
            </div>
        </>
    )
}

export default Login