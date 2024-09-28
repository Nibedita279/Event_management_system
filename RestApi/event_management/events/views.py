from django.http import JsonResponse
from rest_framework import generics, permissions
from .models import Attendee, Event
from .serializer import AttendeeSerializer, EventSerializer, OTPRequestSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import random
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
#from rest_framework.decorators import api_view,permission_classes
from rest_framework.views import APIView


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"username": user.username}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AttendeeListCreateView(generics.ListCreateAPIView):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        event_id = kwargs.get('event_id')
        event = Event.objects.filter(id=event_id).first()
        if not event:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, event=event)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Attendee.objects.filter(event_id=event_id)
    

class SendOTPView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access to send OTP
    
    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            print(email)
            if not email:
                return Response({'error': 'Email is required'}, status=400)
            
            # Generate a random OTP
            otp = str(random.randint(1000, 9999))
            
            # Store OTP in session or database (example uses session for simplicity)
            request.session['otp'] = otp
            
            # Sending the OTP via email
            try:
                send_mail(
                    subject='Your OTP Code',
                    message=f'Your OTP is {otp}. It is valid for 10 minutes.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
                return Response({'success': 'OTP sent successfully'}, status=200)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        
        # If serializer is invalid
        return Response(serializer.errors, status=400)
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access to verify OTP
    
    def post(self, request):
        otp = request.data.get('otp')
       
        
        # Check if OTP is stored in session
        session_otp = request.session.get('otp')
        
        if session_otp is None:
            return Response({'error': 'OTP not found. Please request a new OTP.'}, status=400)
        
        # Check if the OTP matches
        if otp == session_otp:
            # Clear the session OTP once verified (optional)
            del request.session['otp']
            return Response({'success': 'OTP verified successfully'}, status=200)
        else:
            return Response({'error': 'Invalid OTP or OTP expired'}, status=400)