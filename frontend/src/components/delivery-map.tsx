import React, { useEffect, useState } from 'react'
import { Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps'

export interface Driver {
  id: number
  nome: string
  habilitacao: string
  email: string
}

export interface Vehicle {
  id: number
  modelo: string
  placa: string
  capacidade: number
}

export interface Product {
  id: number
  nome: string
  preco: number
  descricao: string
}

export interface Delivery {
  id: number
  status: 'Pendente' | 'Em trânsito' | 'Entregue'
  is_delivered: boolean
}

export interface DeliveryDetails {
  id: number
  vehicle: Vehicle
  driver: Driver
  product: Product
  destino: string
  origem: string
  delivery: Delivery
  rota: {
    origin: string
    destination: string
  }
}

interface DeliveryMapProps {
  delivery: DeliveryDetails
  routeIndex: number
  setRouteInfo: (
    routes: google.maps.DirectionsRoute[],
    selectedRoute: google.maps.DirectionsRoute
  ) => void
}

const DeliveryMapComponent: React.FC<DeliveryMapProps> = ({
  delivery,
  routeIndex,
  setRouteInfo,
}) => {
  return (
    <Map
      disableDefaultUI
      gestureHandling={'greedy'}
      className="w-full h-full overflow-hidden rounded-lg border shadow-sm"
    >
      <Directions
        delivery={delivery}
        routeIndex={routeIndex}
        setRouteInfo={setRouteInfo}
      />
    </Map>
  )
}

interface DirectionsProps {
  delivery: DeliveryDetails
  routeIndex: number
  setRouteInfo: (
    routes: google.maps.DirectionsRoute[],
    selectedRoute: google.maps.DirectionsRoute
  ) => void
}

const Directions: React.FC<DirectionsProps> = ({
  delivery,
  routeIndex,
  setRouteInfo,
}) => {
  const map = useMap()
  const directionsLibrary = useMapsLibrary('routes')

  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>()
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>()

  // Initialize directions service and renderer
  useEffect(() => {
    if (!directionsLibrary || !map) return
    setDirectionsService(new directionsLibrary.DirectionsService())
    setDirectionsRenderer(new directionsLibrary.DirectionsRenderer({ map }))
  }, [directionsLibrary, map])

  // Use directions service
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return

    directionsService
      .route({
        origin: delivery.rota.origin,
        destination: delivery.rota.destination,
        waypoints: [
          {
            location: 'Piracicaba, SP',
            stopover: false,
          },
        ],
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response)
        setRouteInfo(response.routes, response.routes[routeIndex])
      })
      .catch((error) => {
        console.error('Error fetching directions:', error)
      })

    return () => directionsRenderer.setMap(null)
  }, [
    directionsService,
    directionsRenderer,
    delivery.rota.origin,
    delivery.rota.destination,
  ])

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return
    directionsRenderer.setRouteIndex(routeIndex)
    // Update selected route info
    if (delivery.routes) {
      setRouteInfo(delivery.routes, delivery.routes[routeIndex])
    }
  }, [routeIndex, directionsRenderer])

  return null
}

export default DeliveryMapComponent
