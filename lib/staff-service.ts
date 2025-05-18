import { dbManager, type Staff } from "./db"

// Função para gerar um ID único para o funcionário
export function generateStaffId(): string {
  const prefix = "STF"
  const randomNum = Math.floor(100 + Math.random() * 900) // Número de 3 dígitos
  return `${prefix}${randomNum}`
}

// Função para verificar se um nome de usuário já existe
export function usernameExists(username: string): boolean {
  const staff = dbManager.getStaffByUsername(username)
  return !!staff
}

// Função para registrar um novo funcionário
export async function registerStaff(data: any): Promise<Staff> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Verificar se o nome de usuário já existe
  if (usernameExists(data.username)) {
    throw new Error("Nome de usuário já existe. Por favor, escolha outro.")
  }

  // Gerar ID único para o funcionário
  const staffId = generateStaffId()

  // Criar objeto do funcionário
  const newStaff: Staff = {
    id: staffId,
    username: data.username,
    password: data.password,
    name: data.name,
    role: data.role as "medico" | "enfermeiro" | "admin",
  }

  // Adicionar funcionário ao banco de dados
  dbManager.addStaff(newStaff)

  return newStaff
}

// Função para obter todos os funcionários
export function getAllStaff(): Staff[] {
  return dbManager.getAllStaff()
}

// Função para obter um funcionário pelo ID
export function getStaffById(id: string): Staff | undefined {
  const allStaff = dbManager.getAllStaff()
  return allStaff.find((staff) => staff.id === id)
}

// Função para atualizar um funcionário
export function updateStaff(staff: Staff): void {
  // Verificar se o nome de usuário já existe (exceto para o próprio funcionário)
  const existingStaff = dbManager.getAllStaff().find((s) => s.username === staff.username && s.id !== staff.id)

  if (existingStaff) {
    throw new Error("Nome de usuário já existe. Por favor, escolha outro.")
  }

  // Se o funcionário for o admin principal, proteger certas propriedades
  if (staff.id === "STF003" && staff.username === "admin") {
    // Garantir que o nome de usuário e o cargo permaneçam inalterados
    staff.username = "admin"
    staff.role = "admin"
  }

  dbManager.updateStaff(staff)
}

// Função para excluir um funcionário
export function deleteStaff(id: string): void {
  // Não permitir excluir o admin principal
  const staff = getStaffById(id)
  if (staff?.username === "admin") {
    throw new Error("Não é possível excluir o administrador principal")
  }

  dbManager.deleteStaff(id)
}
