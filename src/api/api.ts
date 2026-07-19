import { supabase } from './supabaseClient'

export interface Detail {
  name: string
  duration: string
  price: string
}

export interface Service {
  id: number
  title: string
  description: string
  image: string
  price: string
  details: Detail[]
}

export interface Training {
  id: number
  title: string
  description: string
  image: string
  price: string
  duration: string
  details: Detail[]
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('Services')
    .select('*')
    .order('id')
  if (error) throw new Error(error.message)
  return data || []
}

export async function addService(service: Omit<Service, 'id'>): Promise<Service> {
  const { data, error } = await supabase
    .from('Services')
    .insert([service])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateService(id: number, updates: Partial<Service>): Promise<Service> {
  const { data, error } = await supabase
    .from('Services')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteService(id: number): Promise<void> {
  const { error } = await supabase
    .from('Services')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from('Training')
    .select('*')
    .order('id')
  if (error) throw new Error(error.message)
  return data || []
}

export async function addTraining(training: Omit<Training, 'id'>): Promise<Training> {
  const { data, error } = await supabase
    .from('Training')
    .insert([training])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateTraining(id: number, updates: Partial<Training>): Promise<Training> {
  const { data, error } = await supabase
    .from('Training')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteTraining(id: number): Promise<void> {
  const { error } = await supabase
    .from('Training')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
