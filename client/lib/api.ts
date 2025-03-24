import { AxiosError } from 'axios';

// Point to the backend server
const API_URL = 'http://localhost:5543';

export type AlertType = 'System exception' | 'Scheduled start failure' | 'Runtime Exceeded' | 'Terminated' | null;

export interface Robot {
  id: number;
  name: string;
  status: boolean;
  alert: AlertType;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error handler
const handleApiError = (error: unknown) => {
  console.log('API Error:', error);
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiResponse<any>>;
    console.log('Axios Error Details:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      url: axiosError.config?.url,
      method: axiosError.config?.method
    });
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    if (axiosError.response?.status === 404) {
      throw new Error('Resource not found');
    }
    if (axiosError.response?.status === 500) {
      throw new Error('Internal server error');
    }
    throw new Error(axiosError.message);
  }
  throw error;
};

export const robotsApi = {
  // Get all robots
  getAllRobots: async (): Promise<Robot[]> => {
    try {
      console.log('Fetching robots from:', `${API_URL}/api/robots`);
      const response = await fetch(`${API_URL}/api/robots`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetch API Response:', data);
      
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error in getAllRobots:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  // Get a specific robot
  getRobot: async (id: number): Promise<Robot> => {
    try {
      const api = await import('axios').then(({ default: axios }) => axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      }));
      const response = await api.get<ApiResponse<Robot>>(`/api/robots/${id}`);
      console.log('API Response:', response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch robot');
      }
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create a new robot
  createRobot: async (robot: Omit<Robot, 'id'>): Promise<Robot> => {
    try {
      const api = await import('axios').then(({ default: axios }) => axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      }));
      const response = await api.post<ApiResponse<Robot>>('/api/robots', robot);
      console.log('API Response:', response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create robot');
      }
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update a robot
  updateRobot: async (id: number, robot: Partial<Robot>): Promise<Robot> => {
    try {
      const api = await import('axios').then(({ default: axios }) => axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      }));
      const response = await api.put<ApiResponse<Robot>>(`/api/robots/${id}`, robot);
      console.log('API Response:', response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update robot');
      }
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update robot status
  updateRobotStatus: async (id: number): Promise<Robot> => {
    try {
      const api = await import('axios').then(({ default: axios }) => axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      }));
      const response = await api.patch<ApiResponse<Robot>>(`/api/robots/${id}`);
      console.log('API Response:', response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update robot status');
      }
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update robot alert
  updateRobotAlert: async (id: number, alert: AlertType): Promise<Robot> => {
    try {
      const api = await import('axios').then(({ default: axios }) => axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      }));
      const response = await api.patch<ApiResponse<Robot>>(`/api/robots/${id}/alert`, { alert });
      console.log('API Response:', response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update robot alert');
      }
      return response.data.data!;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete a robot
  deleteRobot: async (id: number): Promise<void> => {
    try {
      const api = await import('axios').then(({ default: axios }) => axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      }));
      const response = await api.delete<ApiResponse<void>>(`/api/robots/${id}`);
      console.log('API Response:', response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete robot');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 