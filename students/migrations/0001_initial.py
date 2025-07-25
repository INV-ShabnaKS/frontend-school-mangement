# Generated by Django 5.2.4 on 2025-07-10 08:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(max_length=15)),
                ('roll_number', models.CharField(max_length=50, unique=True)),
                ('student_class', models.CharField(max_length=50)),
                ('date_of_birth', models.DateField()),
                ('admission_date', models.DateField()),
                ('status', models.CharField(choices=[('Active', 'Active'), ('Inactive', 'Inactive')], max_length=10)),
                ('assigned_teacher', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='teachers.teacher')),
            ],
        ),
    ]
