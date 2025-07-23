from django.db import models
<<<<<<< HEAD
from users.models import CustomUser

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='teacher_profile')
=======

class Teacher(models.Model):
>>>>>>> 52dd3ed4 (first commit)
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    )

<<<<<<< HEAD
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
=======
    username = models.CharField(max_length=150, default='temp_teacher') 
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
>>>>>>> 52dd3ed4 (first commit)
    subject_specialization = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50, unique=True)
    date_of_joining = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.subject_specialization}"
