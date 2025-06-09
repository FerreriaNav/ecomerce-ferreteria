import { Address } from "@/interfaces/directions/directions.interface";

export const formatAddress = (a: Address) => {
  return `${a.calle} ${a.numeroExterior}${a.numeroInterior ? `, Int. ${a.numeroInterior}` : ""}`;
};
