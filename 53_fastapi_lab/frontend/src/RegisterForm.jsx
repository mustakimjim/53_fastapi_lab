import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    cpassword: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
      message: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const { username, phone, email, password, cpassword } = formData;
    const newErrors = { ...errors };

    if (username.length <= 5) {
      newErrors.username = "Username must be more than 5 characters.";
      isValid = false;
    }

    if (password.length <= 6) {
      newErrors.password = "Password must be more than 6 characters.";
      isValid = false;
    }

    if (password !== cpassword) {
      newErrors.cpassword = "Passwords do not match.";
      isValid = false;
    }

    if (phone.length !== 11) {
      newErrors.phone = "Phone number must have exactly 11 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register", formData);
      console.log(response.data);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({
        ...errors,
        message: "Error registering user.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-y-8">
      <div className="flex flex-col items-center gap-y-2">
        <p className="text-3xl font-black text-xgray lg:text-4xl">
          Login to your account
        </p>
      </div>
      <div className="flex w-[360px] flex-col gap-y-8 lg:w-[400px]">
        <div className="flex flex-col gap-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-md border border-[#DED2D9] px-2 py-3 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xblue"
            />
            <p className="text-sm text-xred">{errors.username}</p>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-[#DED2D9] px-2 py-3 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xblue"
            />
            <p className="text-sm text-xred">{errors.email}</p>
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-[#DED2D9] px-2 py-3 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xblue"
            />
            <p className="text-sm text-xred">{errors.phone}</p>
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-[#DED2D9] px-2 py-3 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xblue"
            />
            <p className="text-sm text-xred">{errors.password}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <div>
              <input
                type="password"
                name="cpassword"
                placeholder="Confirm Password"
                value={formData.cpassword}
                onChange={handleChange}
                className="w-full rounded-md border border-[#DED2D9] px-2 py-3 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xblue"
              />
              <p className="text-sm text-xred">{errors.cpassword}</p>
            </div>

            <div className="flex justify-end">
              <button className="text-sm font-medium text-xblue">
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full p-3 text-lg font-medium text-white rounded-md bg-xblue hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;