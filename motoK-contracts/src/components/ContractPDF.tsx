import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ContractFormData } from '@/lib/validations/contract';
import { storeConfig } from '@/config/store';

const styles = StyleSheet.create({
	page: {
		padding: 40,
		fontSize: 12,
	},
	title: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 20,
		fontWeight: 'bold',
		textDecoration: 'underline',
	},
	mainContent: {
		marginTop: 10,
		marginBottom: 20,
	},
	header: {
		marginBottom: 20,
	},
	field: {
		marginBottom: 8,
	},
	fieldLabel: {
		fontWeight: 'bold',
	},
	procuradorSection: {
		marginTop: 20,
		marginBottom: 20,
	},
	vehicleInfo: {
		marginTop: 20,
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	vehicleField: {
		width: '50%',
		marginBottom: 8,
	},
	signature: {
		marginTop: 60,
		borderTop: '1 solid black',
		width: '100%',
		maxWidth: 400,
		textAlign: 'center',
		alignSelf: 'center',
	},
	date: {
		marginTop: 40,
		textAlign: 'right',
	},
});

interface ContractPDFProps {
	data: ContractFormData;
}

export function ContractPDF({ data }: ContractPDFProps) {
	const today = new Date().toLocaleDateString('pt-BR');

	const procuradorText = (
		<Text>
			O Sr. <Text style={{ fontWeight: 'bold' }}>{storeConfig.procurador.nome}</Text>, brasileiro,{' '}
			{storeConfig.procurador.estadoCivil}, portador da carteira de identidade nº. {storeConfig.procurador.rg} e do CPF{' '}
			{storeConfig.procurador.cpf}, residente e domiciliado a {storeConfig.procurador.endereco}
		</Text>
	);

	return (
		<Document>
			<Page
				size="A4"
				style={styles.page}>
				<Text style={styles.title}>PROCURAÇÃO DE COMPRA</Text>

				{/* Buyer Information */}
				<View style={styles.header}>
					<View style={styles.field}>
						<Text>NOME: {data.nome}</Text>
					</View>
					<View style={styles.field}>
						<Text>CPF: {data.cpf}</Text>
					</View>
					<View style={styles.field}>
						<Text>END: {data.endereco}</Text>
					</View>
				</View>

				<View style={styles.mainContent}>
					<Text>NOMEIO E CONSTITUO MEUS BASTANTES PROCURADORES:</Text>

					<View style={styles.procuradorSection}>{procuradorText}</View>

					<Text>
						Para o fim especial de assinar em nome do proprietário adquirente o Certificado de Registro de Veículo (CRV)
						do veículo descrito abaixo e podendo assim representar o PROPRIETÁRIO COMPRADOR do veículo, perante a
						qualquer Órgão Público que exija a assinatura do mesmo no CRV / ATPV.
					</Text>
				</View>

				{/* Vehicle Information */}
				<View style={styles.vehicleInfo}>
					<View style={styles.vehicleField}>
						<Text>MARCA: {data.marca}</Text>
					</View>
					<View style={styles.vehicleField}>
						<Text>ANO/MOD: {data.anoModelo}</Text>
					</View>
					<View style={styles.vehicleField}>
						<Text>PLACA: {data.placa}</Text>
					</View>
					<View style={styles.vehicleField}>
						<Text>RENAVAN: {data.renavan}</Text>
					</View>
					<View style={styles.vehicleField}>
						<Text>CHASSI: {data.chassi}</Text>
					</View>
					<View style={styles.vehicleField}>
						<Text>COMBUSTIVEL: {data.combustivel}</Text>
					</View>
					<View style={styles.vehicleField}>
						<Text>COR: {data.cor}</Text>
					</View>
				</View>

				<Text style={styles.date}>São José, {today}</Text>

				<View style={styles.signature}>
					<Text>{data.nome}</Text>
					<Text>{data.cpf}</Text>
				</View>
			</Page>
		</Document>
	);
}
