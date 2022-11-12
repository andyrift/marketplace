from django.shortcuts import render
from django.http import HttpResponse

from django.db import connection

def home(request):
	raw_query = "SELECT * FROM apple_sause.roles"
	cursor = connection.cursor()
	cursor.execute(raw_query)
	a = cursor.fetchall()
	context = {
		'roles': a,
		'title': 'Home'
	}
	return render(request, 'store/home.html', context)

def profile(request):
	raw_query = "SELECT * FROM apple_sause.roles where apple_sause.roles.role_id > 1"
	cursor = connection.cursor()
	cursor.execute(raw_query)
	a = cursor.fetchall()
	context = {
		'roles': a,
		'title': 'Home'
	}
	return render(request, 'store/profile.html', context)
def help(request):
	return render(request, 'store/help.html')
def dialogues(request):
	return render(request, 'store/dialogues.html')
def favorites(request):
	return render(request, 'store/favorites.html')
