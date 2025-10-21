import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth.schema";
import type { RegisterFormData } from "../schemas/auth.schema";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
export function RegisterPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  async function handleRegister(data: RegisterFormData) {
    setSubmitError(null);
    try {
      const response = await api.post("/auth/register", data);
      const { access_token } = response.data;
      login(access_token);
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.status === 409) {
        setSubmitError("Este e-mail já está cadastrado.");
      } else {
        setSubmitError("Ocorreu um erro ao tentar registrar. Tente novamente.");
      }
    }
  }

  return (

     <div className="w-full max-w-md rounded-lg bg-gray-800 bg-opacity-90 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Criar Conta
        </h1>

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col gap-4"
        >
          <Input
            label="Nome Completo"
            type="text"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="E-mail"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Senha"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          {submitError && (
            <span className="text-sm text-red-400">{submitError}</span>
          )}

          <Button type="submit" isLoading={isSubmitting}>
            Registrar
          </Button>

          <p className="mt-2 text-center text-sm text-gray-400">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Faça login
            </Link>
          </p>
        </form>
      </div>
  );
}
