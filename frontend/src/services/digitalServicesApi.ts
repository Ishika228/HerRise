import { API_BASE } from '../config/api';
import {
  DigitalService,
  DigitalServicesCatalog,
  DigitalServicesEnquiry,
  DigitalServicePackage,
  EnquiryInput,
  EnquiryStatus
} from '../types/digitalServices';

const adminTokenKey = 'herrise_digital_services_admin_token';

async function request<T>(path: string, init: RequestInit = {}, admin = false): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (admin) {
    const token = sessionStorage.getItem(adminTokenKey);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(`${API_BASE}/api/digital-services${path}`, { ...init, headers });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Unable to complete the request.');
  return result as T;
}

export const digitalServicesAdminTokenKey = adminTokenKey;

export const getDigitalServicesCatalog = () =>
  request<{ success: true; data: DigitalServicesCatalog }>('/catalog').then((r) => r.data);

export const submitDigitalServicesEnquiry = (input: EnquiryInput) =>
  request<{ success: true; message: string; data: DigitalServicesEnquiry }>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(input)
  }).then((r) => r.data);

export const adminLogin = async (token: string) => {
  const result = await request<{ success: true }>('/admin/session', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
  sessionStorage.setItem(adminTokenKey, token);
  return result;
};

export const adminLogout = () => sessionStorage.removeItem(adminTokenKey);

export const getAdminDashboard = () =>
  request<{
    success: true;
    data: {
      enquiries: DigitalServicesEnquiry[];
      packages: DigitalServicePackage[];
      services: DigitalService[];
      stats: Record<string, number>;
      actualPaymentsTracked: boolean;
    };
  }>(
    '/admin/dashboard',
    {},
    true
  ).then((r) => r.data);

export const saveAdminPackage = (item: Partial<DigitalServicePackage> & { name: string }) =>
  request<{ success: true; data: DigitalServicePackage }>(
    item._id ? `/admin/packages/${item._id}` : '/admin/packages',
    { method: item._id ? 'PUT' : 'POST', body: JSON.stringify(item) },
    true
  ).then((r) => r.data);

export const deleteAdminPackage = (id: string) =>
  request(`/admin/packages/${id}`, { method: 'DELETE' }, true);

export const saveAdminService = (item: Partial<DigitalService> & { title: string }) =>
  request<{ success: true; data: DigitalService }>(
    item._id ? `/admin/services/${item._id}` : '/admin/services',
    { method: item._id ? 'PUT' : 'POST', body: JSON.stringify(item) },
    true
  ).then((r) => r.data);

export const deleteAdminService = (id: string) =>
  request(`/admin/services/${id}`, { method: 'DELETE' }, true);

export const updateEnquiryStatus = (id: string, status: EnquiryStatus) =>
  request<{ success: true; data: DigitalServicesEnquiry }>(
    `/admin/enquiries/${id}/status`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
    true
  ).then((r) => r.data);

export interface QuotationInput {
  items: Array<{ title: string; description?: string; amount: number; optional?: boolean }>;
  discount: number;
  deliveryTimeline: string;
  terms: string;
  paymentTerms: string;
}

export const saveQuotation = (id: string, quote: QuotationInput) =>
  request<{ success: true; data: DigitalServicesEnquiry }>(
    `/admin/enquiries/${id}/quotation`,
    { method: 'PUT', body: JSON.stringify(quote) },
    true
  ).then((r) => r.data);