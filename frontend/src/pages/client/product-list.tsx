import React, { useEffect, useState } from 'react'
import { Truck, MapPin, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import { fetchProducts, Product } from '@/services/api'

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const fakeProducts: Product[] = [
      {
        id: 1,
        nome: 'Produto A',
        preco: 150.0,
        quantidade_estoque: 20,
        driver: { id: 1, nome: 'João Silva' },
        destino: 'São Paulo, SP',
        descricao: 'Descrição breve do Produto A.',
        deliveries: [
          {
            id: 1,
            status: 'Em trânsito',
            is_delivered: false,
          },
        ],
      },
      {
        id: 2,
        nome: 'Produto B',
        preco: 250.5,
        quantidade_estoque: 15,
        driver: { id: 2, nome: 'Maria Souza' },
        destino: 'Rio de Janeiro, RJ',
        descricao: 'Descrição breve do Produto B.',
        deliveries: [
          {
            id: 1,
            status: 'Pendente',
            is_delivered: false,
          },
        ],
      },
      {
        id: 3,
        nome: 'Produto C',
        preco: 99.99,
        quantidade_estoque: 50,
        // Sem motorista atribuído
        destino: 'Belo Horizonte, MG',
        descricao: 'Descrição breve do Produto C.',
        deliveries: [
          {
            id: 1,
            status: 'Entregue',
            is_delivered: false, // Nota: Pode ser uma inconsistência
          },
        ],
      },
      // Produtos Adicionais
      {
        id: 4,
        nome: 'Produto D',
        preco: 175.75,
        quantidade_estoque: 30,
        driver: { id: 3, nome: 'Carlos Pereira' },
        destino: 'Curitiba, PR',
        descricao: 'Descrição breve do Produto D.',
        deliveries: [
          {
            id: 1,
            status: 'Em trânsito',
            is_delivered: false,
          },
        ],
      },
      {
        id: 5,
        nome: 'Produto E',
        preco: 200.0,
        quantidade_estoque: 10,
        driver: { id: 4, nome: 'Ana Paula' },
        destino: 'Porto Alegre, RS',
        descricao: 'Descrição breve do Produto E.',
        deliveries: [
          {
            id: 1,
            status: 'Pendente',
            is_delivered: false,
          },
        ],
      },
      {
        id: 6,
        nome: 'Produto F',
        preco: 350.25,
        quantidade_estoque: 5,
        driver: { id: 5, nome: 'Roberto Costa' },
        destino: 'Salvador, BA',
        descricao: 'Descrição breve do Produto F.',
        deliveries: [
          {
            id: 1,
            status: 'Em trânsito',
            is_delivered: false,
          },
        ],
      },
      {
        id: 7,
        nome: 'Produto G',
        preco: 80.0,
        quantidade_estoque: 100,
        // Sem motorista atribuído
        destino: 'Fortaleza, CE',
        descricao: 'Descrição breve do Produto G.',
        deliveries: [
          {
            id: 1,
            status: 'Entregue',
            is_delivered: false, // Nota: Pode ser uma inconsistência
          },
        ],
      },
      {
        id: 8,
        nome: 'Produto H',
        preco: 120.0,
        quantidade_estoque: 25,
        driver: { id: 6, nome: 'Luiza Martins' },
        destino: 'Manaus, AM',
        descricao: 'Descrição breve do Produto H.',
        deliveries: [
          {
            id: 1,
            status: 'Em trânsito',
            is_delivered: false,
          },
        ],
      },
      {
        id: 9,
        nome: 'Produto I',
        preco: 180.5,
        quantidade_estoque: 40,
        driver: { id: 7, nome: 'Fernando Almeida' },
        destino: 'Recife, PE',
        descricao: 'Descrição breve do Produto I.',
        deliveries: [
          {
            id: 1,
            status: 'Pendente',
            is_delivered: false,
          },
        ],
      },
      {
        id: 10,
        nome: 'Produto J',
        preco: 95.0,
        quantidade_estoque: 60,
        // Sem motorista atribuído
        destino: 'Natal, RN',
        descricao: 'Descrição breve do Produto J.',
        deliveries: [
          {
            id: 1,
            status: 'Entregue',
            is_delivered: false, // Nota: Pode ser uma inconsistência
          },
        ],
      },
      {
        id: 11,
        nome: 'Produto K',
        preco: 210.0,
        quantidade_estoque: 12,
        driver: { id: 8, nome: 'Mariana Fernandes' },
        destino: 'Vitória, ES',
        descricao: 'Descrição breve do Produto K.',
        deliveries: [
          {
            id: 1,
            status: 'Em trânsito',
            is_delivered: false,
          },
        ],
      },
      {
        id: 12,
        nome: 'Produto L',
        preco: 300.0,
        quantidade_estoque: 8,
        driver: { id: 9, nome: 'Pedro Henrique' },
        destino: 'Goiânia, GO',
        descricao: 'Descrição breve do Produto L.',
        deliveries: [
          {
            id: 1,
            status: 'Pendente',
            is_delivered: false,
          },
        ],
      },
    ]

    setProducts(fakeProducts)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts()
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="flex-1 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Lista de Produtos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center mb-2">
                <Package className="h-6 w-6 text-gray-600 mr-2" />
                <h2 className="text-xl font-semibold">{product.nome}</h2>
              </div>
              <Separator />
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Truck className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    Motorista: {product.driver?.nome || 'Não atribuído'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    Destino: {product.destino || 'Não definido'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <Badge
                    variant={
                      product.deliveries[0].status === 'Entregue'
                        ? 'default'
                        : product.deliveries[0].status === 'Pendente'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {product.deliveries[0].status}
                  </Badge>
                  <Badge variant="secondary">
                    Quantidade: {product.quantidade_estoque}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => navigate(`/client/track/${product.id}`)}
              >
                Ver Detalhes
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductList
