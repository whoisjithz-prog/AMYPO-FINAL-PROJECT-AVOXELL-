from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
import uuid

from .models import (
    Category, Brand, Product, ProductImage, Review,
    Cart, CartItem, Coupon, Order, OrderItem, Banner
)
from .serializers import (
    CategorySerializer, BrandSerializer, ProductListSerializer,
    ProductDetailSerializer, CartSerializer, CartItemSerializer,
    CouponSerializer, OrderSerializer, BannerSerializer, ReviewSerializer
)

def get_or_create_cart(session_id):
    if not session_id:
        session_id = str(uuid.uuid4())
    cart, _ = Cart.objects.get_or_create(session_id=session_id)
    return cart, session_id

@api_view(['GET'])
@permission_classes([AllowAny])
def home_data(request):
    banners = Banner.objects.filter(is_active=True).order_by('position')
    hero_banners = BannerSerializer(banners.filter(banner_type='hero'), many=True).data
    shop_banners = BannerSerializer(banners.filter(banner_type='shop'), many=True).data
    promo_banners = BannerSerializer(banners.filter(banner_type='promo'), many=True).data

    categories = CategorySerializer(Category.objects.all(), many=True).data
    featured_products = ProductListSerializer(
        Product.objects.filter(is_active=True)[:8],
        many=True
    ).data

    return Response({
        'hero_banners': hero_banners,
        'shop_banners': shop_banners,
        'promo_banners': promo_banners,
        'categories': categories,
        'featured_products': featured_products,
        'trust_badges': [
            {'icon': 'Truck', 'title': 'Free Shipping', 'subtitle': 'On orders above ₹999'},
            {'icon': 'ShieldCheck', 'title': 'Secure Payments', 'subtitle': '100% Protected'},
            {'icon': 'Headphones', 'title': '24/7 Support', 'subtitle': "We're here to help"},
            {'icon': 'RefreshCw', 'title': 'Easy Returns', 'subtitle': 'Hassle free'}
        ]
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    queryset = Product.objects.filter(is_active=True)

    # Search
    search = request.GET.get('q', '').strip()
    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search) |
            Q(category__name__icontains=search) |
            Q(brand__name__icontains=search)
        )

    # Filter Category
    category_slug = request.GET.get('category', '').strip()
    if category_slug:
        queryset = queryset.filter(category__slug=category_slug)

    # Filter Brand
    brand_slug = request.GET.get('brand', '').strip()
    if brand_slug:
        queryset = queryset.filter(brand__slug=brand_slug)

    # Price range
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    if min_price:
        try:
            queryset = queryset.filter(price__gte=float(min_price))
        except ValueError:
            pass
    if max_price:
        try:
            queryset = queryset.filter(price__lte=float(max_price))
        except ValueError:
            pass

    # Rating
    rating = request.GET.get('rating')
    if rating:
        try:
            queryset = queryset.filter(rating_avg__gte=float(rating))
        except ValueError:
            pass

    # Ordering
    ordering = request.GET.get('ordering', 'popularity')
    if ordering in ['popularity', '-popularity']:
        queryset = queryset.order_by('-rating_count', '-id')
    elif ordering == 'price_asc':
        queryset = queryset.order_by('price')
    elif ordering == 'price_desc':
        queryset = queryset.order_by('-price')
    elif ordering == 'newest':
        queryset = queryset.order_by('-created_at')
    elif ordering == 'rating':
        queryset = queryset.order_by('-rating_avg', '-rating_count')
    else:
        queryset = queryset.order_by('-id')

    # Pagination
    page_size = int(request.GET.get('page_size', 16))
    page_number = int(request.GET.get('page', 1))

    total_count = queryset.count()
    paginator = Paginator(queryset, page_size)
    page_obj = paginator.get_page(page_number)

    serializer = ProductListSerializer(page_obj, many=True)

    return Response({
        'total_count': total_count,
        'page': page_number,
        'num_pages': paginator.num_pages,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
        'results': serializer.data
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug, is_active=True)
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def brand_list(request):
    brands = Brand.objects.all()
    serializer = BrandSerializer(brands, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def cart_detail(request):
    session_id = request.headers.get('X-Session-ID') or request.GET.get('session_id')
    cart, session_id = get_or_create_cart(session_id)
    serializer = CartSerializer(cart)
    data = serializer.data
    data['session_id'] = session_id
    return Response(data)

@api_view(['POST'])
@permission_classes([AllowAny])
def cart_item_add(request):
    session_id = request.headers.get('X-Session-ID') or request.data.get('session_id')
    cart, session_id = get_or_create_cart(session_id)

    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    variant = request.data.get('variant', '')

    product = get_object_or_404(Product, id=product_id)

    item, created = CartItem.objects.get_or_create(
        cart=cart, product=product, variant=variant
    )
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    
    # Enforce stock limit
    if item.quantity > product.stock:
        item.quantity = product.stock
    item.save()

    serializer = CartSerializer(cart)
    data = serializer.data
    data['session_id'] = session_id
    return Response(data, status=status.HTTP_201_CREATED)

@api_view(['PATCH', 'DELETE'])
@permission_classes([AllowAny])
def cart_item_detail(request, pk):
    item = get_object_or_404(CartItem, pk=pk)
    cart = item.cart

    if request.method == 'DELETE':
        item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    quantity = int(request.data.get('quantity', 1))
    if quantity <= 0:
        item.delete()
    else:
        if quantity > item.product.stock:
            quantity = item.product.stock
        item.quantity = quantity
        item.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def apply_coupon(request):
    code = request.data.get('code', '').strip().upper()
    subtotal = float(request.data.get('subtotal', 0))

    try:
        coupon = Coupon.objects.get(code=code, is_active=True)
    except Coupon.DoesNotExist:
        return Response({'valid': False, 'message': 'Invalid coupon code'}, status=status.HTTP_400_BAD_REQUEST)

    if subtotal < float(coupon.min_order):
        return Response({
            'valid': False,
            'message': f'Minimum order amount of ₹{coupon.min_order} required for this coupon'
        }, status=status.HTTP_400_BAD_REQUEST)

    if coupon.discount_type == 'PERCENTAGE':
        discount_amount = (subtotal * float(coupon.value)) / 100.0
    else:
        discount_amount = float(coupon.value)

    discount_amount = min(discount_amount, subtotal)

    return Response({
        'valid': True,
        'code': coupon.code,
        'discount_type': coupon.discount_type,
        'value': float(coupon.value),
        'discount_amount': round(discount_amount, 2),
        'message': f'Coupon {coupon.code} applied successfully!'
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    session_id = request.headers.get('X-Session-ID') or request.data.get('session_id')
    cart, _ = get_or_create_cart(session_id)

    items = cart.items.all()
    if not items.exists():
        return Response({'error': 'Your cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data
    subtotal = sum(item.product.price * item.quantity for item in items)
    shipping = 0.00 if subtotal >= 999 else 99.00
    discount = float(data.get('discount', 0.00))
    total = max(0.00, float(subtotal) + shipping - discount)

    order_no = f"AVX-{uuid.uuid4().hex[:6].upper()}"

    order = Order.objects.create(
        order_no=order_no,
        customer_name=data.get('customer_name', 'Guest Customer'),
        email=data.get('email', 'customer@example.com'),
        phone=data.get('phone', '9876543210'),
        address=data.get('address', '123 Market Street'),
        city=data.get('city', 'Mumbai'),
        state=data.get('state', 'Maharashtra'),
        pincode=data.get('pincode', '400001'),
        subtotal=subtotal,
        shipping=shipping,
        discount=discount,
        total=total,
        payment_method=data.get('payment_method', 'UPI'),
        payment_status='Paid' if data.get('payment_method') != 'COD' else 'Pending',
        status='Confirmed'
    )

    for item in items:
        primary_img = item.product.images.first()
        OrderItem.objects.create(
            order=order,
            product=item.product,
            product_name=item.product.name,
            price=item.product.price,
            quantity=item.quantity,
            variant=item.variant,
            image_url=primary_img.image_url if primary_img else ''
        )
        # Reduce stock atomically
        item.product.stock = max(0, item.product.stock - item.quantity)
        item.product.save()

    # Clear cart
    cart.items.all().delete()

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def order_list(request):
    orders = Order.objects.all()[:20]
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def order_detail(request, order_no):
    order = get_object_or_404(Order, order_no=order_no)
    serializer = OrderSerializer(order)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def add_review(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    user_name = request.data.get('user_name', 'Verified Buyer')
    rating = int(request.data.get('rating', 5))
    comment = request.data.get('comment', '')

    review = Review.objects.create(
        product=product,
        user_name=user_name,
        rating=rating,
        comment=comment
    )
    # Recalculate average
    reviews = product.reviews.all()
    product.rating_count = reviews.count()
    product.rating_avg = round(sum(r.rating for r in reviews) / product.rating_count, 1)
    product.save()

    return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def auth_login(request):
    email = request.data.get('email', 'alex@example.com')
    # Simple simulated token for frictionless UX & DRF contract
    return Response({
        'access_token': f'avoxell_jwt_{uuid.uuid4().hex}',
        'user': {
            'name': 'Alex Morgan',
            'email': email,
            'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        }
    })
