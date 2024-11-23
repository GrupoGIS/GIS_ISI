import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

import { registerClient } from '@/services/api'

interface ClientFormInputs {
  nome: string
  email: string
  telefone: string
  endereco: string
  password: string
}

const clientSchema = yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
  telefone: yup.string().required('O telefone é obrigatório'),
  endereco: yup.string().required('O endereço é obrigatório'),
  password: yup.string().required('A senha é obrigatória'),
})

const RegisterClient: React.FC = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormInputs>({
    resolver: yupResolver(clientSchema),
  })

  const onSubmit: SubmitHandler<ClientFormInputs> = async (data) => {
    try {
      await registerClient(data)
      navigate('/adm')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold mb-8">Registrar cliente</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                {...register('nome')}
                className={`mt-1 ${errors.nome ? 'border-red-500' : ''}`}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nome.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                {...register('telefone')}
                className={`mt-1 ${errors.telefone ? 'border-red-500' : ''}`}
              />
              {errors.telefone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.telefone.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                {...register('endereco')}
                className={`mt-1 ${errors.endereco ? 'border-red-500' : ''}`}
              />
              {errors.endereco && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endereco.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="mt-8 w-full">
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default RegisterClient
