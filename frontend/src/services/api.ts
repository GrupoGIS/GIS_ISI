import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export interface User {
  id: number
  is_client: boolean
  is_driver: boolean
  is_employee: boolean
  email: string
  password_hash: string
  salt: string
}

export interface Client {
  id: number
  nome: string
  end_rua: string
  end_bairro: string
  end_numero: number
  telefone: number
  fk_id_usuario?: number
  user?: User
  products?: Product[]
}

export interface Product {
  id: number
  nome: string
  descricao: string
  preco: number
  quantidade_estoque: number
  fk_id_cliente?: number
  client?: Client
  deliveries?: Delivery[]
}

export interface DistributionPoint {
  id: number
  nome: string
  end_rua: string
  end_bairro: string
  end_numero: number
  tipo: string
  deliveries?: Delivery[]
}

export interface Delivery {
  id: number
  fk_id_veiculo?: number
  fk_id_produto?: number
  fk_id_ponto_entrega?: number
  status: string
  is_delivered: boolean
  vehicle?: Vehicle
  product?: Product
  distribution_point?: DistributionPoint
  // route?: Route
}

export interface Vehicle {
  id: number
  placa: string
  modelo: string
  capacidade: number
  fk_id_localizacao?: number
  is_available: boolean
  drivers?: Driver[]
  // location?: VehicleLocation
  deliveries?: Delivery[]
}

export interface Driver {
  id: number
  nome: string
  habilitacao: string
  telefone: number
  end_rua: string
  end_bairro: string
  end_numero: number
  fk_id_usuario?: number
  fk_id_veiculo?: number
  user?: User
  vehicle?: Vehicle
}

// Interfaces para dados de criação (inputs)

export interface RegisterClientData {
  nome: string
  end_rua: string
  end_bairro: string
  end_numero: number
  telefone: number
  email: string
  password: string
}

export interface RegisterProductData {
  nome: string
  descricao: string
  preco: number
  quantidade_estoque: number
  fk_id_cliente: number
  fk_id_ponto_distribuicao: number
}

export interface RegisterDistributionPointData {
  nome: string
  end_rua: string
  end_bairro: string
  end_numero: number
  tipo: string
}

export interface RegisterDriverData {
  nome: string
  email: string
  telefone: string
  password: string
  habilitacao: string
  end_rua: string
  end_bairro: string
  end_numero: number
  fk_id_veiculo: number
}

export interface RegisterVehicleData {
  marca: string
  modelo: string
  ano: number
  placa: string
  latitude: number
  longitude: number
}

export interface Vehicle {
  id: number
  marca: string
  modelo: string
  ano: number
  placa: string
  latitude: number
  longitude: number
  fk_id_motorista: number
}

// Funções da API

// Login do usuário
interface LoginResponse {
  access_token: string
  token_type: 'bearer'
  user_type: {
    is_client: boolean
    is_driver: boolean
    is_employee: boolean
  }
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>('/auth/login', null, {
    params: { email, password },
  })
  return response.data
}

// Registrar cliente
export const registerClient = async (
  data: RegisterClientData
): Promise<Client> => {
  const response = await API.post<Client>('/create_clients', data)
  return response.data
}

// Buscar clientes
export const fetchClients = async (): Promise<Client[]> => {
  const response = await API.get<Client[]>('/clients')
  return response.data
}

// Registrar produto
export const registerProduct = async (
  productData: RegisterProductData
): Promise<Product> => {
  const response = await API.post<Product>('/create_product', productData)
  return response.data
}

// Buscar produtos
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await API.get<Product[]>('/products')
  return response.data
}

// Registrar ponto de distribuição
export const registerDistributionPoint = async (
  pointData: RegisterDistributionPointData
): Promise<DistributionPoint> => {
  const response = await API.post<DistributionPoint>(
    '/create_distribution_point',
    pointData
  )
  return response.data
}

// Buscar pontos de distribuição
export const fetchDistributionPoints = async (): Promise<
  DistributionPoint[]
> => {
  const response = await API.get<DistributionPoint[]>('/distribution_points')
  return response.data
}

// Registrar motorista
export const registerDriver = async (
  data: RegisterDriverData
): Promise<Driver> => {
  const response = await API.post<Driver>('/create_driver', data)
  return response.data
}

// Buscar motoristas
export const fetchDrivers = async (): Promise<Driver[]> => {
  const response = await API.get<Driver[]>('/drivers')
  return response.data
}

// Registrar veículo
export const registerVehicle = async (
  data: RegisterVehicleData
): Promise<Vehicle> => {
  const response = await API.post<Vehicle>('/create_vehicle', data)
  return response.data
}
