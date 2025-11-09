import axios from 'axios';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export const consultarCep = async (cep: string): Promise<AddressData | null> => {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }
    
    if (/^(\d)\1{7}$/.test(cleanCep)) {
      throw new Error('CEP inválido');
    }
    
    const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    const data = response.data;
    
    if (data.erro) {
      return null;
    }
    
    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      zipCode: cep
    };
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    throw error;
  }
};

export const formatCep = (cep: string): string => {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const unformatCep = (cep: string): string => {
  return cep.replace(/\D/g, '');
};
