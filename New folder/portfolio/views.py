from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token

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

@require_http_methods(["POST"])
def submit_contact(request):
    """Handle contact form submissions"""
    try:
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        message = request.POST.get('message', '')
        
        if not all([name, email, message]):
            return JsonResponse({'status': 'error', 'message': 'Missing fields'}, status=400)
        
        # TODO: Send email or save to database
        return JsonResponse({'status': 'success', 'message': 'Message received'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
