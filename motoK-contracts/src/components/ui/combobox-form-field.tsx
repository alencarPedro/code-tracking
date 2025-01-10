'use client';
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Controller, Control } from 'react-hook-form';
import { ContractFormData } from '@/lib/validations/contract';

interface Option {
	value: string;
	label: string;
}

interface ComboboxFormFieldProps {
	options: Option[];
	name: keyof ContractFormData;
	placeholder: string;
	control: Control<ContractFormData>;
	error?: boolean;
	noResultsText?: string;
}

export function ComboboxFormField({
	options,
	name,
	placeholder,
	control,
	error,
	noResultsText = 'Nenhum resultado encontrado.',
}: ComboboxFormFieldProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<Popover
					open={open}
					onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className={cn(
								'w-full justify-between',
								!field.value && 'text-muted-foreground',
								error && 'border-red-500'
							)}>
							{field.value ? options.find((option) => option.value === field.value)?.label : placeholder}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandInput
								placeholder={`Procurar ${placeholder.toLowerCase()}...`}
								className="h-9"
							/>
							<CommandList>
								<CommandEmpty>{noResultsText}</CommandEmpty>
								<CommandGroup>
									{options.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onSelect={(currentValue) => {
												field.onChange(currentValue === field.value ? '' : currentValue);
												setOpen(false);
											}}>
											{option.label}
											<Check
												className={cn('ml-auto h-4 w-4', field.value === option.value ? 'opacity-100' : 'opacity-0')}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			)}
		/>
	);
}
