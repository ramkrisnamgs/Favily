import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "../../components/common/form.jsx";
import { registerFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice/index";
import { useToast } from "@/hooks/use-toast.js";

const initialState = {
    userName: "",
    email: "",
    password: "",
};


function AuthRegister() {

    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();

    function onSubmit(event) {
        event.preventDefault();

        dispatch(registerUser(formData))      //npx shadcn@latest add toast

        .then( (data)=> {
            if(data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                })
                navigate("/auth/login");   // after successful registration, the user is redirected to the login page
            }  else {
                toast({
                    title: data?.payload?.message,
                    variant: "destructive",
                })
            }
        }).catch( (error) => {
            console.log("error in registration:", error);
        });
    }

    console.log(formData);

    return (
        <div className="mx-auto w-full max-w-md space-y-6 ">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Create New Account
                </h1>
                <p className="mt-2">

                    Already have an account?

                    <Link className="text-primary font-medium ml-2 hover:underline text-rose-600" to="/auth/login">
                        Login
                    </Link>
                </p>
            </div>

            {/* register form */}
            <CommonForm                            
                formControls={registerFormControls}    
                buttonText={"Sign Up"} 
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit} 
                isLoginForm={false}
            />
        </div>
    )
}

export default AuthRegister;
