from django.contrib import admin
from .models import SiteStats, ContactSubmission

class SiteStatsAdmin(admin.ModelAdmin):
    list_display = ('level', 'trophies', 'coins', 'last_daily_reduction_check')

    def has_add_permission(self, request):
        # Prevent adding new instances of SiteStats
        return not SiteStats.objects.exists()

class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'submitted_at')
    search_fields = ('name', 'email')
    list_filter = ('submitted_at',)
    readonly_fields = ('name', 'email', 'message', 'submitted_at')

    # Make the message field more readable
    fieldsets = (
        (None, {
            'fields': ('name', 'email', 'submitted_at')
        }),
        ('Message', {
            'fields': ('message',)
        }),
    )

admin.site.register(SiteStats, SiteStatsAdmin)
admin.site.register(ContactSubmission, ContactSubmissionAdmin)
