export const formatCpf = (cpf: string) => {
	const cleaned = cpf.replace(/\D/g, "").slice(0, 11);
	if (cleaned.length <= 3) return cleaned;
	if (cleaned.length <= 6) return cleaned.replace(/(\d{3})(\d+)/, "$1.$2");
	if (cleaned.length <= 9)
		return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
	return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatCnpj = (cnpj: string) => {
	const cleaned = cnpj.replace(/\D/g, "").slice(0, 14);
	if (cleaned.length <= 2) return cleaned;
	if (cleaned.length <= 5) return cleaned.replace(/(\d{2})(\d+)/, "$1.$2");
	if (cleaned.length <= 8)
		return cleaned.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
	if (cleaned.length <= 12)
		return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
	return cleaned.replace(
		/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
		"$1.$2.$3/$4-$5",
	);
};

export const formatCpfCnpj = (document: string) => {
	const cleanDocument = document.replace(/\D/g, "");
	if (cleanDocument.length <= 11) {
		return formatCpf(document);
	} else {
		return formatCnpj(document);
	}
};

export const formatPhone = (phone: string) => {
	const cleaned = phone.replace(/\D/g, "").slice(0, 11);
	if (cleaned.length <= 2) return cleaned;
	if (cleaned.length <= 7) return cleaned.replace(/(\d{2})(\d+)/, "($1) $2");
	return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

export const formatZipCode = (zipCode: string) => {
	const cleaned = zipCode.replace(/\D/g, "").slice(0, 8);
	if (cleaned.length <= 5) return cleaned;
	return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
};

export const formatStateRegistration = (stateRegistration: string) => {
	return stateRegistration.replace(
		/(\d{3})(\d{3})(\d{3})(\d{3})/,
		"$1.$2.$3.$4",
	);
};

export const formatDate = (date: string) => {
	return date.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
};

export const formatCurrency = (value: number) => {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
};
