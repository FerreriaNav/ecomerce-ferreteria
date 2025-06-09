

export interface ConfiguracionPagoStrapi {
    id:                  number;
    documentId:          string;
    cantidadMinEnvioGratis:   number;
    porcentajeImpuestos: number;
    costoEnvio:         number;
    createdAt:           Date;
    updatedAt:           Date;
    publishedAt:         Date;
}

export type ConfiguracionPago = Pick<ConfiguracionPagoStrapi, "cantidadMinEnvioGratis" | "porcentajeImpuestos" | "costoEnvio">; 
