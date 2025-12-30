import { apiService } from './api';

export const dashboardService = {

    getDashboardStats: async (params = {}) => {
        return apiService.get('/dashboard/stats', { params });
    },

    getKittyDashboard: async () => {
        return apiService.get('/dashboard/kitty-leaderboard')
    },

    getRecentSale: async () => {
        return apiService.get('/dashboard/recent-sales')
    },

    getSaleChart: async () => {
        return apiService.get('/dashboard/sales-chart')
    },

    getLowStock: async () => { 
        return apiService.get('/dashboard/low-stock')
    },

}