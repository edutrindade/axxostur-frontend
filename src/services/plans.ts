import { api } from "./api";
import type { Plan, CreatePlanData, UpdatePlanData } from "@/types/plan";

export const getPlans = async (): Promise<Plan[]> => {
	const response = await api.get<Plan[]>(`/plans`);
	return response.data;
};

export const createPlan = async (planData: CreatePlanData): Promise<Plan> => {
	const response = await api.post("/plans", planData);
	return response.data;
};

export const updatePlan = async (
	id: string,
	planData: UpdatePlanData,
): Promise<Plan> => {
	const response = await api.put(`/plans/${id}`, planData);
	return response.data;
};
