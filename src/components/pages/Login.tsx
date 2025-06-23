import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Loader from "../ui/loader";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login, loading, session } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(formData.email, formData.password).then(() => {
      navigate("/");
    });
  };

  useEffect(() => {
    if (session) navigate("/");
  }, [session]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-zinc-100">
      <form
        className="bg-white p-10 rounded-md shadow border w-96"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl !font-bold text-gray-800 mb-4">Đăng nhập</h1>
        <div className="space-y-2">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </Label>
            <Input
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </Label>
            <div className="relative">
              <Input
                placeholder="12345"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        <Button className="w-full mt-4" disabled={loading} type="submit">
          {loading ? <Loader /> : "Đăng nhập"}
        </Button>
      </form>
    </div>
  );
}

export default Login;
