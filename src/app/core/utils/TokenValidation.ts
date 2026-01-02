// Função auxiliar para validar o token (pode ser exportada de um arquivo de utils)
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now; // Retorna true se a expiração for maior que o tempo atual
  } catch {
    return false;
  }
};