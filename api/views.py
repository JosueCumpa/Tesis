from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView
from .serializer import TareaSerializer, UserSerializer
from rest_framework.response import Response
from .models import Tarea
from rest_framework.schemas.openapi import AutoSchema
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import permission_required
import json
from django.http import JsonResponse


# La vista para listar usuarios, si es necesaria
@api_view(['GET'])
def user_view(request):
   Serializer= UserSerializer(request.user)
   return Response(Serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        print(f'Username: {username}, Password: {password}')
        # Buscar al usuario por nombre de usuario
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None

        if user is not None:
            # Verificar la contraseña ingresada con la contraseña almacenada
            if user.check_password(password):
                if user.is_active:
                    # Iniciar sesión en la sesión actual
                    login(request, user)
                    return JsonResponse({'message': 'Inicio de sesión exitoso'})
                else:
                    return JsonResponse({'message': 'La cuenta de usuario está deshabilitada'}, status=400)
            else:
                return JsonResponse({'message': 'Credenciales de inicio de sesión no válidas'}, status=400)
        else:
            return JsonResponse({'message': 'nose encontro usuario'}, status=400)

    return JsonResponse({'message': 'La vista solo admite solicitudes POST'}, status=400)

# La vista para listar tareas, si es necesaria

class TareaView(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    pagination_class = LimitOffsetPagination


def tarea_count_api(request):
    # Obtener el conteo total de registros
    count = Tarea.objects.count()
    # Obtener el conteo de registros activos
    conteo_activos = Tarea.objects.filter(estado=True).count()
    # Obtener el conteo de registros inactivos
    conteo_inactivos = Tarea.objects.filter(estado=False).count()
    # Crear un diccionario con los conteos
    data = {'count': count,'conteo_activos': conteo_activos,
        'conteo_inactivos': conteo_inactivos}
    # Retornar los conteos como respuesta JSON 
    return JsonResponse(data)

class BuscarTareaView(APIView):
    def get(self, request):
        nombre = request.query_params.get("nombre", "")
        # Validar que el parámetro de nombre solo contenga números y texto
        if not nombre.isalnum():
            return Response({"error": "El parámetro de nombre debe contener solo números y texto."}, status=400)
        
        # Filtrar las tareas que coincidan con el nombre utilizando Q objects
        query = Q(nombre__icontains=nombre)
        tareas = Tarea.objects.filter(query)
        
        serializer = TareaSerializer(tareas, many=True)
        return Response(serializer.data)
    
def user_list_api(request):
    users = User.objects.all()
    # Si deseas retornar JSON en lugar de una plantilla HTML
    users_data = [{'id': user.id, 'username': user.username} for user in users]
    return JsonResponse(users_data, safe=False)



    
