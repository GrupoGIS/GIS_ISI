import React from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { User, Truck, Package } from 'lucide-react'

const Adm: React.FC = () => {
  const cards = [
    {
      title: 'Cadastrar Cliente',
      description: 'Registre novos clientes no sistema.',
      icon: <User className="h-12 w-12 text-gray-600 mb-4" />,
      linkTo: '/adm/register/client',
    },
    {
      title: 'Cadastrar Veículo',
      description: 'Adicione novos veículos com motoristas.',
      icon: <Truck className="h-12 w-12 text-gray-600 mb-4" />,
      linkTo: '/adm/register/vehicle',
    },
    {
      title: 'Cadastrar Produto',
      description: 'Insira novos produtos no catálogo.',
      icon: <Package className="h-12 w-12 text-gray-600 mb-4" />,
      linkTo: '/adm/register/product',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Administração</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link to={card.linkTo} key={index} className="w-full md:w-64">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-col items-center p-6">
                {card.icon}
                <CardTitle className="text-center mt-2">{card.title}</CardTitle>
                <CardDescription className="text-center">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Adm
