import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "../../components/common/form.jsx";
import { loginFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice/index.js";
import { toast } from "@/hooks/use-toast.js";
// import { useToast } from "@/components/ui/use-toast.js";


const initialState = {
    emailOrUsername: "",
    password: "",
};

function AuthLogin() {

    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const toast = useToast();

    function onSubmit(event) {
        event.preventDefault();
        
        const loginData = {
            emailOrUsername: formData.emailOrUsername.trim(),
            password: formData.password
        };

        console.log("Attempting login with:", {
            emailOrUsername: loginData.emailOrUsername,
            passwordLength: loginData.password.length,
        });
        
        dispatch(loginUser(loginData))
            .then(data => {
                console.log("Complete login response:", data);
                
                if(data?.payload?.success) {
                    toast({
                        description: "Login successful!",
                        variant: "success",
                    });
                } else {
                    console.error("Login failed details:", data?.payload);
                    toast({
                        description: data?.payload?.message || "Login failed",
                        variant: "destructive",
                    });
                }
            })
            .catch(error => {
                console.error("Login error details:", error);
                toast({
                    description: "An error occurred during login",
                    variant: "destructive",
                });
            });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6 ">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Sign In to Your Account
                </h1>
                <p className="mt-2">

                    Don't have an account?

                    <Link className="text-primary font-medium ml-2 hover:underline text-rose-600" to="/auth/register">
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* register form */}
            <CommonForm                            
                formControls={loginFormControls}    
                buttonText={"Sign In"} 
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit} 
                isLoginForm={true}
            />

                
        </div>
    )
}

export default AuthLogin;
