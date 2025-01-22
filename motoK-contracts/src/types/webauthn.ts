export interface PublicKeyCredential extends Credential {
	readonly rawId: ArrayBuffer;
	readonly response: AuthenticatorResponse;
	getClientExtensionResults(): AuthenticationExtensionsClientOutputs;
}

interface AuthenticationExtensionsClientOutputs {
	[key: string]: unknown;
}

interface AuthenticatorResponse {
	readonly clientDataJSON: ArrayBuffer;
}
