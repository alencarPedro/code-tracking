import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { contractFormSchema } from '@/lib/validations/contract';
import { ComboboxFormField } from './ui/combobox-form-field';
import { FUEL_TYPES, MOTORCYCLE_BRANDS, COMMON_COLORS } from '@/lib/constants/auto-data';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ContractPDF } from './ContractPDF';
import { ContractFormData } from '@/types/contract';
import { cn } from '@/lib/utils';

const ContractForm = () => {
	const [pdfData, setPdfData] = useState<ContractFormData | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ContractFormData>({
		resolver: zodResolver(contractFormSchema),
		defaultValues: {
			nome: '',
			cpf: '',
			endereco: '',
			marca: '',
			placa: '',
			chassi: '',
			cor: '',
			anoModelo: '',
			renavan: '',
			combustivel: '',
		},
		mode: 'all',
	});

	const onSubmit = async (data: ContractFormData) => {
		try {
			// Remove masks before submitting
			const cleanData = {
				...data,
				cpf: data.cpf.replace(/\D/g, ''),
				placa: data.placa.replace(/[-]/g, ''),
				renavan: data.renavan.replace(/\D/g, ''),
			};
			console.log('Form submitted:', cleanData);
			setIsLoading(true);
			setPdfData(cleanData);
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 py-6">
			<Card className="w-full shadow-lg">
				<CardHeader className="py-4 sm:py-6">
					<CardTitle className="text-xl sm:text-2xl font-bold text-center">
						Formulario de Procuração de Compra
					</CardTitle>
				</CardHeader>
				<CardContent className="px-3 sm:px-6">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4 sm:space-y-6">
						{/* Buyer Information Section */}
						<div className="space-y-3 sm:space-y-4">
							<h2 className="text-lg sm:text-xl font-semibold">Informações do Comprador</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-3 sm:space-y-4">
									<Label className="text-sm font-medium">Nome Completo</Label>
									<Input
										{...register('nome')}
										className={cn('h-11 sm:h-10', errors.nome ? 'border-red-500' : '')}
										aria-required="true"
									/>
									{errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">CPF</Label>
									<Controller
										name="cpf"
										control={control}
										render={({ field }) => (
											<InputMask
												mask="999.999.999-99"
												value={field.value}
												onChange={field.onChange}>
												{(inputProps) => (
													<Input
														{...inputProps}
														type="text"
														placeholder="000.000.000-00"
														className={cn('h-11 sm:h-10', errors.cpf ? 'border-red-500' : '')}
														aria-required="true"
													/>
												)}
											</InputMask>
										)}
									/>
									{errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">Endereço</Label>
									<Input
										{...register('endereco')}
										className={cn('h-11 sm:h-10', errors.endereco ? 'border-red-500' : '')}
										aria-required="true"
									/>
									{errors.endereco && <p className="text-sm text-red-500">{errors.endereco.message}</p>}
								</div>
							</div>
						</div>

						{/* Contract Text Section */}
						<div className="p-3 sm:p-4 bg-gray-50 rounded text-justify">
							<p className="text-xs sm:text-sm leading-relaxed">
								{`O Sr. `}
								<strong>{import.meta.env.VITE_PROCURADOR_NOME}</strong>
								{`, brasileiro,
								${import.meta.env.VITE_PROCURADOR_ESTADO_CIVIL}, portador da
								carteira de identidade nº. ${import.meta.env.VITE_PROCURADOR_RG}
								e do CPF ${import.meta.env.VITE_PROCURADOR_CPF},
								residente e domiciliado a ${import.meta.env.VITE_PROCURADOR_ENDERECO};`}
							</p>
							<p className="text-xs sm:text-sm mt-2 leading-relaxed">
								Para o fim especial de assinar em nome do proprietário adquirente o Certificado de Registro de Veículo
								(CRV) do veículo descrito abaixo e podendo assim representar o PROPRIETÁRIO COMPRADOR do veículo,
								perante a qualquer Órgão Público que exija a assinatura do mesmo no CRV / ATPV
							</p>
						</div>

						{/* Motorcycle Information Section */}
						<div className="space-y-4">
							<h2 className="text-xl font-semibold">Informações da Motocicleta</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
								<div className="space-y-2 w-full">
									<Label className="text-sm font-medium">Marca</Label>
									<ComboboxFormField
										control={control}
										name="marca"
										options={MOTORCYCLE_BRANDS}
										placeholder="Selecione a marca"
										error={!!errors.marca}
										aria-required="true"
									/>
									{errors.marca && <p className="text-sm text-red-500">{errors.marca.message}</p>}
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">Placa</Label>
									<Controller
										name="placa"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												maxLength={7}
												placeholder="ABC1234"
												className={cn('h-11 sm:h-10', errors.placa ? 'border-red-500' : '')}
												onChange={(e) => {
													const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
													field.onChange(value);
												}}
												aria-required="true"
											/>
										)}
									/>
									{errors.placa && <p className="text-sm text-red-500">{errors.placa.message}</p>}
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">Chassi</Label>
									<Controller
										name="chassi"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												maxLength={17}
												className={cn('h-11 sm:h-10', errors.chassi ? 'border-red-500' : '')}
												onChange={(e) => {
													const value = e.target.value.toUpperCase();
													field.onChange(value);
												}}
												aria-required="true"
											/>
										)}
									/>
									{errors.chassi && <p className="text-sm text-red-500">{errors.chassi.message}</p>}
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">Cor</Label>
									<ComboboxFormField
										control={control}
										name="cor"
										options={COMMON_COLORS}
										placeholder="Selecione a cor"
										error={!!errors.cor}
										aria-required="true"
									/>
									{errors.cor && <p className="text-sm text-red-500">{errors.cor.message}</p>}
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">Ano/Modelo</Label>
									<Controller
										name="anoModelo"
										control={control}
										render={({ field }) => (
											<InputMask
												mask="9999/9999"
												value={field.value}
												onChange={field.onChange}>
												{(inputProps) => (
													<Input
														{...inputProps}
														type="text"
														placeholder="2024/2024"
														className={cn('h-11 sm:h-10', errors.anoModelo ? 'border-red-500' : '')}
														aria-required="true"
													/>
												)}
											</InputMask>
										)}
									/>
									{errors.anoModelo && <p className="text-sm text-red-500">{errors.anoModelo.message}</p>}
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">Renavan</Label>
									<Controller
										name="renavan"
										control={control}
										render={({ field }) => (
											<InputMask
												mask="99999999999"
												value={field.value}
												onChange={field.onChange}>
												{(inputProps) => (
													<Input
														{...inputProps}
														type="text"
														className={cn('h-11 sm:h-10', errors.renavan ? 'border-red-500' : '')}
														aria-required="true"
													/>
												)}
											</InputMask>
										)}
									/>
									{errors.renavan && <p className="text-sm text-red-500">{errors.renavan.message}</p>}
								</div>
								<div className="space-y-2 ">
									<Label className="text-sm font-medium">Combustível</Label>
									<ComboboxFormField
										control={control}
										name="combustivel"
										options={FUEL_TYPES}
										placeholder="Selecione o combustível"
										error={!!errors.combustivel}
										aria-required="true"
									/>
									{errors.combustivel && <p className="text-sm text-red-500">{errors.combustivel.message}</p>}
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
							<Button
								type="submit"
								className="w-full sm:w-auto"
								disabled={isSubmitting || Object.keys(errors).length > 0}>
								{isSubmitting ? 'Gerando...' : 'Gerar Contrato'}
							</Button>

							{pdfData && (
								<div className="w-full sm:w-auto">
									<PDFDownloadLink
										document={<ContractPDF data={pdfData} />}
										fileName={`contrato-${pdfData.placa}.pdf`}
										className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
										{isLoading ? 'Baixar PDF' : 'Gerando PDF...'}
									</PDFDownloadLink>

									<Button
										type="button"
										onClick={() => {
											reset();
											setPdfData(null);
											setIsLoading(false);
										}}
										variant="outline"
										className="w-full sm:w-auto">
										Novo Formulário
									</Button>
								</div>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ContractForm;
