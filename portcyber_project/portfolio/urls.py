from django.urls import path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    # Main routes
    path('', views.SystemShellView.as_view(), name='index'),
    path('landing/', views.LandingPageView.as_view(), name='landing'),
    # This will now render the SPA shell (index.html)
    path('dashboard/', views.SystemShellView.as_view(), name='dashboard'), 
    
    # Non-API routes (for direct linking or fallback, if needed)
    path('achievements/', views.AchievementsView.as_view(), name='achievements'),
    path('logs/', views.LogsView.as_view(), name='logs'),
    path('logs/all/', views.AllLogsView.as_view(), name='all_logs'),
    path('creations/', views.CreationsView.as_view(), name='creations'),
    path('services/', views.ServicesView.as_view(), name='services'),
    path('connect/', views.ConnectView.as_view(), name='connect'),

    # API routes for dynamic content loading (fetched by navigation.js)
    path('api/content/dashboard/', views.DashboardView.as_view(), name='api-dashboard'),
    path('api/content/achievements/', views.AchievementsView.as_view(), name='api-achievements'),
    path('api/content/logs/', views.LogsView.as_view(), name='api-logs'),
    path('api/content/logs/all/', views.AllLogsView.as_view(), name='api-all-logs'),
    path('api/content/creations/', views.CreationsView.as_view(), name='api-creations'),
    path('api/content/services/', views.ServicesView.as_view(), name='api-services'),
    path('api/content/service/<str:service_id>/', views.ServiceDetailView.as_view(), name='api-service-detail'),
    path('api/content/connect/', views.ConnectView.as_view(), name='api-connect'),
    path('api/content/profile/', views.ProfileView.as_view(), name='api-profile'),
    
    # Contact form submission API
    path('api/submit-contact/', views.submit_contact, name='api-submit-contact'),
    path('api/claim-reward/', views.claim_reward, name='api-claim-reward'),
    path('api/site-stats/', views.get_site_stats, name='api-site-stats'),
]
