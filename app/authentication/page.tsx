"use client";

import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useLoadingStore } from "@/lib/stores/useLoadingStore";
import { useNotificationStore } from "@/lib/stores/useNotificationStore";
import { login, RegisterPayload, registerUser } from "@/services/user.service";
// import { login, registerUser } from "@/services/auth.service";
import Button from "@/ui/Button";
import Form, { FormField } from "@/ui/Form";
import InputField from "@/ui/InputField";
import Modal from "@/ui/Modal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fields: FormField[] = [
  {
    name: "first_name",
    label: "First name",
    type: "text",
    placeholder: "Enter your first name",
  },
  {
    name: "middle_name",
    label: "Middle name",
    type: "text",
    placeholder: "Enter your middle name",
  },
  {
    name: "last_name",
    label: "Last name",
    type: "text",
    placeholder: "Enter your last name",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter your email",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore.getState().setUser;
  const [values, setValues] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const { startLoading, stopLoading } = useLoadingStore();
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );
  const [isRegistration, setIsRegistration] = useState(false);
  const [isAccountCreation, setIsAccountCreation] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEvent = async () => {
    startLoading("Creating user...");
    try {
      setLoading(true);
      const data = await registerUser(values as RegisterPayload);
      showNotification("Success", "Registered successfully.", "success");
    } catch (error: any) {
      console.error("Error adding guest:", error);
      showNotification(
        "Error",
        error.response?.data?.message || "Failed to register",
        "error",
      );
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleLogin = async () => {
    startLoading("Logging in...");
    try {
      setLoading(true);
      setError("");

      const data = await login({ email, password });

      console.log("Login successful:", data);

      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

        setUser(data.user);

        showNotification("Success", "Logged in successfully.", "success");
        router.push("/documents");
      } else {
        setError("No token received");
        console.error("No token received");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      console.log("error");
      showNotification("Error", "Failed to login.", "error");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    for (const field of fields) {
      const value = values[field.name as keyof typeof values];

      if (!value || value.toString().trim() === "") {
        showNotification("Error", `${field.label} is required`, "error");
        return false;
      }

      if (field.name === "email" && !emailRegex.test(value)) {
        showNotification(
          "Error",
          "Please enter a valid email address",
          "error",
        );
        return false;
      }
    }

    return true;
  };
  const handleCreateAccount = async () => {
    startLoading("Creating user...");

    if (password !== confirmPassword) {
      showNotification("Error", "Password does not match.", "error");
      setPassword("");
    }

    try {
      setLoading(true);
      // set password
      setValues((prev) => ({
        ...prev,
        password: password,
      }));
      console.log("values:", values);
      const data = await registerUser(values as RegisterPayload);
      if (data)
        showNotification("Success", "Registered successfully.", "success");
    } catch (error: any) {
      console.error("Error adding guest:", error);
      showNotification(
        "Error",
        error.response?.data?.message || "Failed to register",
        "error",
      );
    } finally {
      setLoading(false);
      stopLoading();
      window.location.reload();
    }
  };

  const handleProceedRegistration = () => {
    // if (!validateForm()) return;

    setIsRegistration(true);
  };

  return (
    <div className="div-panel animate-float-up">
      {/* login */}
      <div
        className={`${isAccountCreation || isRegistration ? "hidden" : "block"} login-card`}
      >
        <h2 className="login-heading">Sign in</h2>

        <div className="login-form">
          <InputField
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            type="password"
            placeholder="Enter your password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="btn-primary w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          {/* <Button
            className="btn-primary w-full"
            onClick={() => {
              setIsRegistration(true);
            }}
            disabled={loading}
          >
            Create Account
          </Button> */}
          <p className="text-sm text-gray-600">
            Don't have an account yet?{" "}
            <Button
              type="button"
              onClick={() => {
                setIsRegistration(true);
              }}
              className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Register here
            </Button>
          </p>
        </div>
      </div>
      {/* registration */}
      <div
        className={`${isRegistration ? "block" : "hidden"} login-card anime-float-left`}
      >
        <h2 className="login-heading">Tell us first about yourself first!</h2>

        <div className="login-form">
          <Form fields={fields} values={values} onChange={handleChange} />
          <Button
            className="btn-primary w-full"
            onClick={() => {
              if (!validateForm()) return;
              setIsAccountCreation(true);
              setIsRegistration(false);
            }}
            disabled={loading}
            icon={<ArrowRight />}
            iconPosition="right"
          >
            Next
          </Button>
        </div>
      </div>
      {/* account creation */}
      <div
        className={`${isAccountCreation ? "block" : "hidden"} login-card anime-float-left`}
      >
        <h2 className="login-heading">Let's set your password!</h2>

        <div className="login-form">
          <InputField
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={values.email}
            disabled={!isAccountCreation}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            type="password"
            placeholder="Enter your password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Confirm your password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            className="btn-primary w-full"
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
