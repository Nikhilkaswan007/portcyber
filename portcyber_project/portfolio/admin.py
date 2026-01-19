from django.contrib import admin
from .models import SiteStats, ContactSubmission, LogEntry, LogSection

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

class LogSectionInline(admin.TabularInline):
    model = LogSection
    extra = 1  # Number of extra forms to display

class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'log_date', 'status', 'entry_type', 'is_pinned', 'created_at')
    search_fields = ('title', 'status', 'entry_type')
    list_filter = ('is_pinned', 'status', 'entry_type', 'created_at')
    inlines = [LogSectionInline]
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('title', 'log_date', 'status', 'entry_type', 'is_pinned')
        }),
    )

admin.site.register(SiteStats, SiteStatsAdmin)
admin.site.register(ContactSubmission, ContactSubmissionAdmin)
admin.site.register(LogEntry, LogEntryAdmin)
