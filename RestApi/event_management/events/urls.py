from django.urls import path
from .views import AttendeeListCreateView,  EventListCreateView, EventDetailView, RegisterView, SendOTPView, VerifyOTPView
#from event_management.events import views

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('auth/register/', RegisterView.as_view(), name='register'), 
    path('events/<int:event_id>/attendees/', AttendeeListCreateView.as_view(), name='attendee-list'),
    path('auth/send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
]
