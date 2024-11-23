import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

import { registerClient, RegisterClientData } from '@/services/api'

import { Autocomplete } from '@/components/autocomplete'
import { Separator } from '@/components/ui/separator'

const clientSchema = yup
  .object()
  .shape({
    nome: yup.string().required('O nome é obrigatório'),
    email: yup
      .string()
      .email('Email inválido')
      .required('O email é obrigatório'),
    telefone: yup.string().required('O telefone é obrigatório'),
    password: yup.string().required('A senha é obrigatória'),
    end_rua: yup.string(),
    end_bairro: yup.string(),
    end_numero: yup.number(),
    endereco: yup.string(), // Campo virtual para exibir erros do endereço
  })
  .test('address', '', function (value) {
    const { end_rua, end_bairro, end_numero } = value
    const hasAnyAddressField = end_rua || end_bairro || end_numero
    if (!hasAnyAddressField) {
      return this.createError({
        path: 'endereco',
        message: 'O endereço é obrigatório',
      })
    }
    const missingFields = []
    if (!end_rua) missingFields.push('rua')
    if (!end_bairro) missingFields.push('bairro')
    if (!end_numero) missingFields.push('número')
    if (missingFields.length > 0) {
      return this.createError({
        path: 'endereco',
        message: `O endereço deve conter ${missingFields.join(', ')}`,
      })
    }
    return true
  })

const RegisterClient: React.FC = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterClientData>({
    resolver: yupResolver(clientSchema),
  })

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      // Limpar campos anteriores
      setValue('end_rua', '')
      setValue('end_bairro', '')
      setValue('end_numero', null)

      place.address_components?.forEach((component) => {
        const types = component.types
        if (types.includes('route')) {
          setValue('end_rua', component.long_name)
        }
        if (
          types.includes('sublocality') ||
          types.includes('administrative_area_level_2')
        ) {
          setValue('end_bairro', component.long_name)
        }
        if (types.includes('street_number')) {
          setValue('end_numero', Number(component.long_name))
        }
      })
    } else {
      // Se nenhum lugar foi selecionado, limpar campos de endereço
      setValue('end_rua', '')
      setValue('end_bairro', '')
      setValue('end_numero', undefined)
    }
  }

  const onSubmit: SubmitHandler<RegisterClientData> = async (data) => {
    try {
      await registerClient(data)
      navigate('/adm')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl p-8 m-12">
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
              <Label>Endereço</Label>
              <Autocomplete
                className={`mt-1 ${errors.endereco ? 'border-red-500' : ''}`}
                onPlaceSelect={handlePlaceSelect}
              />
              {errors.endereco && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endereco.message}
                </p>
              )}
            </div>
            <Separator className="col-span-2" />
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
