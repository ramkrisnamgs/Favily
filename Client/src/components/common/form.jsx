import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isLoginForm,
  isBtnDisabled,
}) => {
  const [showPassword, setShowPassword] = useState({});

  const renderInputsByComponentType = (getControlItem) => {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        if (getControlItem.type === "password") {
          element = (
            <div className="relative">
              <Input
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={showPassword[getControlItem.name] ? "text" : "password"}
                value={value}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    [getControlItem.name]: !prev[getControlItem.name],
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword[getControlItem.name] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          );
        } else {
          element = (
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
          );
        }
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>

            <SelectContent>
              {
                // check if options are available and render them
                getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null
              }
            </SelectContent>
          </Select>
        );
        break;

      // render textarea type
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      // render checkbox type
      case "checkbox":
        element = (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={getControlItem.name}
              checked={value || false}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: checked,
                })
              }
            />
            <label
              htmlFor={getControlItem.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {getControlItem.label}
            </label>
          </div>
        );
        break;

      // render default type
      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  };

  return (
    // form component
    <form onSubmit={onSubmit}>
      {" "}
      {/* onSubmit is the function that will be called when the form is submitted */}
      <div className="flex flex-col gap-3">
        {
          // map through the form controls
          formControls.map((controlItem) => (
            <div className="grid w-full gap-1.5" key={controlItem.name}>
              {controlItem.componentType !== "checkbox" && (
                <Label className="mb-1">{controlItem.label}</Label>
              )}
              {
                renderInputsByComponentType(controlItem) // render the input by component type
              }
            </div>
          ))
        }
      </div>
      {/* Only show this section if isLoginForm is true */}
      {isLoginForm && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe || false}
              onCheckedChange={(checked) =>
                setFormData({
                  // onCheckedChange is the function that will be called when the checkbox is checked or unchecked
                  ...formData,
                  rememberMe: checked, // ...formData is the current form data, rememberMe is the name of the checkbox, checked is the value of the checkbox
                })
              }
            />
            <label
              htmlFor="rememberMe" // htmlFor is the id of the checkbox
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>{" "}
            {/* label is the text of the checkbox */}
          </div>
          <a
            href="/forgot-password"
            className="text-sm text-rose-600 hover:text-rose-700"
          >
            Forgot Password?
          </a>
        </div>
      )}
      {/* submit button */}
      <Button
        disabled={isBtnDisabled}
        type="submit"
        className={`mt-7 w-full ${isBtnDisabled ? 'bg-rose-400' : 'bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600'} hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;

//className="mt-7 w-full text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"

//className="mt-7 w-full bg-rose-600 hover:bg-rose-700 text-white"

/*
This is a reusable form component that:

1. Takes form controls configuration as props to dynamically render form fields
2. Handles form state management and submission
3. Supports different input types through renderInputsByComponentType:
   - Currently handles basic input fields
   - Can be extended for other input types
4. Key Features:
   - Dynamic form generation based on config
   - Controlled form inputs with state management
   - Customizable submit button text
   - Consistent styling with Label and Input components
   - Flexible layout with responsive grid
5. Used across the app for:
   - Login form
   - Registration form 
   - And other form-based features
*/

/*
Explanation of each element/line:

1. <div className="flex flex-col gap-3">: A container div with flexbox layout, arranged in a column with a gap of 3 units between items.
2. formControls.map(controlItem => { ... }): Iterates over the form controls array to dynamically generate form fields.
3. <div className="grid w-full gap-1.5" key={controlItem.name}>: A grid container for each form control with full width and a gap of 1.5 units.
4. <Label className="mb-1">: A label component with a bottom margin of 1 unit.
5. {controlItem.label}: Displays the label text for the form control.
6. renderInputsByComponentType(controlItem): A function that renders the appropriate input component based on the control type.
7. <Button className="mt-2 w-full" type="submit">: A button component with a top margin of 2 units and full width, used for form submission.
8. {buttonText || "Submit"}: Displays the button text, defaulting to "Submit" if no custom text is provided.
9. export default CommonForm;: Exports the CommonForm component as the default export of the module.
*/

// write a comment explaining the purpose of the form component

/*
The CommonForm component is a reusable form component that:
1. Takes form controls configuration as props to dynamically render form fields
2. Handles form state management and submission
3. Supports different input types through renderInputsByComponentType
4. Key Features:
    - Dynamic form generation based on config
    - Controlled form inputs with state management
    - Customizable submit button text
    - Consistent styling with Label and Input components
    - Flexible layout with responsive grid
5. Used across the app for:
    - Login form
    - Registration form 
    - And other form-based features
6. The component is designed to be flexible and can be extended to handle more input types and form configurations as needed.
*/

// what are the props of the form component?

/*
The props of the form component are:
1. formControls: An array of objects that define the form fields, including their types, labels, names, and other properties.
2. formData: An object that stores the current values of the form fields.
3. setFormData: A function that updates the form data when the user interacts with the form fields.
4. onSubmit: A function that handles the form submission event.
5. buttonText: A string that defines the text of the submit button.
6. isLoginForm: A boolean that determines if the form is a login form.
7. isRegisterForm: A boolean that determines if the form is a register form.
8. isForgotPasswordForm: A boolean that determines if the form is a forgot password form.
9. isResetPasswordForm: A boolean that determines if the form is a reset password form.
10. isChangePasswordForm: A boolean that determines if the form is a change password form.
11. isAddEditForm: A boolean that determines if the form is an add/edit form.
12. isDeleteForm: A boolean that determines if the form is a delete form.
*/

// what are the questions that can be asked from this form component in interview?

/*
1. How does this form component handle dynamic form generation based on configuration?
2. Can you explain how the form state is managed using formData and setFormData?
3. How does the renderInputsByComponentType function work, and what is its purpose in rendering different input types?
4. Describe how the form component handles form submission and what the onSubmit function does.
5. How does the component handle conditional rendering for different form types (login, register, forgot password, reset password, change password, add/edit, delete)?
*/

// answer to the questions

/*
1. The form component handles dynamic form generation based on configuration by iterating over the formControls array and rendering each control item.
2. The form state is managed using formData and setFormData. formData is an object that stores the current values of the form fields, and setFormData is a function that updates the form data when the user interacts with the form fields.
3. The renderInputsByComponentType function works by switching on the componentType property of each control item and rendering the appropriate input component.
4. The form component handles form submission by calling the onSubmit function when the form is submitted. The onSubmit function typically performs validation and sends the form data to the server.
5. The component handles conditional rendering for different form types by checking the isLoginForm, isRegisterForm, isForgotPasswordForm, isResetPasswordForm, isChangePasswordForm, isAddEditForm, and isDeleteForm props.
*/
