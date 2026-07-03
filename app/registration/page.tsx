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
import { useRouter } from "next/navigation";
import { useState } from "react";

const fields: FormField[] = [
  {
    name: "firstName",
    label: "First name",
    type: "text",
    placeholder: "Enter your first name",
  },
  {
    name: "middleName",
    label: "Middle name",
    type: "text",
    placeholder: "Enter your middle name",
  },
  {
    name: "lastName",
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
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAccount = async () => {
    startLoading("Creating user...");
    try {
      setLoading(true);
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
    }
  };

  return (
    <div className="div-panel animate-float-up">
      <div className="login-card">
        <h2 className="login-heading">Let's create your account first!</h2>

        <div className="login-form">
          <Form
            fields={fields}
            values={values}
            onChange={handleChange}
            // onSubmit={handleSubmitEvent}
            submitText="Login"
            footer={
              <Button
                className="btn-primary w-full"
                onClick={handleCreateAccount}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
