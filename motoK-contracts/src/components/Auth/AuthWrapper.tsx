import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Shield } from 'lucide-react';
import { PublicKeyCredential } from '@/types/webauthn';

interface AuthWrapperProps {
	children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		checkRegistration();
	}, []);

	const checkRegistration = async () => {
		try {
			if (!window.PublicKeyCredential) {
				setError('WebAuthn não é suportado neste navegador.');
				return;
			}

			const credentialId = localStorage.getItem('credentialId');
			setIsRegistered(!!credentialId);
		} catch (err) {
			console.error('Erro ao verificar registro:', err);
			setError('Falha ao verificar status do registro.');
		}
	};

	const registerPasskey = async () => {
		try {
			setError('');

			const challenge = new Uint8Array(32);
			crypto.getRandomValues(challenge);

			const createCredentialOptions: CredentialCreationOptions = {
				publicKey: {
					challenge,
					rp: {
						name: 'Contrato Seguro',
						id: window.location.hostname,
					},
					user: {
						id: new Uint8Array(16),
						name: 'user',
						displayName: 'Usuário Autorizado',
					},
					pubKeyCredParams: [
						{
							type: 'public-key',
							alg: -7, // ES256
						},
					],
					authenticatorSelection: {
						authenticatorAttachment: 'platform',
						requireResidentKey: false,
						userVerification: 'preferred', // Changed from 'required' to 'preferred'
					},
					timeout: 60000,
				},
			};

			const credential = await navigator.credentials.create(createCredentialOptions);

			if (credential) {
				const credentialId = btoa(String.fromCharCode(...new Uint8Array((credential as PublicKeyCredential).rawId)));
				localStorage.setItem('credentialId', credentialId);
				setIsRegistered(true);
				authenticate();
			}
		} catch (err) {
			console.error('Erro ao registrar passkey:', err);
			setError(
				'Não foi possível criar a chave de acesso. Verifique se seu dispositivo tem um método de autenticação configurado (PIN, senha ou padrão).'
			);
		}
	};

	const authenticate = async () => {
		try {
			setError('');

			const credentialId = localStorage.getItem('credentialId');
			if (!credentialId) {
				setError('Nenhuma chave encontrada. Por favor registre primeiro.');
				return;
			}

			const challenge = new Uint8Array(32);
			crypto.getRandomValues(challenge);

			const getCredentialOptions: CredentialRequestOptions = {
				publicKey: {
					challenge,
					allowCredentials: [
						{
							type: 'public-key',
							id: Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0)),
							transports: ['internal'],
						},
					],
					userVerification: 'preferred', // Changed from 'required' to 'preferred'
					timeout: 60000,
				},
			};

			const credential = await navigator.credentials.get(getCredentialOptions);

			if (credential) {
				setIsAuthenticated(true);
			}
		} catch (err) {
			console.error('Erro na autenticação:', err);
			setError(
				'Falha na autenticação. Verifique se você tem um método de autenticação configurado no seu dispositivo.'
			);
		}
	};

	if (!isAuthenticated) {
		return (
			<div className="container px-4 py-6 mx-auto sm:px-6">
				<Card className="w-full max-w-md mx-auto shadow-lg">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							{isRegistered ? 'Autenticação' : 'Registro de Acesso'}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{isRegistered ? (
							<Button
								className="w-full"
								onClick={authenticate}
								size="lg">
								<Key className="w-4 h-4 mr-2" />
								Autenticar
							</Button>
						) : (
							<>
								<Alert>
									<AlertDescription>
										Para utilizar este sistema, você precisa configurar um método de autenticação no seu dispositivo
										(como PIN, senha ou padrão).
									</AlertDescription>
								</Alert>
								<Button
									className="w-full"
									onClick={registerPasskey}
									size="lg">
									<Shield className="w-4 h-4 mr-2" />
									Registrar Acesso
								</Button>
							</>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthWrapper;
