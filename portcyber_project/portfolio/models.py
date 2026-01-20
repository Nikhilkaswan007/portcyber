from django.db import models
from django.utils import timezone

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Submission from {self.name} at {self.submitted_at.strftime('%Y-%m-%d %H:%M')}"

class SiteStats(models.Model):
    level = models.IntegerField(default=1)
    trophies = models.IntegerField(default=0)
    coins = models.IntegerField(default=5000)
    last_daily_reduction_check = models.DateField(default=timezone.now)

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SiteStats, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    class Meta:
        verbose_name_plural = "Site Stats"


class LogEntry(models.Model):
    title = models.CharField(max_length=200)
    log_date = models.CharField(max_length=100)  # For manual text input like "JANUARY 2026"
    status = models.CharField(max_length=50)
    entry_type = models.CharField(max_length=50)
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def total_content_length(self):
        """Calculate total length of all section content"""
        return sum(len(section.content) for section in self.sections.all())

    @property
    def is_long_content(self):
        """Check if log content is long enough to need truncation"""
        return self.total_content_length > 800  # ~200 words threshold

    class Meta:
        ordering = ['-created_at']

class LogSection(models.Model):
    log_entry = models.ForeignKey(LogEntry, related_name='sections', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        return f"{self.log_entry.title} - {self.title}"
