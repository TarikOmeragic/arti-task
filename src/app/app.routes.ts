import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'chatbots'
    },
    {
        path: 'chatbots',
        loadComponent: () => import('./pages/chatbot-list-page/chatbot-list-page').then(m => m.ChatbotListPage)
    },
    {
        path: 'chatbots/:id',
        loadComponent: () => import('./pages/chatbot-chat-page/chatbot-chat-page').then(m => m.ChatbotChatPage)
    },
    {
        path: '**',
        redirectTo: 'chatbots'
    }
];
