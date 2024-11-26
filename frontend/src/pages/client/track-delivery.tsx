import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, User, Package, MapPin, Warehouse } from 'lucide-react'
import DeliveryMap from '@/components/delivery-map'
import { Button } from '@/components/ui/button'

const TrackDelivery: React.FC = () => {
  const [routeIndex, setRouteIndex] = useState(0)
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<{
    summary: string
    distance: string
    duration: string
  } | null>(null)

  const setRouteInfo = (
    routes: google.maps.DirectionsRoute[],
    selectedRoute: google.maps.DirectionsRoute
  ) => {
    setRoutes(routes)
    const leg = selectedRoute.legs[0]
    setSelectedRoute({
      summary: selectedRoute.summary,
      distance: leg?.distance?.text || '',
      duration: leg?.duration?.text || '',
    })
  }

  const delivery = {
    id: 1,
    vehicle: {
      id: 1,
      modelo: 'Volvo FH16',
      placa: 'ABC-1234',
      capacidade: 25,
    },
    driver: {
      id: 1,
      nome: 'João Silva',
      habilitacao: 'B1234567',
      email: 'joao.silva@example.com',
    },
    product: {
      id: 1,
      nome: 'Produto A',
      preco: 150.0,
      descricao:
        'Este é um produto de alta qualidade, fabricado com os melhores materiais disponíveis no mercado. Ideal para atender às necessidades dos clientes mais exigentes, oferecendo durabilidade e desempenho superiores.',
    },
    destino: 'Avenida Nações Unidas, 1, Bauru, SP',
    origem: 'São paulo, SP',
    delivery: {
      id: 1,
      status: 'Em trânsito',
      is_delivered: false,
    },
    rota: {
      origin: 'São paulo, SP',
      destination: 'Avenida Nações Unidas, 1, Bauru, SP',
    },
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 px-8 gap-6">
      {/* Map Section */}
      <div className="w-full h-96 lg:h-auto max-h-screen flex-1 lg:sticky lg:top-0 lg:py-8">
        <DeliveryMap
          delivery={delivery}
          routeIndex={routeIndex}
          setRouteInfo={setRouteInfo}
        />
      </div>

      {/* Information Panel */}
      <div className="lg:w-[600px] w-full overflow-y-auto py-8">
        <h1 className="text-3xl font-bold mb-6 inline-flex gap-4 items-end">
          Detalhes da entrega
          <Badge
            variant={
              delivery.delivery.status === 'Entregue'
                ? 'success'
                : delivery.delivery.status === 'Em trânsito'
                ? 'warning'
                : 'secondary'
            }
            className="mb-1"
          >
            {delivery.delivery.status}
          </Badge>
        </h1>

        {/* Vehicle Information Card */}
        <Card className="p-6 mb-4 bg-white rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Veículo</h2>
            <Truck className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Modelo</p>
              <p className="text-gray-800">{delivery.vehicle.modelo}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Placa</p>
              <p className="text-gray-800">{delivery.vehicle.placa}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Capacidade</p>
              <p className="text-gray-800">
                {delivery.vehicle.capacidade} toneladas
              </p>
            </div>
          </div>
        </Card>

        {/* Driver Information Card */}
        <Card className="p-6 mb-4 bg-white rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Motorista</h2>
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Nome</p>
              <p className="text-gray-800">{delivery.driver.nome}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Habilitação</p>
              <p className="text-gray-800">{delivery.driver.habilitacao}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Email</p>
              <p className="text-gray-800">{delivery.driver.email}</p>
            </div>
            {/* Password is intentionally not displayed */}
          </div>
        </Card>

        {/* Product Information Card */}
        <Card className="p-6 mb-4 bg-white rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Produto</h2>
            <Package className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Nome</p>
              <p className="text-gray-800">{delivery.product.nome}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Preço</p>
              <p className="text-gray-800">
                R$ {delivery.product.preco.toFixed(2)}
              </p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Descrição</p>
              <p className="text-gray-800">{delivery.product.descricao}</p>
            </div>
          </div>
        </Card>

        {/* Distribution Point Information Card */}
        <Card className="p-6 mb-4 bg-white rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Ponto de distribuição</h2>
            <Warehouse className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Nome</p>
              <p className="text-gray-800">{}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Endereço</p>
              <p className="text-gray-800">{delivery.destino}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Tipo</p>
              <p className="text-gray-800">{}</p>
            </div>
          </div>
        </Card>

        {/* Origin and Destination Card */}
        <Card className="p-6 bg-white rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Rota</h2>
            <MapPin className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Origem</p>
              <p className="text-gray-800">{delivery.origem}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Destino</p>
              <p className="text-gray-800">{delivery.destino}</p>
            </div>
            {/* Detalhes da Rota */}
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Resumo da Rota</p>
              <p className="text-gray-800">
                {selectedRoute?.summary || 'Carregando...'}
              </p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Distância</p>
              <p className="text-gray-800">
                {selectedRoute?.distance || 'Carregando...'}
              </p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 font-medium">Duração</p>
              <p className="text-gray-800">
                {selectedRoute?.duration || 'Carregando...'}
              </p>
            </div>
            {/* Rotas Alternativas */}
            {routes.length > 1 && (
              <div className="mb-3">
                <p className="text-gray-500 font-medium mb-2">Outras Rotas</p>
                <div className="flex flex-col gap-2">
                  {routes.map((route, index) => (
                    <Button
                      key={index}
                      variant={index === routeIndex ? 'default' : 'outline'}
                      onClick={() => setRouteIndex(index)}
                    >
                      {route.summary}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TrackDelivery
