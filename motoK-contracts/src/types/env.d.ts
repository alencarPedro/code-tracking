/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_PROCURADOR_NOME: string;
	readonly VITE_PROCURADOR_ESTADO_CIVIL: string;
	readonly VITE_PROCURADOR_RG: string;
	readonly VITE_PROCURADOR_CPF: string;
	readonly VITE_PROCURADOR_ENDERECO: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
