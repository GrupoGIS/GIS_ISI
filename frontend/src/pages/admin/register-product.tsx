import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  registerProduct,
  fetchClients,
  registerDistributionPoint,
  RegisterProductData,
  RegisterDistributionPointData,
  Client,
} from '@/services/api'

import { Autocomplete } from '@/components/autocomplete'

const productSchema = yup
  .object({
    nome: yup.string().required('O nome do produto é obrigatório'),
    descricao: yup.string().required('A descrição é obrigatória'),
    preco: yup
      .number()
      .typeError('O preço deve ser um número')
      .required('O preço é obrigatório'),
    quantidade_estoque: yup
      .number()
      .typeError('A quantidade em estoque deve ser um número')
      .required('A quantidade em estoque é obrigatória'),
    fk_id_cliente: yup
      .number()
      .typeError('Selecione um cliente')
      .required('O cliente é obrigatório'),
    novoPontoDistribuicao: yup
      .object({
        nome: yup.string().required('O nome do ponto é obrigatório'),
        tipo: yup.string().required('O tipo é obrigatório'),
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
            path: 'novoPontoDistribuicao.endereco',
            message: 'Endereço é obrigatório',
          })
        }
        const missingFields = []
        if (!end_rua) missingFields.push('rua')
        if (!end_bairro) missingFields.push('bairro')
        if (!end_numero) missingFields.push('número')
        if (missingFields.length > 0) {
          return this.createError({
            path: 'novoPontoDistribuicao.endereco',
            message: `O endereço deve conter ${missingFields.join(', ')}`,
          })
        }
        return true
      })
      .nullable()
      .default(undefined),
  })
  .required()

interface NovoPontoDistribuicaoFormData {
  nome: string
  tipo: string
  end_rua?: string
  end_bairro?: string
  end_numero?: number
  endereco?: string // Campo virtual para exibir erros do endereço
}

interface RegisterProductFormData {
  nome: string
  descricao: string
  preco: number
  quantidade_estoque: number
  fk_id_cliente: number
  fk_id_ponto_distribuicao?: number
  novoPontoDistribuicao?: NovoPontoDistribuicaoFormData
}

const RegisterProduct: React.FC = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [showNewDistributionPointForm, setShowNewDistributionPointForm] =
    useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterProductFormData>({
    resolver: yupResolver(productSchema),
  })

  const onSubmit: SubmitHandler<RegisterProductFormData> = async (data) => {
    try {
      let fk_id_ponto_distribuicao = data.fk_id_ponto_distribuicao

      // Se estiver cadastrando um novo ponto de distribuição
      if (showNewDistributionPointForm && data.novoPontoDistribuicao) {
        const newPointData: RegisterDistributionPointData = {
          nome: data.novoPontoDistribuicao.nome,
          tipo: data.novoPontoDistribuicao.tipo,
          end_rua: data.novoPontoDistribuicao.end_rua || '',
          end_bairro: data.novoPontoDistribuicao.end_bairro || '',
          end_numero: data.novoPontoDistribuicao.end_numero || 0,
        }
        const response = await registerDistributionPoint(newPointData)
        fk_id_ponto_distribuicao = response.id
      }

      const productData: RegisterProductData = {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        quantidade_estoque: data.quantidade_estoque,
        fk_id_cliente: data.fk_id_cliente,
        fk_id_ponto_distribuicao: fk_id_ponto_distribuicao,
      }

      await registerProduct(productData)
      navigate('/adm')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // Buscar clientes ao montar o componente
    const fetchData = async () => {
      try {
        const clientsResponse = await fetchClients()
        setClients(clientsResponse)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      // Limpar campos anteriores
      setValue('novoPontoDistribuicao.end_rua', '')
      setValue('novoPontoDistribuicao.end_bairro', '')
      setValue('novoPontoDistribuicao.end_numero', undefined)

      place.address_components?.forEach((component) => {
        const types = component.types
        if (types.includes('route')) {
          setValue('novoPontoDistribuicao.end_rua', component.long_name)
        }
        if (
          types.includes('sublocality') ||
          types.includes('administrative_area_level_2')
        ) {
          setValue('novoPontoDistribuicao.end_bairro', component.long_name)
        }
        if (types.includes('street_number')) {
          setValue(
            'novoPontoDistribuicao.end_numero',
            Number(component.long_name)
          )
        }
      })
    } else {
      // Se nenhum lugar foi selecionado, limpar campos de endereço
      setValue('novoPontoDistribuicao.end_rua', '')
      setValue('novoPontoDistribuicao.end_bairro', '')
      setValue('novoPontoDistribuicao.end_numero', undefined)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl p-8 m-12">
        <h1 className="text-3xl font-bold mb-8">Registrar Produto</h1>
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
              <Label htmlFor="preco">Preço</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                {...register('preco')}
                className={`mt-1 ${errors.preco ? 'border-red-500' : ''}`}
              />
              {errors.preco && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.preco.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                {...register('descricao')}
                className={`mt-1 ${errors.descricao ? 'border-red-500' : ''}`}
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.descricao.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="quantidade_estoque">Quantidade em Estoque</Label>
              <Input
                id="quantidade_estoque"
                type="number"
                {...register('quantidade_estoque')}
                className={`mt-1 ${
                  errors.quantidade_estoque ? 'border-red-500' : ''
                }`}
              />
              {errors.quantidade_estoque && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.quantidade_estoque.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="fk_id_cliente">Cliente</Label>
              <Select
                id="fk_id_cliente"
                onValueChange={(value) =>
                  setValue('fk_id_cliente', Number(value))
                }
                value={
                  watch('fk_id_cliente') ? String(watch('fk_id_cliente')) : ''
                }
              >
                <SelectTrigger
                  className={`mt-1 ${errors.nome ? 'border-red-500' : ''}`}
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={'123'} value={String('teste')}>
                    Cliente Teste
                  </SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      {client.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fk_id_cliente && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fk_id_cliente.message}
                </p>
              )}
            </div>
            <Separator className="col-span-2" />
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-4">
                Ponto de Distribuição
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="novoPontoDistribuicao.nome">Nome</Label>
                  <Input
                    id="novoPontoDistribuicao.nome"
                    {...register('novoPontoDistribuicao.nome')}
                    className={`mt-1 ${
                      errors.novoPontoDistribuicao?.nome ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.novoPontoDistribuicao?.nome && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.novoPontoDistribuicao.nome?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="novoPontoDistribuicao.tipo">Tipo</Label>
                  <Input
                    id="novoPontoDistribuicao.tipo"
                    {...register('novoPontoDistribuicao.tipo')}
                    className={`mt-1 ${
                      errors.novoPontoDistribuicao?.tipo ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.novoPontoDistribuicao?.tipo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.novoPontoDistribuicao.tipo?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label>Endereço</Label>
                  <Autocomplete
                    className={`mt-1 ${
                      errors.novoPontoDistribuicao?.endereco
                        ? 'border-red-500'
                        : ''
                    }`}
                    onPlaceSelect={handlePlaceSelect}
                  />
                  {errors.novoPontoDistribuicao?.endereco && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.novoPontoDistribuicao.endereco.message}
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

export default RegisterProduct
