import * as z from 'zod';

export const contractFormSchema = z.object({
	// Buyer Information
	nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),

	cpf: z
		.string()
		.min(11, 'CPF inválido')
		.max(14, 'CPF inválido')
		.refine((cpf) => {
			const cpfClean = cpf.replace(/[^\d]/g, '');
			return cpfClean.length === 11;
		}, 'CPF inválido'),

	endereco: z
		.string()
		.min(10, 'Endereço deve ter pelo menos 10 caracteres')
		.max(200, 'Endereço deve ter no máximo 200 caracteres'),

	// Motorcycle Information
	marca: z.string().min(2, 'Marca deve ter pelo menos 2 caracteres').max(50, 'Marca deve ter no máximo 50 caracteres'),

	placa: z
		.string()
		.min(7, 'Placa inválida')
		.max(8, 'Placa inválida')
		.transform((value) => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase())
		.refine((placa) => {
			// Accepts both old (ABC1234) and new (ABC1D23) Mercosul format
			const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/;
			return plateRegex.test(placa);
		}, 'Formato de placa inválido. Use o formato antigo (ABC1234) ou Mercosul (ABC1D23)'),

	chassi: z
		.string()
		.length(17, 'Chassi deve ter exatamente 17 caracteres')
		.regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Formato de chassi inválido'),

	cor: z.string().min(3, 'Cor deve ter pelo menos 3 caracteres').max(20, 'Cor deve ter no máximo 20 caracteres'),

	anoModelo: z.string().regex(/^\d{4}\/\d{4}$/, 'Formato deve ser AAAA/AAAA'),

	renavan: z
		.string()
		.length(11, 'Renavan deve ter exatamente 11 dígitos')
		.regex(/^\d+$/, 'Renavan deve conter apenas números'),

	combustivel: z.string().min(4, 'Tipo de combustível inválido').max(20, 'Tipo de combustível inválido'),
});

export interface ContractFormData {
	nome: string;
	cpf: string;
	endereco: string;
	marca: string;
	placa: string;
	chassi: string;
	cor: string;
	anoModelo: string;
	renavan: string;
	combustivel: string;
}
