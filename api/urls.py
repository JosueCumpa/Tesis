from django.urls import path, include
from rest_framework import routers
from .views import TareaView, tarea_count_api, BuscarTareaView, UserViewSet, login_view, user_view
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView




router = routers.DefaultRouter()
router.register("tarea", TareaView, basename="tarea")
router.register("users", UserViewSet,basename="users")


urlpatterns = [path("v1/", include(router.urls)),
                path("v1/tarea/conteos", tarea_count_api),  
                path("v1/tarea/buscar", BuscarTareaView.as_view()) , 
                path('login/', login_view),
                path('user/', user_view),
        path("api_schema/",get_schema_view(title="Api Tarea", version="1.0.0"),
        name="openapi-schema"),
    path(
        "docs/",
        TemplateView.as_view(
            template_name="docs.html", extra_context={"schema_url": "openapi-schema"}
        ),
        name="swagger-ui",
    ),]



