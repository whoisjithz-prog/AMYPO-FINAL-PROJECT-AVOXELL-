from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home_data, name='home_data'),
    path('products/', views.product_list, name='product_list'),
    path('products/<slug:slug>/', views.product_detail, name='product_detail'),
    path('products/<int:product_id>/reviews/', views.add_review, name='add_review'),
    path('categories/', views.category_list, name='category_list'),
    path('brands/', views.brand_list, name='brand_list'),
    path('cart/', views.cart_detail, name='cart_detail'),
    path('cart/items/', views.cart_item_add, name='cart_item_add'),
    path('cart/items/<int:pk>/', views.cart_item_detail, name='cart_item_detail'),
    path('cart/coupon/', views.apply_coupon, name='apply_coupon'),
    path('orders/', views.create_order, name='create_order'),
    path('orders/list/', views.order_list, name='order_list'),
    path('orders/<str:order_no>/', views.order_detail, name='order_detail'),
    path('auth/login/', views.auth_login, name='auth_login'),
]
