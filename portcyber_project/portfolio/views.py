from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.template.loader import render_to_string
from .models import SiteStats, ContactSubmission, LogEntry
from django.db.models import Q
from django.utils import timezone
import json

# Dummy data for service details (in a real app, this would be from a DB)
SERVICE_DETAILS = {
    "web_dev": {
        "title": "Web Development",
        "brief": "Frontend & Full-Stack Applications",
        "description": "Building modern web applications with React, Vue, or vanilla JavaScript. Full-stack development with Django, Node.js, or other backends, focusing on performance, scalability, and security.",
        "features": ["SPA (Single Page Applications)", "Progressive Web Apps (PWA)", "Full-Stack Web Development", "REST API Development", "Real-time Applications", "Performance Optimization", "Secure API Endpoints", "Database Integration"],
        "usecases": "Perfect for startups needing a robust online presence, established businesses looking to modernize their platforms, or anyone requiring custom web solutions with a focus on performance and user experience. Ideal for e-commerce, custom CRMs, and interactive dashboards.",
        "outcome": "A high-performance, secure, and scalable web application tailored to your specific business needs, driving engagement and delivering measurable results. Expect enhanced user satisfaction and streamlined operations.",
        "image": "https://via.placeholder.com/900x500/001428/00ff88?text=WEB_DEV_DETAIL",
        "gallery": [
            "https://via.placeholder.com/600x400/001428/00ff88?text=WEB_DEV_GALLERY_1",
            "https://via.placeholder.com/600x400/001428/00ff88?text=WEB_DEV_GALLERY_2",
            "https://via.placeholder.com/600x400/001428/00ff88?text=WEB_DEV_GALLERY_3",
        ],
        "status": "ACTIVE",
        "codename": "Project_Nighthawk"
    },
    "ui_ux": {
        "title": "UI / UX Design",
        "brief": "Interfaces & Experience",
        "description": "Creating intuitive and visually stunning user interfaces with a focus on user experience, accessibility, and human-computer interaction principles. Translating complex ideas into delightful digital experiences.",
        "features": ["User Interface Design (UI)", "User Experience Research (UX)", "Wireframing & Prototyping", "Design Systems Development", "Accessibility Compliance (WCAG)", "Mobile App Design", "Usability Testing", "Interaction Design"],
        "usecases": "Ideal for products that need a strong first impression, applications requiring seamless user flows, or businesses aiming to improve customer satisfaction and reduce support costs through intuitive design. Applicable across web, mobile, and desktop platforms.",
        "outcome": "A beautifully crafted, user-centric interface that not only looks great but also provides an effortless and enjoyable experience for your users, leading to higher conversion and retention rates and a stronger brand identity.",
        "image": "https://via.placeholder.com/900x500/001428/ff3366?text=UI_UX_DETAIL",
        "gallery": [
            "https://via.placeholder.com/600x400/001428/ff3366?text=UI_UX_GALLERY_1",
            "https://via.placeholder.com/600x400/001428/ff3366?text=UI_UX_GALLERY_2",
        ],
        "status": "ACTIVE",
        "codename": "Aesthetic_Protocol"
    },
    "sys_arch": {
        "title": "System Architecture",
        "brief": "Scalable Digital Systems",
        "description": "Designing robust, scalable, and resilient digital infrastructures. Focus on modularity, performance optimization, security best practices, and creating future-proof solutions for complex enterprise challenges.",
        "features": ["System Design & Planning", "Microservices Architecture", "Cloud Infrastructure Deployment (AWS, Azure, GCP)", "Database Design & Optimization", "API Architecture & Security", "Performance & Load Balancing", "High Availability Solutions", "Disaster Recovery Planning"],
        "usecases": "Essential for projects expecting high traffic, complex data interactions, or requiring integration with various external systems. Suited for enterprises building mission-critical applications, scaling their digital presence, or undergoing digital transformation.",
        "outcome": "A resilient, high-performing, and secure system architecture that forms a solid foundation for your applications, allowing for future growth and adaptation without significant overhauls, ensuring operational stability and cost efficiency.",
        "image": "https://via.placeholder.com/900x500/001428/ffd700?text=ARCH_DETAIL",
        "gallery": [
            "https://via.placeholder.com/600x400/001428/ffd700?text=ARCH_GALLERY_1",
            "https://via.placeholder.com/600x400/001428/ffd700?text=ARCH_GALLERY_2",
            "https://via.placeholder.com/600x400/001428/ffd700?text=ARCH_GALLERY_3",
        ],
        "status": "ACTIVE",
        "codename": "Gridlock_Bypass"
    },
    "consulting": {
        "title": "Consulting",
        "brief": "Technical Guidance & Strategy",
        "description": "Providing expert technical guidance and strategic insights to optimize development processes, resolve complex issues, and navigate the evolving tech landscape. Guiding businesses through technological challenges and opportunities.",
        "features": ["Technology Selection & Roadmapping", "Code Review & Refactoring", "Team Training & Mentorship", "Best Practices & Standards Implementation", "DevOps & CI/CD Strategy", "Project & Product Planning", "Security Audits", "Digital Transformation Strategy"],
        "usecases": "Valuable for teams facing technical bottlenecks, businesses planning a new technology initiative, or leaders seeking an external expert perspective on their digital strategy and execution. Particularly useful for mitigating risks and accelerating innovation.",
        "outcome": "Clear, actionable strategies and expert advice that empower your team, streamline your development, and ensure your technology investments are aligned with your business objectives, leading to enhanced efficiency, innovation, and a stronger competitive edge.",
        "image": "https://via.placeholder.com/900x500/001428/888?text=CONSULTING_DETAIL",
        "gallery": [
            "https://via.placeholder.com/600x400/001428/888?text=CONSULTING_GALLERY_1",
            "https://via.placeholder.com/600x400/001428/888?text=CONSULTING_GALLERY_2",
        ],
        "status": "ACTIVE",
        "codename": "Insight_Protocol"
    }
}


class LandingPageView(View):
    def get(self, request):
        return render(request, 'landing.html')

class SystemShellView(View):
    def get(self, request):
        site_stats = SiteStats.load()

        # Daily coin reduction logic
        today = timezone.now().date()
        if site_stats.last_daily_reduction_check < today:
            days_since_last_check = (today - site_stats.last_daily_reduction_check).days
            reduction = days_since_last_check * 5
            site_stats.coins = max(0, site_stats.coins - reduction)
            site_stats.last_daily_reduction_check = today
            site_stats.save()

        context = {
            'level': site_stats.level,
            'trophies': site_stats.trophies,
            'coins': site_stats.coins,
            'profile_name': 'Nikhil Kaswan', # This is now static
            'profile_title': 'Web Developer',
            'company': 'Legacy.ai',
        }
        return render(request, 'index.html', context)

class DashboardView(View):
    def get(self, request):
        html_fragment = render_to_string('modules/_dashboard_fragment.html', request=request)
        return HttpResponse(html_fragment)

class AchievementsView(View):
    def get(self, request):
        html_fragment = render_to_string('modules/_achievements_fragment.html', request=request)
        return HttpResponse(html_fragment)

class LogsView(View):
    def get(self, request):
        all_logs = LogEntry.objects.prefetch_related('sections').order_by('-created_at')
        
        pinned_logs = all_logs.filter(is_pinned=True)
        recent_logs = all_logs.filter(is_pinned=False)[:3]
        
        context = {
            'recent_logs': recent_logs,
            'pinned_logs': pinned_logs,
        }
        
        html_fragment = render_to_string('modules/_logs_fragment.html', context, request=request)
        return HttpResponse(html_fragment)

class LogDetailView(View):
    def get(self, request, pk):
        log = get_object_or_404(LogEntry, pk=pk)
        context = {
            'log': log,
        }
        html_fragment = render_to_string('modules/_log_detail_fragment.html', context, request=request)
        return HttpResponse(html_fragment)

class AllLogsView(View):
    def get(self, request):
        logs = LogEntry.objects.prefetch_related('sections').all()

        # Search
        query = request.GET.get('q')
        search_content = request.GET.get('search_content')
        if query:
            search_fields = Q(title__icontains=query)
            if search_content:
                search_fields |= Q(sections__content__icontains=query)
            logs = logs.filter(search_fields).distinct()

        # Sort
        sort_by = request.GET.get('sort', '-created_at')
        logs = logs.order_by(sort_by)

        context = {
            'logs': logs,
            'search_query': query or "",
            'search_content': search_content,
            'sort_by': sort_by,
        }
        
        html_fragment = render_to_string('modules/_all_logs_fragment.html', context, request=request)
        return HttpResponse(html_fragment)

class CreationsView(View):
    def get(self, request):
        html_fragment = render_to_string('modules/_creations_fragment.html', request=request)
        return HttpResponse(html_fragment)

class ServicesView(View):
    def get(self, request):
        html_fragment = render_to_string('modules/_services_fragment.html', request=request)
        return HttpResponse(html_fragment)

class ServiceDetailView(View):
    def get(self, request, service_id):
        service_data = SERVICE_DETAILS.get(service_id)
        if not service_data:
            return HttpResponse("Service not found", status=404)
        
        context = {
            'service': service_data,
            'service_id': service_id,
        }
        html_fragment = render_to_string('modules/_service_detail_fragment.html', context, request=request)
        return HttpResponse(html_fragment)

class ConnectView(View):
    def get(self, request):
        html_fragment = render_to_string('modules/_connect_fragment.html', request=request)
        return HttpResponse(html_fragment)

class ProfileView(View):
    def get(self, request):
        context = {
            'profile_name': 'Nikhil Kaswan', # This is now static
            'profile_title': 'Web Developer',
            'company': 'Legacy.ai',
        }
        html_fragment = render_to_string('modules/_profile_fragment.html', context, request=request)
        return HttpResponse(html_fragment)

@require_http_methods(["GET"])
def get_site_stats(request):
    site_stats = SiteStats.load()
    return JsonResponse({
        'level': site_stats.level,
        'trophies': site_stats.trophies,
        'coins': site_stats.coins
    })

from django.views.decorators.csrf import csrf_exempt

# ... (other code)

@csrf_exempt
@require_http_methods(["POST"])
def claim_reward(request):
    try:
        data = json.loads(request.body)
        reward_type = data.get('reward_type')
        site_stats = SiteStats.load()

        if reward_type == 'trophy':
            site_stats.trophies += 5
            if site_stats.trophies >= 100:
                site_stats.level += 1
                site_stats.trophies -= 100
        elif reward_type == 'coin':
            site_stats.coins += 25
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid reward type'}, status=400)
        
        site_stats.save()
        return JsonResponse({
            'status': 'success',
            'level': site_stats.level,
            'trophies': site_stats.trophies,
            'coins': site_stats.coins
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@require_http_methods(["POST"])
def submit_contact(request):
    """Handle contact form submissions"""
    try:
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        message = request.POST.get('message', '')
        
        if not all([name, email, message]):
            return JsonResponse({'status': 'error', 'message': 'Missing fields'}, status=400)
        
        ContactSubmission.objects.create(name=name, email=email, message=message)
        
        return JsonResponse({'status': 'success', 'message': 'Message received'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

