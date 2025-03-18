import { create } from "apisauce";
import { API_URL } from "@env";
import authStorage from "../auth/storage";
import { navigate } from "./NavigationService";

const api = create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Oavj api bi se mogao koristiti direkt u kodu ali posto sam dosta toga spojio sa ovim servisom
// napravio sam da ovaj httpService koristi apisauce pa dodje na isto pobojsano je

class HttpService {
  async getHeaders() {
    const token = await authStorage.getToken();
    if (token) {
      api.setHeader("Authorization", `Bearer ${token}`);
    }
  }

  handleResponse(response, setUser) {
    // console.log(response.status)
    if (response.status === 401) {
      console.log("dobro e");
      setUser(null);
      console.log("SSSSSSSS");
      authStorage.removeToken();
    }
    // console.log(response)
    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        message: response.statusMessage,
      };
    }

    return response.data;
  }

  async create(resource, data) {
    console.log(API_URL);
    await this.getHeaders();
    const response = await api.post(`/${resource}`, data);
    return this.handleResponse(response);
  }

  async get(resource, setUser) {
    await this.getHeaders();
    const response = await api.get(`/${resource}`);
    return this.handleResponse(response, setUser);
  }

  async getById(resource, id) {
    await this.getHeaders();
    const response = await api.get(`/${resource}/${id}`);
    return this.handleResponse(response);
  }

  async update(resource, data) {
    await this.getHeaders();
    const response = await api.put(`/${resource}`, data);
    return this.handleResponse(response);
  }

  async delete(resource) {
    await this.getHeaders();
    const response = await api.delete(`/${resource}`);
    return this.handleResponse(response);
  }
  async login(resource, data) {
    console.log(API_URL);

    const response = await api.post(`/${resource}`, data);
    return this.handleResponse(response);
  }
}

export default new HttpService();
