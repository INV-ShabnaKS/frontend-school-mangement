from rest_framework import serializers
from .models import Student
from users.models import CustomUser
from django.core.validators import RegexValidator
from datetime import date
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError


phone_validator = RegexValidator(
    regex=r'^\d{10}$',
    message="Phone number must be exactly 10 digits."
)

class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(source='user.email', read_only=False)
    phone_number = serializers.CharField(validators=[phone_validator], source='user.phone_number')


    def validate_password(self, value):
        try:
            validate_password(value)  
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value


    class Meta:
        model = Student
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone_number',
                  'roll_number', 'student_class', 'date_of_birth', 'admission_date',
                  'status', 'assigned_teacher', 'password']

    def validate(self, data):
        dob = data.get('date_of_birth')
        admission = data.get('admission_date')

        if dob and admission and admission < dob:
            raise serializers.ValidationError("Admission date must be after date of birth.")

        if dob and dob > date.today():
            raise serializers.ValidationError("Date of birth cannot be in the future.")

        if admission and admission > date.today():
            raise serializers.ValidationError("Admission date cannot be in the future.")

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user_data = validated_data.pop('user')
        username = user_data.get('username')
        email = user_data.get('email')
        phone_number = user_data.get('phone_number')

        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError({'username': 'This username is already taken.'})
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'This email is already registered.'})

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            phone_number=phone_number,
            password=password,
            role='Student'
        )

        student = Student.objects.create(user=user, **validated_data)
        return student

