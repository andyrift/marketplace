from django.shortcuts import render
from django.http import HttpResponse

from django.db import connection

def home(request):
	raw_query = "SELECT * FROM apple_sause.roles"

	cursor = connection.cursor()
	cursor.execute(raw_query)
	return HttpResponse("<h1>Store Home Page</h1> <div>{result}</div>".format(result = cursor.fetchall()))
