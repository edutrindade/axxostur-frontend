export type PlanType = "BASIC" | "PREMIUM" | "ENTERPRISE";

export interface EnterpriseFormData {
	cnpj: string;
	stateRegistration: string;
	socialReason: string;
	fantasyName: string;
	responsibleName: string;
	responsibleCrea: string;
	phone: string;
	email: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	instagram: string;
	facebook: string;
	invoiceEmail: string;
	invoiceDueDate: string;
	logoUrl: string;
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	customDomain: string;
	planType: PlanType;
}
