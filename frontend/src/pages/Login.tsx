import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/auth.schema';
import type { LoginFormData } from '../schemas/auth.schema';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export function LoginPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), 
  });


  async function handleLogin(data: LoginFormData) {
    setSubmitError(null); // Limpa erros antigos
    try {
      //Envia os dados do formulário para a API
      const response = await api.post('/auth/login', data);
      
      //Pega o token da resposta
      const { access_token } = response.data;
      
      //Chama a função login
      login(access_token);
      
      //Redireciona o usuário para o Dashboard
      navigate('/');
    } catch (error) {
      //Se o back-end retornar um erro (ex: 401 Credenciais inválidas)
      console.error(error);
      setSubmitError('E-mail ou senha inválidos.');
    }
  }

 return (
    <div className="w-full max-w-md rounded-lg bg-gray-800 bg-opacity-90 p-8 shadow-xl backdrop-blur-sm">
      <h1 className="mb-6 text-center text-3xl font-bold text-white">
        Login
      </h1>
      <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Senha"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        {submitError && (
          <span className="text-sm text-red-400">{submitError}</span>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          Entrar
        </Button>
        <p className="mt-2 text-center text-sm text-gray-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-blue-500 hover:text-blue-400">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}