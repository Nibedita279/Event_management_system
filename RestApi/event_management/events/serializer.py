from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Attendee, Event

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'time', 'location', 'ticket_price', 'privacy']

class AttendeeSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(), source='event')

    class Meta:
        model = Attendee
        fields = ['id', 'user', 'event', 'event_id', 'ticket_type']

class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        # Add any custom validation if needed
        if not value:
            raise serializers.ValidationError("Email is required.")
        return value