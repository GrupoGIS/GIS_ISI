import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Autocomplete } from '@/components/autocomplete'

import {
  registerVehicle,
  RegisterVehicleData,
  RegisterDriverData,
  Driver,
} from '@/services/api'

const vehicleSchema = yup
  .object({
    modelo: yup.string().required('O modelo é obrigatório'),
    placa: yup.string().required('A placa é obrigatória'),
    capacidade: yup
      .number()
      .typeError('A capacidade deve ser um número')
      .required('A capacidade é obrigatória'),
    motorista: yup
      .object({
        nome: yup.string().required('O nome é obrigatório'),
        habilitacao: yup.string().required('A habilitação é obrigatória'),
        email: yup
          .string()
          .email('Email inválido')
          .required('O email é obrigatório'),
        senha: yup.string().required('A senha é obrigatória'),
        end_rua: yup.string(),
        end_bairro: yup.string(),
        end_numero: yup.number(),
        endereco: yup.string(), // Campo virtual para exibir erros do endereço
      })
      .test('address', '', function (value) {
        const { end_rua, end_bairro, end_numero } = value || {}
        const hasAnyAddressField = end_rua || end_bairro || end_numero
        if (!hasAnyAddressField) {
          return this.createError({
            path: 'motorista.endereco',
            message: 'Endereço é obrigatório',
          })
        }
        const missingFields = []
        if (!end_rua) missingFields.push('rua')
        if (!end_bairro) missingFields.push('bairro')
        if (!end_numero) missingFields.push('número')
        if (missingFields.length > 0) {
          return this.createError({
            path: 'motorista.endereco',
            message: `O endereço deve conter ${missingFields.join(', ')}`,
          })
        }
        return true
      })
      .required(),
  })
  .required()

interface MotoristaFormData {
  nome: string
  habilitacao: string
  email: string
  senha: string
  end_rua?: string
  end_bairro?: string
  end_numero?: number
  endereco?: string // Campo virtual para exibir erros do endereço
}

interface RegisterVehicleFormData {
  modelo: string
  placa: string
  capacidade: number
  motorista: MotoristaFormData
}

const RegisterVehicle: React.FC = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterVehicleFormData>({
    resolver: yupResolver(vehicleSchema),
  })

  const onSubmit: SubmitHandler<RegisterVehicleFormData> = async (data) => {
    try {
      // Registrar o motorista
      const driverData: RegisterDriverData = {
        nome: data.motorista.nome,
        habilitacao: data.motorista.habilitacao,
        email: data.motorista.email,
        senha: data.motorista.senha,
        end_rua: data.motorista.end_rua || '',
        end_bairro: data.motorista.end_bairro || '',
        end_numero: data.motorista.end_numero || 0,
      }
      const registeredDriver = await registerVehicle(driverData)

      // Registrar o veículo com o ID do motorista
      const vehicleData: RegisterVehicleData = {
        modelo: data.modelo,
        placa: data.placa,
        capacidade: data.capacidade,
        fk_id_motorista: registeredDriver.id,
      }

      await registerVehicle(vehicleData)
      navigate('/adm')
    } catch (error) {
      console.error(error)
    }
  }

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      // Limpar campos anteriores
      setValue('motorista.end_rua', '')
      setValue('motorista.end_bairro', '')
      setValue('motorista.end_numero', undefined)

      place.address_components?.forEach((component) => {
        const types = component.types
        if (types.includes('route')) {
          setValue('motorista.end_rua', component.long_name)
        }
        if (
          types.includes('sublocality') ||
          types.includes('administrative_area_level_2')
        ) {
          setValue('motorista.end_bairro', component.long_name)
        }
        if (types.includes('street_number')) {
          setValue('motorista.end_numero', Number(component.long_name))
        }
      })
    } else {
      // Se nenhum lugar foi selecionado, limpar campos de endereço
      setValue('motorista.end_rua', '')
      setValue('motorista.end_bairro', '')
      setValue('motorista.end_numero', undefined)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl p-8 m-12">
        <h1 className="text-3xl font-bold mb-8">Cadastrar Veículo</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                {...register('modelo')}
                className={`mt-1 ${errors.modelo ? 'border-red-500' : ''}`}
              />
              {errors.modelo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.modelo.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="placa">Placa</Label>
              <Input
                id="placa"
                {...register('placa')}
                className={`mt-1 ${errors.placa ? 'border-red-500' : ''}`}
              />
              {errors.placa && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.placa.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                id="capacidade"
                type="number"
                {...register('capacidade')}
                className={`mt-1 ${errors.capacidade ? 'border-red-500' : ''}`}
              />
              {errors.capacidade && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.capacidade.message}
                </p>
              )}
            </div>
            <Separator className="col-span-2" />
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-4">Motorista</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="motorista.nome">Nome</Label>
                  <Input
                    id="motorista.nome"
                    {...register('motorista.nome')}
                    className={`mt-1 ${
                      errors.motorista?.nome ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.motorista?.nome && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.motorista.nome?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="motorista.habilitacao">Habilitação</Label>
                  <Input
                    id="motorista.habilitacao"
                    {...register('motorista.habilitacao')}
                    className={`mt-1 ${
                      errors.motorista?.habilitacao ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.motorista?.habilitacao && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.motorista.habilitacao?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label>Endereço</Label>
                  <Autocomplete
                    className={`mt-1 ${
                      errors.motorista?.endereco ? 'border-red-500' : ''
                    }`}
                    onPlaceSelect={handlePlaceSelect}
                  />
                  {errors.motorista?.endereco && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.motorista.endereco.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="motorista.email">Email</Label>
                  <Input
                    id="motorista.email"
                    type="email"
                    {...register('motorista.email')}
                    className={`mt-1 ${
                      errors.motorista?.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.motorista?.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.motorista.email?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="motorista.senha">Senha</Label>
                  <Input
                    id="motorista.senha"
                    type="password"
                    {...register('motorista.senha')}
                    className={`mt-1 ${
                      errors.motorista?.senha ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.motorista?.senha && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.motorista.senha?.message}
                    </p>
                  )}
                </div>
              </div>
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

export default RegisterVehicle
