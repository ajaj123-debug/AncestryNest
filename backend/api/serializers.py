from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Person

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'
        read_only_fields = ['owner']

    def create(self, validated_data):
        return super().create(validated_data)

class RecursivePersonSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ['id', 'name', 'gender', 'spouse_name', 'birth_year', 'death_year', 'profession', 'notes', 'parent', 'children']

    def get_children(self, obj):
        return RecursivePersonSerializer(obj.children.all(), many=True).data
