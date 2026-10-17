import { apiFetch } from "@/lib/api";

export interface Dashboard {
    totalProducts: number;
    totalStockUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
}

export async function getDashboard(): Promise<Dashboard> {
    return apiFetch<Dashboard>("/dashboard");
}