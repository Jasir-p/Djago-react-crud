from .views import ListUser,AdminLogin,AdminUserEditView,AdminUserBlockUnblockView,UserDetailsView

from django.urls import path


urlpatterns = [
    path("admins/adminlogin/",AdminLogin.as_view(), name="adminlogin"),
    path("admins/user_list/", ListUser().as_view(), name="userlists"),
    path("admins/userEdit/<int:id>/",AdminUserEditView.as_view(),name="AdminUseredit"),
    path('admins/user/block/<int:user_id>/',AdminUserBlockUnblockView.as_view(),
        name='admin-block-unblock-user'),
    path("check/",UserDetailsView.as_view(),name="check"),
]     
