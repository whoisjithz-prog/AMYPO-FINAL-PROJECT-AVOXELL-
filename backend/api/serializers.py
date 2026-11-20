from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, Review, Cart, CartItem, Coupon, Order, OrderItem, Banner
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'icon', 'display_order', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()

class BrandSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'position', 'is_primary']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    brand_name = serializers.ReadOnlyField(source='brand.name')
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'brand', 'brand_name',
            'price', 'mrp', 'discount_pct', 'rating_avg', 'rating_count',
            'units_sold', 'badge', 'stock', 'primary_image'
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        return primary.image_url if primary else ''

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    brand_name = serializers.ReadOnlyField(source='brand.name')
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    related_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'brand', 'brand_name',
            'description', 'price', 'mrp', 'discount_pct', 'sku', 'stock',
            'rating_avg', 'rating_count', 'units_sold', 'badge', 'features',
            'is_active', 'images', 'reviews', 'related_products'
        ]

    def get_related_products(self, obj):
        related = Product.objects.filter(category=obj.category, is_active=True).exclude(id=obj.id)[:4]
        return ProductListSerializer(related, many=True).data

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'variant', 'total_price']

    def get_total_price(self, obj):
        return float(obj.product.price * obj.quantity)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'session_id', 'items', 'subtotal', 'item_count']

    def get_subtotal(self, obj):
        return sum(item.product.price * item.quantity for item in obj.items.all())

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code', 'discount_type', 'value', 'min_order']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity', 'variant', 'image_url']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_no', 'customer_name', 'email', 'phone', 'address',
            'city', 'state', 'pincode', 'subtotal', 'shipping', 'discount',
            'total', 'payment_method', 'payment_status', 'status', 'created_at', 'items'
        ]

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'title', 'subtitle', 'badge', 'image_url', 'link', 'banner_type', 'position']
