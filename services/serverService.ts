import { URL_PATH } from "@/constants/url";
import { SignUp, SignIn, GetSession } from "@/models/auth.model";
import { ProductData } from "@/models/product.model";
import { UserData } from "@/models/user.model";
import httpClient from "@/utils/httpClient";

type signProps = {
  username: string;
  password: string;
};

export const signUp = async (user: signProps): Promise<SignUp> => {
  const response = await httpClient.post<SignUp>(URL_PATH.AUTH.REGISTER, user);
  return response.data;
};

export const signIn = async (user: signProps): Promise<SignIn> => {
  const { data: response } = await httpClient.post<SignIn>(
    URL_PATH.AUTH.SIGNIN,
    user,
    {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
    }
  );
  return response;
};

export const signOut = async () => {
  const response = await httpClient.get(URL_PATH.AUTH.SIGNOUT, {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
  });
  return response.data;
};

export const getSession = async (): Promise<GetSession> => {
  const response = await httpClient.get(URL_PATH.AUTH.SESSION, {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
  });

  return response.data;
};

export const getProducts = async (keyword?: string): Promise<ProductData[]> => {
  if (keyword) {
    return (
      await httpClient.get(`${URL_PATH.STOCK.PRODUCT}/keyword/${keyword}`)
    ).data;
  } else {
    return (await httpClient.get(`${URL_PATH.STOCK.PRODUCT}`)).data;
  }
};

export const doGetStockById = async (id: string) => {
  const response = await httpClient.get(`${URL_PATH.STOCK.PRODUCT}/${id}`);
  return response.data;
};

export const addProduct = async (data: FormData): Promise<void> => {
  await httpClient.post(`${URL_PATH.STOCK.PRODUCT}`, data);
};

export const editProduct = async (data: FormData): Promise<void> => {
  await httpClient.put(`${URL_PATH.STOCK.PRODUCT}`, data);
};

export const deleteProduct = async (id?: string): Promise<void> => {
  await httpClient.delete(`${URL_PATH.STOCK.PRODUCT}/${id}`);
};
