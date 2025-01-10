export interface BuyerInfo {
	nome: string;
	cpf: string;
	endereco: string;
}

export interface MotorcycleInfo {
	marca: string;
	placa: string;
	chassi: string;
	cor: string;
	anoModelo: string;
	renavan: string;
	combustivel: string;
}

export interface ContractFormData extends BuyerInfo, MotorcycleInfo {}
