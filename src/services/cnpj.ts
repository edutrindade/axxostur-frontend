import { api } from "./api";

export interface CNPJConsultResponse {
  cnpj_raiz: string;
  razao_social: string;
  capital_social: string;
  responsavel_federativo: string;
  atualizado_em: string;
  porte: {
    id: string;
    descricao: string;
  };
  natureza_juridica: {
    id: string;
    descricao: string;
  };
  qualificacao_do_responsavel: {
    id: number;
    descricao: string;
  };
  socios: Array<{
    cpf_cnpj_socio: string;
    nome: string;
    tipo: string;
    data_entrada: string;
    cpf_representante_legal: string;
    nome_representante: string | null;
    faixa_etaria: string;
    atualizado_em: string;
    pais_id: string;
    qualificacao_socio: {
      id: number;
      descricao: string;
    };
    qualificacao_representante: any;
    pais: {
      id: string;
      iso2: string;
      iso3: string;
      nome: string;
      comex_id: string;
    };
  }>;
  simples: {
    simples: string;
    data_opcao_simples: string;
    data_exclusao_simples: string | null;
    mei: string;
    data_opcao_mei: string;
    data_exclusao_mei: string | null;
    atualizado_em: string;
  };
  estabelecimento: {
    cnpj: string;
    atividades_secundarias: Array<{
      id: string;
      secao: string;
      divisao: string;
      grupo: string;
      classe: string;
      subclasse: string;
      descricao: string;
    }>;
    cnpj_raiz: string;
    cnpj_ordem: string;
    cnpj_digito_verificador: string;
    tipo: string;
    nome_fantasia: string | null;
    situacao_cadastral: string;
    data_situacao_cadastral: string;
    data_inicio_atividade: string;
    nome_cidade_exterior: string | null;
    tipo_logradouro: string;
    logradouro: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cep: string;
    ddd1: string;
    telefone1: string;
    ddd2: string | null;
    telefone2: string | null;
    ddd_fax: string | null;
    fax: string | null;
    email: string;
    situacao_especial: string | null;
    data_situacao_especial: string | null;
    atualizado_em: string;
    atividade_principal: {
      id: string;
      secao: string;
      divisao: string;
      grupo: string;
      classe: string;
      subclasse: string;
      descricao: string;
    };
    pais: {
      id: string;
      iso2: string;
      iso3: string;
      nome: string;
      comex_id: string;
    };
    estado: {
      id: number;
      nome: string;
      sigla: string;
      ibge_id: number;
    };
    cidade: {
      id: number;
      nome: string;
      ibge_id: number;
      siafi_id: string;
    };
    motivo_situacao_cadastral: any;
    inscricoes_estaduais: any[];
  };
}

export const consultCnpj = async (cnpj: string): Promise<CNPJConsultResponse> => {
  const response = await api.post("/cnpj/consult", { cnpj });
  return response.data;
};
