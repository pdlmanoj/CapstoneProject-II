from django.urls import path
from .views import GenerateRoadmapView, GetResourcesView

urlpatterns = [
    path('generate/', GenerateRoadmapView.as_view(), name='generate-roadmap'),
    path('resources/', GetResourcesView.as_view(), name='get-resources'),
]
