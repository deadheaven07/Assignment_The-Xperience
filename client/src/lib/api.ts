import { IEvent, IEventSnapshot, IChatMessage, IRiskAlert, ITask, IVendor, ILogistics, ISubEvent } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('plancraft_token');
    }
    return null;
  }

  public setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('plancraft_token', token);
    }
  }

  public clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('plancraft_token');
      localStorage.removeItem('plancraft_user');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `Request failed with status ${res.status}`);
    }

    return res.json();
  }

  // Auth
  public async demoLogin() {
    return this.request<{ success: boolean; token: string; user: any }>('/auth/demo-login', {
      method: 'POST',
    });
  }

  public async login(email: string) {
    return this.request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Events
  public async getEvents(): Promise<{ success: boolean; events: IEvent[] }> {
    return this.request<{ success: boolean; events: IEvent[] }>('/events');
  }

  public async getEventSnapshot(eventId: string): Promise<{ success: boolean } & IEventSnapshot> {
    return this.request<{ success: boolean } & IEventSnapshot>(`/events/${eventId}`);
  }

  public async resetEvent(eventId: string): Promise<{ success: boolean; message: string } & IEventSnapshot> {
    return this.request<{ success: boolean; message: string } & IEventSnapshot>(`/events/${eventId}/reset`, {
      method: 'POST',
    });
  }

  public async updateSubEvent(id: string, updates: Partial<ISubEvent>) {
    return this.request<{ success: boolean; subEvent: ISubEvent }>(`/events/sub-events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async updateTask(id: string, updates: Partial<ITask>) {
    return this.request<{ success: boolean; task: ITask }>(`/events/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async addTask(taskData: Partial<ITask>) {
    return this.request<{ success: boolean; task: ITask }>('/events/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  public async updateVendor(id: string, updates: Partial<IVendor>) {
    return this.request<{ success: boolean; vendor: IVendor }>(`/events/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async updateLogistics(eventId: string, updates: Partial<ILogistics>) {
    return this.request<{ success: boolean; logistics: ILogistics }>(`/events/${eventId}/logistics`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Chat
  public async sendMessage(eventId: string, message: string): Promise<{ success: boolean; aiMessage: IChatMessage } & IEventSnapshot> {
    return this.request<{ success: boolean; aiMessage: IChatMessage } & IEventSnapshot>('/chat', {
      method: 'POST',
      body: JSON.stringify({ eventId, message }),
    });
  }

  public async getChatHistory(eventId: string) {
    return this.request<{ success: boolean; messages: IChatMessage[] }>(`/chat/${eventId}`);
  }

  // Risks & 1-Click AI Actions
  public async getRisks(eventId: string) {
    return this.request<{ success: boolean; risks: IRiskAlert[] }>(`/risks/${eventId}`);
  }

  public async resolveRisk(riskId: string): Promise<{ success: boolean } & IEventSnapshot> {
    return this.request<{ success: boolean } & IEventSnapshot>('/risks/resolve', {
      method: 'POST',
      body: JSON.stringify({ riskId }),
    });
  }

  public async executeRiskAction(actionType: string, payload: Record<string, any>): Promise<{ success: boolean; message: string } & IEventSnapshot> {
    return this.request<{ success: boolean; message: string } & IEventSnapshot>('/risks/action', {
      method: 'POST',
      body: JSON.stringify({ actionType, payload }),
    });
  }
}

export const api = new ApiClient();
