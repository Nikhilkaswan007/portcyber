from django.urls import path
from . import views

urlpatterns = [
    # Main routes
    path('', views.LandingPageView.as_view(), name='index'),
    path('landing/', views.LandingPageView.as_view(), name='landing'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('achievements/', views.AchievementsView.as_view(), name='achievements'),
    path('logs/', views.LogsView.as_view(), name='logs'),
    path('creations/', views.CreationsView.as_view(), name='creations'),
    
    # Contact form submission
    path('api/submit-contact/', views.submit_contact, name='api-submit-contact'),
]
