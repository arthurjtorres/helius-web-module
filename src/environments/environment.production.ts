// Mesmo host da página: a imagem serve em qualquer máquina sem recompilar (T23)
export const environment = {
  production: true,
  baseUrl: `${location.protocol}//${location.hostname}`,
  registry_port: '1000',
  control_port: '1010',
  juristic_port: '1030',
  operations_port: '1020',
}
