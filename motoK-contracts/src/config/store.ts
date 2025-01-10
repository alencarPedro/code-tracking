export const storeConfig = {
	procurador: {
		nome: import.meta.env.VITE_PROCURADOR_NOME || '',
		estadoCivil: import.meta.env.VITE_PROCURADOR_ESTADO_CIVIL || '',
		rg: import.meta.env.VITE_PROCURADOR_RG || '',
		cpf: import.meta.env.VITE_PROCURADOR_CPF || '',
		endereco: import.meta.env.VITE_PROCURADOR_ENDERECO || '',
	},
} as const;

// Optional: Add validation
if (
	!import.meta.env.VITE_PROCURADOR_NOME ||
	!import.meta.env.VITE_PROCURADOR_ESTADO_CIVIL ||
	!import.meta.env.VITE_PROCURADOR_RG ||
	!import.meta.env.VITE_PROCURADOR_CPF ||
	!import.meta.env.VITE_PROCURADOR_ENDERECO
) {
	console.error('Missing environment variables for procurador data');
}
