from rest_framework import serializers
from .models import Student
from users.models import CustomUser
<<<<<<< HEAD
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
=======

class StudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(source='user.username',write_only=True)
>>>>>>> 52dd3ed4 (first commit)


    class Meta:
        model = Student
<<<<<<< HEAD
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
=======
        fields = ['username', 'first_name', 'last_name', 'email', 'phone_number',
                  'roll_number', 'student_class', 'date_of_birth', 'admission_date',
                  'status', 'assigned_teacher', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        username = validated_data.get('username')  
        print("usernaem", username)
        email = validated_data.get('email')

        if CustomUser.objects.filter(username=username).exists():
            print("bla")
>>>>>>> 52dd3ed4 (first commit)
            raise serializers.ValidationError({'username': 'This username is already taken.'})
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'This email is already registered.'})

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
<<<<<<< HEAD
            phone_number=phone_number,
=======
>>>>>>> 52dd3ed4 (first commit)
            password=password,
            role='Student'
        )

        student = Student.objects.create(user=user, **validated_data)
        return student

<<<<<<< HEAD
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        if 'username' in user_data:
            new_username = user_data['username']
            if CustomUser.objects.exclude(pk=user.pk).filter(username=new_username).exists():
                raise serializers.ValidationError({'username': 'Username already in use.'})
            user.username = new_username

        if 'email' in user_data:
            new_email = user_data['email']
            if CustomUser.objects.exclude(pk=user.pk).filter(email=new_email).exists():
                raise serializers.ValidationError({'email': 'Email already in use.'})
            user.email = new_email

  
        if 'phone_number' in user_data:
            user.phone_number = user_data['phone_number']


        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
=======

>>>>>>> 52dd3ed4 (first commit)
