from django.shortcuts import render
from django.views import View

class LandingPageView(View):
    def get(self, request):
        return render(request, 'landing.html')

class DashboardView(View):
    def get(self, request):
        context = {
            'level': 48,
            'coins': '1,425',
            'profile_name': 'Nikhil Kaswan',
            'profile_title': 'Web Developer',
            'company': 'Legacy.ai',
        }
        return render(request, 'dashboard.html', context)

class AchievementsView(View):
    def get(self, request):
        context = {
            'level': 48,
            'coins': '1,425',
            'profile_name': 'Nikhil Kaswan',
            'profile_title': 'Web Developer',
        }
        return render(request, 'achievements.html', context)

class LogsView(View):
    def get(self, request):
        context = {
            'level': 48,
            'coins': '1,425',
            'profile_name': 'Nikhil Kaswan',
            'profile_title': 'Web Developer',
        }
        return render(request, 'logs.html', context)

class CreationsView(View):
    def get(self, request):
        context = {
            'level': 48,
            'coins': '1,425',
            'profile_name': 'Nikhil Kaswan',
            'profile_title': 'Web Developer',
        }
        return render(request, 'creations.html', context)
