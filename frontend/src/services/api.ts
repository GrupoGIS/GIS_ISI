import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000',
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

// Funções da API

// Login do usuário
interface LoginResponse {
  token: string
  role: 'admin' | 'client' | 'driver' // Ajuste conforme necessário
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>('/auth/login', {
    email,
    password,
  })
  return response.data
}

// Registrar cliente
export const registerClient = async (
  data: RegisterClientData
): Promise<Client> => {
  const response = await API.post<Client>('/clients', data)
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
  const response = await API.post<Product>('/products', productData)
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
    '/distribution-points',
    pointData
  )
  return response.data
}

// Buscar pontos de distribuição
export const fetchDistributionPoints = async (): Promise<
  DistributionPoint[]
> => {
  const response = await API.get<DistributionPoint[]>('/distribution-points')
  return response.data
}
