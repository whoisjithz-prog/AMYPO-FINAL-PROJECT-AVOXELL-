from django.core.management.base import BaseCommand
from api.models import Category, Brand, Product, ProductImage, Review, Coupon, Banner, Cart, CartItem

class Command(BaseCommand):
    help = 'Seeds initial database with Avoxell catalogue, categories, and banners'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Avoxell data...")

        # Clear existing
        Review.objects.all().delete()
        ProductImage.objects.all().delete()
        CartItem.objects.all().delete()
        Cart.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Brand.objects.all().delete()
        Coupon.objects.all().delete()
        Banner.objects.all().delete()

        # Categories
        cat_data = [
            {'name': 'Electronics', 'slug': 'electronics', 'icon': 'Headphones', 'display_order': 1, 'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Fashion', 'slug': 'fashion', 'icon': 'Shirt', 'display_order': 2, 'image': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Home & Living', 'slug': 'home-living', 'icon': 'Lamp', 'display_order': 3, 'image': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Beauty', 'slug': 'beauty', 'icon': 'Sparkles', 'display_order': 4, 'image': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Sports', 'slug': 'sports', 'icon': 'Dumbbell', 'display_order': 5, 'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Accessories', 'slug': 'accessories', 'icon': 'Watch', 'display_order': 6, 'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'},
        ]
        cats = {}
        for c in cat_data:
            cats[c['slug']] = Category.objects.create(**c)

        # Brands
        brand_names = ['Apple', 'Samsung', 'Sony', 'Nike', 'Avoxell', 'Others']
        brands = {}
        for b in brand_names:
            brands[b.lower()] = Brand.objects.create(name=b, slug=b.lower())

        # Coupons
        Coupon.objects.create(code='AVOXELL10', discount_type='PERCENTAGE', value=10.00, min_order=1500.00)
        Coupon.objects.create(code='WELCOME500', discount_type='FLAT', value=500.00, min_order=2000.00)
        Coupon.objects.create(code='FESTIVE20', discount_type='PERCENTAGE', value=20.00, min_order=4000.00)

        # Banners
        Banner.objects.create(
            title="Dream Bigger. Shop Smarter.",
            subtitle="Premium quality. Unbeatable prices.",
            badge="A Avoxell",
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            link="/shop",
            banner_type="hero",
            position=1
        )
        Banner.objects.create(
            title="Smart Choices. Better Living.",
            subtitle="Explore our exclusive collection",
            badge="Exclusive Offer",
            image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            link="/shop",
            banner_type="shop",
            position=2
        )
        Banner.objects.create(
            title="Up to 60% OFF",
            subtitle="Limited Time Only! Grab your favorites before stocks run out.",
            badge="Flash Sale",
            image_url="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
            link="/shop",
            banner_type="promo",
            position=3
        )

        # Products
        products_data = [
            {
                'name': 'Avoxell ProPods Wireless Headphones',
                'slug': 'avoxell-propods-wireless-headphones',
                'category': cats['electronics'],
                'brand': brands['avoxell'],
                'price': 4999.00,
                'mrp': 7999.00,
                'discount_pct': 37,
                'sku': 'AVX-PRP-01',
                'stock': 45,
                'rating_avg': 4.8,
                'rating_count': 12450,
                'units_sold': '1M+ sold',
                'badge': 'Best Seller',
                'description': 'Immerse yourself in premium sound with Avoxell ProPods. Designed for comfort, built for performance with aerospace-grade acoustic chambers and ultra-soft memory foam earcups.',
                'features': [
                    'Active Noise Cancellation with Hybrid Transparency Mode',
                    'Up to 40hrs Battery Life with Fast Charge (5 mins = 4 hrs)',
                    'Premium Sound Quality powered by custom 40mm titanium drivers',
                    'Spatial Audio with dynamic head tracking',
                    'Multi-point Bluetooth 5.3 connection for seamless device switching'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Smart Watch',
                'slug': 'avoxell-smart-watch',
                'category': cats['accessories'],
                'brand': brands['apple'],
                'price': 7999.00,
                'mrp': 12999.00,
                'discount_pct': 38,
                'sku': 'AVX-SW-02',
                'stock': 30,
                'rating_avg': 4.7,
                'rating_count': 8120,
                'units_sold': '500k+ sold',
                'badge': 'Popular',
                'description': 'Stay connected, track your vitals and elevate your daily fitness with the all-new Avoxell Smart Watch. High-resolution AMOLED curved display.',
                'features': [
                    'Always-On Retina AMOLED Display with sapphire glass',
                    'Advanced ECG and SpO2 Blood Oxygen sensors',
                    '50m Water Resistance suitable for swimming',
                    'Up to 7 days battery standby'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Backpack',
                'slug': 'avoxell-backpack',
                'category': cats['fashion'],
                'brand': brands['avoxell'],
                'price': 2499.00,
                'mrp': 4999.00,
                'discount_pct': 50,
                'sku': 'AVX-BPK-03',
                'stock': 85,
                'rating_avg': 4.6,
                'rating_count': 6340,
                'units_sold': '200k+ sold',
                'badge': 'Hot Deal',
                'description': 'Engineered for modern urban commuters. Water-repellent ballistic nylon with dedicated 16-inch shockproof laptop sleeve and anti-theft hidden pockets.',
                'features': [
                    'Waterproof 900D Cordura exterior',
                    'Padded 16" MacBook compartment',
                    'Integrated USB charging pass-through port',
                    'Ergonomic airflow back support panel'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Sneakers',
                'slug': 'avoxell-sneakers',
                'category': cats['sports'],
                'brand': brands['nike'],
                'price': 3999.00,
                'mrp': 6999.00,
                'discount_pct': 43,
                'sku': 'AVX-SNK-04',
                'stock': 24,
                'rating_avg': 4.7,
                'rating_count': 7200,
                'units_sold': '350k+ sold',
                'badge': 'Trending',
                'description': 'Featherlight breathable athletic trainers. Cushion-glide foam midsole provides energy return with every stride.',
                'features': [
                    'High-rebound responsive foam sole',
                    'Breathable engineered mesh upper',
                    'Slip-resistant multidirectional rubber traction'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell ProPods Earbuds',
                'slug': 'avoxell-propods-earbuds',
                'category': cats['electronics'],
                'brand': brands['samsung'],
                'price': 3499.00,
                'mrp': 5499.00,
                'discount_pct': 36,
                'sku': 'AVX-EAR-05',
                'stock': 60,
                'rating_avg': 4.8,
                'rating_count': 12000,
                'units_sold': '800k+ sold',
                'badge': 'Best Seller',
                'description': 'True wireless earbuds delivering crystal-clear acoustics and deep bass in a pocketable wireless charging case.',
                'features': [
                    'ENC quad-mic setup for studio-clarity calls',
                    'Low-latency 45ms gaming mode',
                    'Wireless Qi charging compatible case'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Ultra Laptop Pro',
                'slug': 'avoxell-ultra-laptop-pro',
                'category': cats['electronics'],
                'brand': brands['apple'],
                'price': 64999.00,
                'mrp': 79999.00,
                'discount_pct': 18,
                'sku': 'AVX-LPT-06',
                'stock': 12,
                'rating_avg': 4.9,
                'rating_count': 4500,
                'units_sold': '90k+ sold',
                'badge': 'Premium',
                'description': 'Ultra-thin aircraft aluminum unibody, high-res Liquid Retina display and 18-hour all-day battery efficiency.',
                'features': [
                    '14.2-inch Liquid Retina XDR display',
                    'Next-generation 12-core architecture',
                    'MagSafe fast charge port'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell 360 Acoustic Speaker',
                'slug': 'avoxell-360-acoustic-speaker',
                'category': cats['electronics'],
                'brand': brands['sony'],
                'price': 3499.00,
                'mrp': 5999.00,
                'discount_pct': 41,
                'sku': 'AVX-SPK-07',
                'stock': 40,
                'rating_avg': 4.6,
                'rating_count': 9200,
                'units_sold': '400k+ sold',
                'badge': '',
                'description': 'Omnidirectional 360-degree sound with dual passive bass radiators and woven fabric acoustic shield.',
                'features': [
                    'IPX7 submersible waterproof rating',
                    'PartyBoost link mode to pair 100+ speakers',
                    '16-hour playtime on a single charge'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Eau De Parfum (L\'Aura)',
                'slug': 'avoxell-eau-de-parfum-laura',
                'category': cats['beauty'],
                'brand': brands['others'],
                'price': 2899.00,
                'mrp': 4500.00,
                'discount_pct': 35,
                'sku': 'AVX-PRF-08',
                'stock': 50,
                'rating_avg': 4.8,
                'rating_count': 3100,
                'units_sold': '150k+ sold',
                'badge': 'Luxury',
                'description': 'Captivating blend of bergamot, French lavender, cedarwood, and white amber. Handcrafted in Grasse, France.',
                'features': [
                    'Long-lasting 14-hour sillage',
                    'Cruelty-free & sustainably sourced essences',
                    'Architectural crystal glass flacon'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Polarized Classic Sunglasses',
                'slug': 'avoxell-polarized-classic-sunglasses',
                'category': cats['fashion'],
                'brand': brands['others'],
                'price': 1899.00,
                'mrp': 3200.00,
                'discount_pct': 40,
                'sku': 'AVX-SGL-09',
                'stock': 70,
                'rating_avg': 4.5,
                'rating_count': 2800,
                'units_sold': '120k+ sold',
                'badge': '',
                'description': 'Handcrafted Italian acetate frames with TAC 9-layer polarized anti-glare lenses.',
                'features': [
                    '100% UV400 full ultraviolet protection',
                    'Reinforced 5-barrel German hinges',
                    'Includes hard protective case and microfiber cloth'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Minimalist Comfort Hoodie',
                'slug': 'avoxell-minimalist-comfort-hoodie',
                'category': cats['fashion'],
                'brand': brands['avoxell'],
                'price': 2199.00,
                'mrp': 3999.00,
                'discount_pct': 45,
                'sku': 'AVX-HOD-10',
                'stock': 90,
                'rating_avg': 4.7,
                'rating_count': 5400,
                'units_sold': '230k+ sold',
                'badge': '',
                'description': '420 GSM heavy-weight organic French Terry cotton for supreme softness and relaxed luxury fit.',
                'features': [
                    '100% Pre-shrunk organic combed cotton',
                    'Kangaroo pocket with concealed zipper coin stash',
                    'Double-layered hood with metal aglets'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Smart Ambient Lamp',
                'slug': 'avoxell-smart-ambient-lamp',
                'category': cats['home-living'],
                'brand': brands['others'],
                'price': 2199.00,
                'mrp': 3499.00,
                'discount_pct': 37,
                'sku': 'AVX-LMP-11',
                'stock': 35,
                'rating_avg': 4.7,
                'rating_count': 1900,
                'units_sold': '85k+ sold',
                'badge': '',
                'description': '16 million colors with circadian rhythm warm dimming and gentle sunrise wake-up alarm.',
                'features': [
                    'Touch capacitive dimming ring',
                    'Smart assistant integration (Alexa, Google, Siri)',
                    'Integrated wireless phone charging base'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80'
                ]
            },
            {
                'name': 'Avoxell Botanical Skincare Elixir',
                'slug': 'avoxell-botanical-skincare-elixir',
                'category': cats['beauty'],
                'brand': brands['others'],
                'price': 1699.00,
                'mrp': 2799.00,
                'discount_pct': 39,
                'sku': 'AVX-SKN-12',
                'stock': 55,
                'rating_avg': 4.8,
                'rating_count': 4100,
                'units_sold': '180k+ sold',
                'badge': 'Organic',
                'description': 'Enriched with squalane, hyaluronic acid, and botanical extracts to restore skin radiance and elasticity.',
                'features': [
                    'Dermatologist tested & hypoallergenic',
                    'Clean vegan formulation free of parabens',
                    'Rapid absorption with zero residue'
                ],
                'images': [
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
                ]
            }
        ]

        for p_info in products_data:
            images = p_info.pop('images')
            product = Product.objects.create(**p_info)
            for idx, img in enumerate(images):
                ProductImage.objects.create(
                    product=product,
                    image_url=img,
                    position=idx,
                    is_primary=(idx == 0)
                )

            # Add sample reviews
            Review.objects.create(
                product=product,
                user_name='Rohit Sharma',
                rating=5,
                comment='Outstanding build quality and comfort. The sound clarity and noise cancelling are remarkable!'
            )
            Review.objects.create(
                product=product,
                user_name='Priya Patel',
                rating=5,
                comment='Fast delivery, securely packed. Looks so elegant in person, exact match with pictures.'
            )
            Review.objects.create(
                product=product,
                user_name='Vikram Malhotra',
                rating=4,
                comment='Great value for money. Battery life easily lasts throughout the week.'
            )

        # Prepopulate Cart with the exact 2 items from the reference mockup!
        cart, _ = Cart.objects.get_or_create(session_id='default_avoxell_session')
        p1 = Product.objects.get(slug='avoxell-propods-wireless-headphones')
        p2 = Product.objects.get(slug='avoxell-backpack')
        CartItem.objects.create(cart=cart, product=p1, quantity=1, variant='Sky Blue')
        CartItem.objects.create(cart=cart, product=p2, quantity=1, variant='Black')

        self.stdout.write(self.style.SUCCESS('Successfully seeded Avoxell database!'))
