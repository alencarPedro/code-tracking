import * as z from 'zod';

export const contractFormSchema = z.object({
	// Buyer Information
	nome: z
		.string()
		.nonempty('Nome é obrigatório')
		.min(3, 'Nome deve ter pelo menos 3 caracteres')
		.max(100, 'Nome deve ter no máximo 100 caracteres'),

	cpf: z
		.string()
		.nonempty('CPF/CNPJ é obrigatório')
		.refine((value) => {
			const numbers = value.replace(/\D/g, '');
			return numbers.length === 11 || numbers.length === 14;
		}, 'CPF/CNPJ inválido'),

	endereco: z
		.string()
		.nonempty('Endereço é obrigatório')
		.min(10, 'Endereço deve ter pelo menos 10 caracteres')
		.max(200, 'Endereço deve ter no máximo 200 caracteres'),

	// Motorcycle Information
	marca: z
		.string()
		.nonempty('Marca é obrigatória')
		.min(2, 'Marca deve ter pelo menos 2 caracteres')
		.max(50, 'Marca deve ter no máximo 50 caracteres'),

	placa: z
		.string()
		.nonempty('Placa é obrigatória')
		.min(7, 'Placa inválida')
		.max(8, 'Placa inválida')
		.transform((value) => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase())
		.refine((placa) => {
			const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/;
			return plateRegex.test(placa);
		}, 'Formato de placa inválido. Use o formato antigo (ABC1234) ou Mercosul (ABC1D23)'),

	chassi: z
		.string()
		.nonempty('Chassi é obrigatório')
		.length(17, 'Chassi deve ter exatamente 17 caracteres')
		.regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Formato de chassi inválido'),

	cor: z
		.string()
		.nonempty('Cor é obrigatória')
		.min(3, 'Cor deve ter pelo menos 3 caracteres')
		.max(20, 'Cor deve ter no máximo 20 caracteres'),

	anoModelo: z
		.string()
		.nonempty('Ano/Modelo é obrigatório')
		.regex(/^\d{4}\/\d{4}$/, 'Formato deve ser AAAA/AAAA'),

	renavan: z
		.string()
		.nonempty('Renavan é obrigatório')
		.length(11, 'Renavan deve ter exatamente 11 dígitos')
		.regex(/^\d+$/, 'Renavan deve conter apenas números'),

	combustivel: z
		.string()
		.nonempty('Combustível é obrigatório')
		.min(4, 'Tipo de combustível inválido')
		.max(20, 'Tipo de combustível inválido'),
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
