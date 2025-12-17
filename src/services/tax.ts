import { api } from "./api";

export interface TaxConsultRequest {
  codigoBarras: string;
  uf: string[];
  tenantId: string;
}

export interface TaxHeader {
  cnpj: string;
  cnae: string | null;
  cnaeSecundario: string | null;
  fabricacaoPropria: boolean | null;
  crt: number | null;
  codFaixa: number | null;
  amb: number | null;
  dia: number | null;
  mes: number | null;
  ano: number | null;
  dthr: string; // ISO string
  prodEnv: number | null;
  prodRet: number | null;
  comportamentosParceiro: string | null;
  comportamentosCliente: string | null;
  transacao: string | null;
  mensagem: string | null;
  aces_primeiro: string | null;
  aces_expirar: string | null;
  versao: string | null;
  municipio: string | null;
  duracao: string | null;
}

export interface PisCofinsInfo {
  cstEnt: string | null;
  cstSai: string | null;
  aliqPIS: number | null;
  aliqCOFINS: number | null;
  nri: string | null;
  ampLegal: string | null;
  dtVigIni: string | null; // ISO date string
  dtVigFin: string | null;
}

export interface IpiInfo {
  cstEnt: string | null;
  cstSai: string | null;
  aliqIPI: number | null;
  codenq: string | null;
  ex: string | null;
}

export interface CbsInfo {
  cClassTrib: string | null;
  descrcClassTrib: string | null;
  cst: string | null;
  descrCST: string | null;
  aliquota: number | null;
  reducao: number | null;
  reducaoBcCBS: number | null;
  ampLegal: string | null;
  dtVigIni: string | null; // e.g. 01/01/2026
  dtVigFin: string | null;
}

export interface IbsInfo {
  cClassTrib: string | null;
  descrcClassTrib: string | null;
  cst: string | null;
  descrCST: string | null;
  ibsUF: number | null;
  ibsMun: number | null;
  reducaoaliqIBS: number | null;
  reducaoBcIBS: number | null;
  ampLegal: string | null;
  dtVigIni: string | null;
  dtVigFin: string | null;
}

export interface RegraInfo {
  codigo: number;
  uf: string;
  excecao: number | null;
  pICMSPDV: number | null;
  simbPDV: string | null;
  cst: string | null;
  csosn: string | null;
  aliqicms: number | null;
  reducaobcicms: number | null;
  reducaobcicmsst: number | null;
  aliqicmsst: number | null;
  iva: number | null;
  fcp: number | null;
  codBenef: string | null;
  pDifer: number | null;
  antecipado: string | null;
  cfopCompra: number | null;
  cfopVenda: number | null;
  desonerado: string | null;
  icmsdeson: number | null;
  percIsencao: number | null;
  estd_finalidade: string | null;
  dtVigIni: string | null;
  dtVigFin: string | null;
  ampLegal: string | null;
  IndicDeduzDesonerado: string | null;
  ibs?: IbsInfo | null;
}

export interface TaxGroupItem {
  codigo: number;
  ncm: string | null;
  cest: string | null;
  lista: string | null;
  tipo: string | null;
  codanp: string | null;
  piscofins?: PisCofinsInfo | null;
  ipi?: IpiInfo | null;
  cbs?: CbsInfo | null;
  is?: unknown | null;
  regra?: RegraInfo[] | null;
  produto?: string[] | null;
}

export interface TaxConsultResponse {
  cabecalho: TaxHeader;
  grupo: TaxGroupItem[];
  baixaSimilaridade: unknown[];
}

export interface NcmItem {
  ncm: string;
  cest: string;
  ex: string;
}

export interface NcmProduct {
  imendesCode: number;
  groupDescription: string;
  ncm: string;
  ncmDescription: string;
  cest?: string;
  cestDescription?: string;
  ex?: string;
}

export interface NcmConsultResponse {
  success: boolean;
  total: number;
  found: number;
  notFound: number;
  products: NcmProduct[];
  notFoundNcms: string[];
}

export async function consultTax(payload: TaxConsultRequest): Promise<TaxConsultResponse> {
  const { data } = await api.post<TaxConsultResponse>("/tax/consult", payload);
  return data;
}

export async function consultNcm(ncms: NcmItem[], tenantId: string): Promise<NcmConsultResponse> {
  const { data } = await api.post<NcmConsultResponse>("/ncm/consult", ncms, {
    params: { tenantId },
  });
  return data;
}

export async function consultNcmByImendesCode(imendesCode: number, tenantId: string): Promise<TaxConsultResponse> {
  const { data } = await api.post<TaxConsultResponse>(
    "/ncm/query-by-imendes-code",
    { imendesCode },
    {
      params: { tenantId },
    }
  );
  return data;
}
