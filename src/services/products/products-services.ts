import { BACKEND_ROUTES } from "@/contants/backend-routes/routes";
import { DataResponse } from "@/interfaces/data/response.interface";
import { Products } from "@/interfaces/products/products.interface";
import { query } from "@/lib/api/server/strapi";
import { formatStrapiImageUrl } from "@/lib/FormatUrlImgStrapi";

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST;
const BASE_ENDPOINT: string = BACKEND_ROUTES.PRODUCTS;

//? ====================** FUNCION PARA MAPEAR PRODUCTOS CON IMÁGENES **====================
function mapProductsWithImages(products: Products[]): Products[] {
  return products.map((product) => {
    const coverUrl = product.cover
      ? `${STRAPI_HOST}${product.cover.url}`
      : "/images/products/default-img.png";

    const galleryUrls =
      product.galeria?.map((image) => formatStrapiImageUrl(image.url)) || [];

    const variantes =
      product.variantes?.map((variante) => {
        const varianteCoverUrl = variante.cover
          ? `${STRAPI_HOST}${variante.cover.url}`
          : "/images/products/default-img.png";

        const varianteGalleryUrls =
          variante.galeria?.map((img) => formatStrapiImageUrl(img.url)) || [];

        return {
          ...variante,
          coverUrl: varianteCoverUrl,
          galleryUrls: varianteGalleryUrls,
        };
      }) || [];

    return {
      ...product,
      coverUrl,
      galleryUrls,
      variantes,
    };
  });
}

//? ====================** OBTENER TODOS LOS PRODUCTOS **=================

export async function searchProducts(
  search: string
): Promise<DataResponse<Products[]> | null> {
  const params = new URLSearchParams();

  params.append("filters[$or][0][nombre][$containsi]", search);
  params.append("filters[$or][1][descripcion][$containsi]", search);
  params.append("filters[$or][2][categorias][nombre][$containsi]", search);
  params.append("filters[$or][4][marca][nombre][$containsi]", search);

  params.append("populate[cover]", "true");
  params.append("populate[galeria]", "true");

  const url = `productos?${params.toString()}`;

  try {
    const res = await query<DataResponse<Products[]>>(url);
    if (!res) {
      return null;
    }
    return { data: mapProductsWithImages(res.data), meta: res.meta };
  } catch {
    return null;  }
}

export async function searchProductsWithFallback(
  search: string
): Promise<DataResponse<Products[]> | null> {
  const searchTerms = search.trim().split(/\s+/);

  const strictParams = buildParams(searchTerms, true);
  const strictResults = await fetchProductsByUrl(
    `productos?${strictParams.toString()}`
  );

  if (!strictResults) {
    return null;
  }

  if (strictResults.data.length > 0) return strictResults;

  const looseParams = buildParams(searchTerms, false);
  const looseResults = await fetchProductsByUrl(
    `productos?${looseParams.toString()}`
  );

  if (!looseResults) {
    return null;
  }

  return looseResults;
}

export async function searchProductsWithParams(
  filters: ProductFilters
): Promise<DataResponse<Products[]> | null> {
  // Primero intenta con búsqueda estricta
  const strictParams = buildParamsWithFilters(filters, true);
  const strictResults = await fetchProductsByUrl(
    `productos?${strictParams.toString()}`
  );

  if (!strictResults) {
    return null;
  }

  if (strictResults.data.length > 0) return strictResults;

  // Luego intenta con búsqueda relajada
  const looseParams = buildParamsWithFilters(filters, false);
  const looseResults = await fetchProductsByUrl(
    `productos?${looseParams.toString()}`
  );

  if (!looseResults) {
    return null;
  }

  return looseResults;
}

function buildParamsWithFilters(
  filters: ProductFilters,
  isStrict: boolean
): URLSearchParams {
  const params = new URLSearchParams();
  const searchTerms = filters.search?.trim().split(/\s+/) || [];

  let filterIndex = 0;

  // 1. Búsqueda textual (nombre, categorías, marcas)
  searchTerms.forEach((term) => {
    params.append(
      `${buildGroupKey(filterIndex++, 0, isStrict)}[nombre][$containsi]`,
      term
    );
    if (!isStrict) {
      params.append(
        `${buildGroupKey(
          filterIndex++,
          0,
          isStrict
        )}[categorias][nombre][$containsi]`,
        term
      );
      params.append(
        `${buildGroupKey(
          filterIndex++,
          0,
          isStrict
        )}[marca][nombre][$containsi]`,
        term
      );
    }
  });

  // 2. Filtros adicionales (categorías seleccionadas, marcas, precio)
  if (filters.categorias?.length) {
    filters.categorias.forEach((cat) => {
      params.append(
        `${buildGroupKey(
          filterIndex++,
          1,
          isStrict
        )}[categorias][nombre][$containsi]`,
        cat
      );
    });
  }

  if (filters.marcas?.length) {
    filters.marcas.forEach((marca) => {
      params.append(
        `${buildGroupKey(
          filterIndex++,
          1,
          isStrict
        )}[marca][nombre][$containsi]`,
        marca
      );
    });
  }

  if (filters.precioMin !== undefined && !isNaN(filters.precioMin)) {
    params.append(
      "filters[inventario][precioVenta][$gte]",
      filters.precioMin.toString()
    );
  }

  if (filters.precioMax !== undefined && !isNaN(filters.precioMax)) {
    params.append(
      "filters[inventario][precioVenta][$lte]",
      filters.precioMax.toString()
    );
  }

  // Paginación
  if (filters.page) {
    params.append("pagination[page]", filters.page.toString());
  }
  if (filters.pageSize) {
    params.append("pagination[pageSize]", filters.pageSize.toString());
  }

  // Ordenamiento
  if (filters.sortBy) {
    let sortValue: string | null = "";
    switch (filters.sortBy) {
      case "featured":
        sortValue = null;
        break;
      case "price-asc":
        sortValue = "inventario.precioVenta:asc";
        break;
      case "price-desc":
        sortValue = "inventario.precioVenta:desc";
        break;
      case "name-asc":
        sortValue = "nombre:asc";
        break;
      case "name-desc":
        sortValue = "nombre:desc";
        break;
    }
    if (sortValue) params.append("sort", sortValue);
  }

  // Relaciones necesarias
  params.append("[fields][0]", "nombre");
  params.append("[fields][1]", "slug");
  params.append("[fields][2]", "tipo");
  params.append("populate[categorias]", "true");
  params.append("populate[marca]", "true");
  params.append("populate[cover][fields][0]", "url");
  params.append("populate[galeria][fields][0]", "url");
  params.append("populate[principal]", "true");
  params.append("populate[inventario]", "true");
  params.append("populate[descuento]", "true");
  return params;
}

function buildGroupKey(
  indexTerm: number,
  indexFilter: number,
  isStrict: boolean
) {
  return isStrict
    ? `filters[$and][${indexTerm + indexFilter}]`
    : `filters[$or][${indexTerm + indexFilter}]`;
}

function buildParams(terms: string[], isStrict: boolean): URLSearchParams {
  const params = new URLSearchParams();

  terms.forEach((term, i) => {
    params.append(`${buildGroupKey(i, 0, isStrict)}[nombre][$containsi]`, term);

    if (!isStrict) {
      params.append(
        `${buildGroupKey(i, 2, isStrict)}[categorias][nombre][$containsi]`,
        term
      );
      params.append(
        `${buildGroupKey(i, 3, isStrict)}[marca][nombre][$containsi]`,
        term
      );
    }
  });

  params.append("[fields][0]", "nombre");
  params.append("[fields][1]", "slug");
  params.append("[fields][2]", "tipo");
  params.append("populate[categorias]", "true");
  params.append("populate[marca]", "true");
  params.append("populate[cover][fields][0]", "url");
  params.append("populate[galeria][fields][0]", "url");
  params.append("populate[principal]", "true");
  params.append("populate[inventario]", "true");
  params.append("populate[descuento]", "true");

  return params;
}

async function fetchProductsByUrl(
  url: string
): Promise<DataResponse<Products[]> | null> {
  const res = await query<DataResponse<Products[]>>(url);

  if (!res) {
    return null;
  }
  return { ...res, data: mapProductsWithImages(res.data) };
}

function normalizeFilters(filters: ProductFilters): ProductFilters {
  return {
    ...filters,
    categorias: filters.categorias?.map(decodeURIComponent),
    marcas: filters.marcas?.map(decodeURIComponent),
  };
}

export interface ProductFilters {
  search?: string;
  categorias?: string[];
  marcas?: string[];
  precioMin?: number;
  precioMax?: number;
  sortBy?: SortOption;
  page?: number;
  pageSize?: number;
  descuentos?: boolean;
}
export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export async function getProductsByFilters(
  filters: ProductFilters = {}
): Promise<DataResponse<Products[]> | null> {
  const normalizedFilters = normalizeFilters(filters);

  // Intento estricto
  const strictParams = buildFilterParams(normalizedFilters, true);
  const strictUrl = `${BASE_ENDPOINT}?${strictParams.toString()}`;
  const strictRes = await query<DataResponse<Products[]>>(strictUrl);

  if (!strictRes) {
    return null;
  }

  if (strictRes.data.length > 0) {
    return {
      data: mapProductsWithImages(strictRes.data),
      meta: strictRes.meta,
    };
  }

  // Intento no estricto
  const looseParams = buildFilterParams(normalizedFilters, false);
  const looseUrl = `${BASE_ENDPOINT}?${looseParams.toString()}`;
  const looseRes = await query<DataResponse<Products[]>>(looseUrl);

  if (!looseRes) {
    return null;
  }

  return { data: mapProductsWithImages(looseRes.data), meta: looseRes.meta };
}

function buildFilterParams(
  filters: ProductFilters,
  isStrict: boolean
): URLSearchParams {
  const params = new URLSearchParams();

  let filterIndex = 0;

  if (filters.search) {
    params.append(
      `${buildGroupKey(filterIndex++, 0, isStrict)}[nombre][$containsi]`,
      filters.search
    );
  }

  if (filters.categorias?.length) {
    filters.categorias.forEach((cat) => {
      params.append(
        `${buildGroupKey(
          filterIndex++,
          0,
          isStrict
        )}[categorias][nombre][$containsi]`,
        cat
      );
    });
  }

  if (filters.marcas?.length) {
    filters.marcas.forEach((marca) => {
      params.append(
        `${buildGroupKey(
          filterIndex++,
          1,
          isStrict
        )}[marca][nombre][$containsi]`,
        marca
      );
    });
  }

  if (filters.precioMax !== undefined && !isNaN(filters.precioMax)) {
    params.append(
      "filters[inventario][precioVenta][$lte]",
      filters.precioMax.toString()
    );
  }

  // Paginación
  if (filters.page) {
    params.append("pagination[page]", filters.page.toString());
  }
  if (filters.pageSize) {
    params.append("pagination[pageSize]", filters.pageSize.toString());
  }

  // Ordenamiento
  if (filters.sortBy) {
    let sortValue = "";
    switch (filters.sortBy) {
      case "price-asc":
        sortValue = "inventario.precioVenta:asc";
        break;
      case "price-desc":
        sortValue = "inventario.precioVenta:desc";
        break;
      case "name-asc":
        sortValue = "nombre:asc";
        break;
      case "name-desc":
        sortValue = "nombre:desc";
        break;
    }
    if (sortValue) params.append("sort", sortValue);
  }

  // descuentos, ofertas
  if (filters.descuentos) {
    const now = new Date().toISOString();

    params.append("filters[descuento][activo][$eq]", "true");
    params.append("filters[descuento][fechaInicio][$lte]", now);
    params.append("filters[descuento][fechaFin][$gte]", now);
  }

  // Campos y relaciones
  params.append("[fields][0]", "nombre");
  params.append("[fields][1]", "slug");
  params.append("[fields][2]", "tipo");

  const populate = [
    "[cover]",
    "[galeria]",
    "[inventario]",
    "[descuento]",
    // "[variantes][populate][inventario]",
  ];
  populate.forEach((field) => params.append(`populate${field}`, "true"));

  return params;
}

export async function getAllProducts(): Promise<DataResponse<
  Products[]
> | null> {
  const params = new URLSearchParams();

  // Campos específicos
  params.append("fields[0]", "nombre");
  params.append("fields[1]", "slug");
  params.append("fields[2]", "tipo");

  // Relaciones a popular
  params.append("populate[descuento]", "true");
  params.append("populate[inventario]", "true");
  params.append("populate[categorias]", "true");
  params.append("populate[marca]", "true");
  params.append("populate[cover][fields][0]", "url");
  params.append("populate[variantes][populate][inventario]", "true");

  try {
    const res = await query<DataResponse<Products[]>>(
      `${BASE_ENDPOINT}?${params.toString()}`
    );

    if (!res) {
      return null;
    }

    const data: DataResponse<Products[]> = {
      ...res,
      data: mapProductsWithImages(res.data),
    };

    return data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Products | null> {
  if (!slug) {
    return null;
  }

  const params = new URLSearchParams();

  // Filtro por slug
  params.append("filters[slug][$eq]", slug);

  // Populate datos principales
  params.append("populate[cover]", "true");
  params.append("populate[galeria]", "true");
  params.append("populate[categorias]", "true");
  params.append("populate[marca]", "true");
  params.append("populate[principal]", "true");
  params.append("populate[inventario]", "true");
  params.append("populate[descuento]", "true");

  // Populate variantes y sus relaciones
  params.append("populate[variantes][populate][atributos]", "true");
  params.append("populate[variantes][populate][inventario]", "true");
  params.append("populate[variantes][populate][descuento]", "true");
  params.append("populate[variantes][populate][cover]", "true");
  params.append("populate[variantes][populate][galeria]", "true");
  params.append("populate[variantes][populate][marca]", "true");
  params.append("populate[variantes][populate][categorias]", "true");

  const url = `${BASE_ENDPOINT}?${params.toString()}`;

  try {
    const res = await query<DataResponse<Products[]>>(url);

    if (!res) {
      return null;
    }

    const [product] = mapProductsWithImages(res.data);
    return product;
  } catch (error) {
    console.error("Error al obtener el producto por slug:", error);
    return null;
  }
}

export async function getProductWithVariantesBySlug(
  slug: string
): Promise<Products | null> {
  const product = await getProductBySlug(slug);

  if (!product) {
    return null;
  }

  if (product?.tipo == "variante" && product.principal) {
    const principal = await getProductBySlug(product.principal.slug);
    return principal;
  }
  return product;
}

//  creador de filtros
export function parseProductFilters(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): ProductFilters {
  const getParam = (key: string) => {
    const value =
      searchParams instanceof URLSearchParams
        ? searchParams.get(key)
        : searchParams[key];
    return typeof value === "string" ? value : undefined;
  };

  return {
    search: getParam("search") ? getParam("search") : undefined,
    categorias: getParam("categorias")?.split(",") || [],
    marcas: getParam("marcas")?.split(",") || [],
    precioMin: getParam("precioMin")
      ? Number(getParam("precioMin"))
      : undefined,
    precioMax: getParam("precioMax")
      ? Number(getParam("precioMax"))
      : undefined,
    pageSize: getParam("pageSize") ? Number(getParam("pageSize")) : 10,
    page: getParam("page") ? Number(getParam("page")) : 1,
    sortBy: getParam("sort") ? (getParam("sort") as SortOption) : "featured",
  };
}

export async function getFavoritesProducts(
  ids?: number[]
): Promise<DataResponse<Products[]> | null> {
  const params = new URLSearchParams();

  // Filtrar por IDs si se proporcionan
  if (ids?.length) {
    ids.forEach((id) => {
      params.append("filters[id][$in][]", id.toString());
    });
  }

  // Campos y relaciones a incluir
  params.append("fields[0]", "nombre");
  params.append("fields[1]", "slug");
  params.append("fields[2]", "tipo");
  params.append("populate[descuento]", "true");
  params.append("populate[inventario]", "true");
  params.append("populate[categorias]", "true");
  params.append("populate[marca]", "true");
  params.append("populate[cover][fields][0]", "url");
  params.append("populate[variantes][populate][inventario]", "true");

  try {
    const res = await query<DataResponse<Products[]>>(
      `${BASE_ENDPOINT}?${params.toString()}`
    );

    if (!res) {
      return null;
    }

    const data: DataResponse<Products[]> = {
      ...res,
      data: mapProductsWithImages(res.data),
    };

    return data;
  } catch (error) {
    console.error("Error al obtener los productos favoritos:", error);
    return null;
  }
}

export async function getProductByDocumentId(
  documentId: string
): Promise<Products | null> {
  if (!documentId) {
    return null;
  }

  const params = new URLSearchParams();

  // Populate datos principales
  params.append("populate[cover]", "true");
  params.append("populate[galeria]", "true");
  params.append("populate[categorias]", "true");
  params.append("populate[marca]", "true");
  params.append("populate[principal]", "true");
  params.append("populate[inventario]", "true");
  params.append("populate[descuento]", "true");

  // Populate variantes y sus relaciones
  params.append("populate[variantes][populate][atributos]", "true");
  params.append("populate[variantes][populate][inventario]", "true");
  params.append("populate[variantes][populate][descuento]", "true");
  params.append("populate[variantes][populate][cover]", "true");
  params.append("populate[variantes][populate][galeria]", "true");
  params.append("populate[variantes][populate][marca]", "true");
  params.append("populate[variantes][populate][categorias]", "true");

  const url = `${BASE_ENDPOINT}/${documentId}?${params.toString()}`;

  try {
    const res = await query<DataResponse<Products>>(url);

    if (!res) {
      return null;
    }

    const [product] = mapProductsWithImages([res.data]);
    return product;
  } catch (error) {
    console.error("Error al obtener el producto por slug:", error);
    return null;
  }
}
