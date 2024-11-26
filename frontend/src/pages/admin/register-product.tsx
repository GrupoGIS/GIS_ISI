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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DistributionPoint,
  fetchDistributionPoints,
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
    // Make conditionally required fields optional
    fk_id_ponto_distribuicao: yup.number(),
    novoPontoDistribuicao: yup.object().shape({
      nome: yup.string(),
      tipo: yup.string(),
      end_rua: yup.string(),
      end_bairro: yup.string(),
      end_numero: yup.number(),
      endereco: yup.string(),
    }),
  })
  .required()

interface NovoPontoDistribuicaoFormData {
  nome: string
  tipo: string
  end_rua?: string
  end_bairro?: string
  end_numero?: number
  endereco?: string // Virtual field for displaying address errors
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
  const [distributionPoints, setDistributionPoints] = useState<
    DistributionPoint[]
  >([])
  const [selectedTab, setSelectedTab] = useState('select')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterProductFormData>({
    resolver: yupResolver(productSchema),
  })

  const onSubmit: SubmitHandler<RegisterProductFormData> = async (data) => {
    try {
      // Manually validate required fields based on selectedTab
      if (selectedTab === 'select') {
        if (!data.fk_id_ponto_distribuicao) {
          setError('fk_id_ponto_distribuicao', {
            type: 'manual',
            message: 'O ponto de distribuição é obrigatório',
          })
          return
        }
      } else if (selectedTab === 'new') {
        if (!data.novoPontoDistribuicao?.nome) {
          setError('novoPontoDistribuicao.nome', {
            type: 'manual',
            message: 'O nome é obrigatório',
          })
        }
        if (!data.novoPontoDistribuicao?.tipo) {
          setError('novoPontoDistribuicao.tipo', {
            type: 'manual',
            message: 'O tipo é obrigatório',
          })
        }
        // Validate address fields
        const { end_rua, end_bairro, end_numero } =
          data.novoPontoDistribuicao || {}
        if (!end_rua || !end_bairro || !end_numero) {
          setError('novoPontoDistribuicao.endereco', {
            type: 'manual',
            message: 'O endereço deve conter rua, bairro e número',
          })
        }
        // Check if any errors were set
        if (Object.keys(errors).length > 0) {
          return
        }
      }

      // Proceed with form submission
      let fk_id_ponto_distribuicao = data.fk_id_ponto_distribuicao

      // Register new distribution point if needed
      if (selectedTab === 'new' && data.novoPontoDistribuicao) {
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
    // Fetch clients and distribution points when component mounts
    const fetchData = async () => {
      try {
        const [clientsResponse, distributionPointsResponse] = await Promise.all(
          [fetchClients(), fetchDistributionPoints()]
        )
        setClients(clientsResponse)
        setDistributionPoints(distributionPointsResponse)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      // Clear previous address fields
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
      // Clear address fields if no place selected
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
            {/* Product fields */}
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
                onValueChange={(value) =>
                  setValue('fk_id_cliente', Number(value))
                }
                value={
                  watch('fk_id_cliente') ? String(watch('fk_id_cliente')) : ''
                }
              >
                <SelectTrigger
                  className={`mt-1 ${
                    errors.fk_id_cliente ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
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
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-4">
                Ponto de Distribuição
              </h2>
              <Tabs
                value={selectedTab}
                onValueChange={(value) => {
                  setSelectedTab(value)
                  // Clear values when tab changes
                  if (value === 'select') {
                    setValue('fk_id_ponto_distribuicao', undefined)
                    setValue('novoPontoDistribuicao', undefined)
                  } else if (value === 'new') {
                    setValue('fk_id_ponto_distribuicao', undefined)
                    setValue('novoPontoDistribuicao', {})
                  }
                }}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="select" className="w-full">
                    Existente
                  </TabsTrigger>
                  <TabsTrigger value="new" className="w-full">
                    Novo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="select">
                  <div>
                    <Select
                      onValueChange={(value) =>
                        setValue('fk_id_ponto_distribuicao', Number(value))
                      }
                      value={
                        watch('fk_id_ponto_distribuicao')
                          ? String(watch('fk_id_ponto_distribuicao'))
                          : ''
                      }
                    >
                      <SelectTrigger
                        className={`mt-1 ${
                          errors.fk_id_ponto_distribuicao
                            ? 'border-red-500'
                            : ''
                        }`}
                      >
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {distributionPoints.map((distributionPoint) => (
                          <SelectItem
                            key={distributionPoint.id}
                            value={String(distributionPoint.id)}
                          >
                            {distributionPoint.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fk_id_ponto_distribuicao && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fk_id_ponto_distribuicao.message}
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="new">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="novoPontoDistribuicao.nome">Nome</Label>
                      <Input
                        id="novoPontoDistribuicao.nome"
                        {...register('novoPontoDistribuicao.nome')}
                        className={`mt-1 ${
                          errors.novoPontoDistribuicao?.nome
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                      {errors.novoPontoDistribuicao?.nome && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.novoPontoDistribuicao.nome.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="novoPontoDistribuicao.tipo">Tipo</Label>
                      <Input
                        id="novoPontoDistribuicao.tipo"
                        {...register('novoPontoDistribuicao.tipo')}
                        className={`mt-1 ${
                          errors.novoPontoDistribuicao?.tipo
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                      {errors.novoPontoDistribuicao?.tipo && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.novoPontoDistribuicao.tipo.message}
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
                </TabsContent>
              </Tabs>
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
